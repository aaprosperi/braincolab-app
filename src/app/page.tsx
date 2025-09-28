'use client'

import { useState } from 'react'
import { AI_MODELS } from '@/lib/ai-providers'

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<keyof typeof AI_MODELS>('claude')
  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState<Array<{role: string, content: string, model?: string}>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const userMessage = message
    setMessage('')
    setError(null)
    
    // Add user message to conversation
    setConversation(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...conversation, { role: 'user', content: userMessage }],
          model: selectedModel
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en la respuesta')
      }

      // Add AI response to conversation
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: data.content,
        model: AI_MODELS[selectedModel].name
      }])
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
      // Add error message to conversation
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error instanceof Error ? error.message : 'No se pudo obtener respuesta'}`,
        model: AI_MODELS[selectedModel].name
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const clearConversation = () => {
    setConversation([])
    setError(null)
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BrainColab AI</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Multi-AI Assistant Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={selectedModel} 
                onChange={(e) => setSelectedModel(e.target.value as keyof typeof AI_MODELS)}
                className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                disabled={isLoading}
              >
                {Object.entries(AI_MODELS).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.name} ({config.provider})
                  </option>
                ))}
              </select>
              {conversation.length > 0 && (
                <button
                  onClick={clearConversation}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  Limpiar chat
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4">
        <div className="h-[65vh] overflow-y-auto border rounded-lg p-4 mb-4 bg-white dark:bg-gray-900">
          {conversation.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-lg mb-2 font-medium">Bienvenido a BrainColab AI</p>
                <p className="text-sm">Selecciona un modelo y comienza a chatear</p>
                <div className="mt-4 text-xs">
                  <p>💡 Tip: Puedes cambiar entre modelos en cualquier momento</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {conversation.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                    {msg.role === 'assistant' && msg.model && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">
                        {msg.model}
                      </p>
                    )}
                    <div className={`p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : msg.content.startsWith('Error:')
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            className="flex-1 px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </span>
            ) : 'Enviar'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-900 py-3">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>Powered by Vercel AI Gateway • Claude, Gemini & OpenAI</p>
        </div>
      </footer>
    </main>
  )
}
