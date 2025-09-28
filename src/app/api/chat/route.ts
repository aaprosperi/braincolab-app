import { streamText } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { NextResponse } from 'next/server'
import { getModelConfig, ModelId } from '@/lib/ai-providers'

// Configurar los proveedores
const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: process.env.AI_GATEWAY_URL ? `${process.env.AI_GATEWAY_URL}/v1/anthropic` : undefined
})

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  baseURL: process.env.AI_GATEWAY_URL ? `${process.env.AI_GATEWAY_URL}/v1/google` : undefined
})

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_GATEWAY_URL ? `${process.env.AI_GATEWAY_URL}/v1/openai` : undefined
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages, model: modelId } = body

    // Validación de entrada
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    if (!modelId || !['claude', 'gemini', 'gpt4'].includes(modelId)) {
      return NextResponse.json(
        { error: 'Valid model selection is required (claude, gemini, gpt4)' },
        { status: 400 }
      )
    }

    // Obtener configuración del modelo
    const modelConfig = getModelConfig(modelId as ModelId)
    
    // Seleccionar el proveedor correcto
    let model
    switch (modelId) {
      case 'claude':
        model = anthropic(modelConfig.model)
        break
      case 'gemini':
        model = google(modelConfig.model)
        break
      case 'gpt4':
        model = openai(modelConfig.model)
        break
      default:
        throw new Error('Invalid model selected')
    }

    // Si las API keys no están configuradas, devolver respuesta mock
    if (!process.env.ANTHROPIC_API_KEY && !process.env.GOOGLE_API_KEY && !process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        role: 'assistant',
        content: `[Modo Demo] Respuesta simulada de ${modelConfig.name}. Configura las API keys en Vercel para usar los modelos reales.`,
        model: modelId,
        timestamp: new Date().toISOString()
      })
    }

    // Generar respuesta con streaming
    const result = await streamText({
      model,
      messages,
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Para esta versión inicial, convertimos el stream a texto completo
    let fullResponse = ''
    for await (const chunk of result.textStream) {
      fullResponse += chunk
    }

    return NextResponse.json({
      role: 'assistant',
      content: fullResponse,
      model: modelId,
      provider: modelConfig.provider,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('API Error:', error)
    
    // Manejo de errores específicos
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API key not configured for selected model' },
          { status: 401 }
        )
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Error processing request. Please try again.' },
      { status: 500 }
    )
  }
}

// Configurar el runtime de edge para mejor rendimiento
export const runtime = 'edge'
