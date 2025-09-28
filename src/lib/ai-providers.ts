// Configuración de los proveedores de IA a través de Vercel AI Gateway

export const AI_MODELS = {
  claude: {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    endpoint: 'anthropic',
    model: 'claude-3-5-sonnet-20241022'
  },
  gemini: {
    id: 'gemini-pro',
    name: 'Gemini 1.5 Pro', 
    provider: 'Google',
    endpoint: 'google',
    model: 'gemini-1.5-pro-latest'
  },
  gpt4: {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    endpoint: 'openai',
    model: 'gpt-4-turbo-preview'
  }
}

export type ModelId = keyof typeof AI_MODELS

export function getModelConfig(modelId: ModelId) {
  return AI_MODELS[modelId]
}

// Configuración para Vercel AI Gateway
export function getGatewayUrl(provider: string) {
  const baseUrl = process.env.AI_GATEWAY_URL || 'https://gateway.vercel.sh'
  return `${baseUrl}/v1/${provider}`
}
