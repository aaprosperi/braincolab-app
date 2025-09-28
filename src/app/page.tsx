'use client'

import { useState } from 'react'

export default function Home() {
  const [selectedModel, setSelectedModel] = useState('claude')
  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState<Array<{role: string, content: string}>>([]) 

  const models = [
    { id: 'claude', name: 'Claude 3.5', provider: 'Anthropic' },
    { id: 'gemini', name: 'Gemini Pro', provider: 'Google' },
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add user message to conversation
    setConversation(prev => [...prev, { role: 'user', content: message }])
    setMessage('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...conversation, { role: 'user', content: message }],
          model: selectedModel
        })
      })

      const data = await response.json()
      // TODO: Add AI response to conversation
      console.log(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">BrainColab AI</h1>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
          >
            {models.map(model => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.provider})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4">
        <div className="h-[60vh] overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-900">
          {conversation.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg mb-2">Bienvenido a BrainColab AI</p>
              <p className="text-sm">Selecciona un modelo y comienza a chatear</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversation.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            className="flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Enviar
          </button>
        </form>
      </div>
    </main>
  )
}