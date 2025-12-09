const axios = require('axios')

const SYSTEM_PROMPT = `You are the AI Customer Support Assistant for shopywiz, an e-commerce platform.
Provide concise, friendly, and factual answers.
You can help with:
- Order status lookup
- Return and refund policies
- Product recommendations
- Shipping and delivery questions
- FAQs about payments, delivery, and support hours

Always guide the user to share an order ID (e.g., ORD12345) for tracking.`

const providers = {
  OPENAI: 'openai',
  GROQ: 'groq',
  OLLAMA: 'ollama',
  FALLBACK: 'fallback'
}

function detectProvider() {
  if (process.env.OPENAI_API_KEY) return providers.OPENAI
  if (process.env.GROQ_API_KEY) return providers.GROQ
  if (process.env.OLLAMA_BASE_URL || process.env.OLLAMA_MODEL) return providers.OLLAMA
  return providers.FALLBACK
}

function buildMessages(userMessage, context) {
  const contextString = context
    ? `Context:\nOrders: ${context.orders?.map(o => o.orderId).join(', ') || 'N/A'}\nProducts: ${context.products?.map(p => p.name).join(', ') || 'N/A'}\nFAQs: ${context.faqs?.length || 0} entries.`
    : ''

  return [
    { role: 'system', content: `${SYSTEM_PROMPT}\n${contextString}`.trim() },
    { role: 'user', content: userMessage }
  ]
}

async function callOpenAI(messages) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      temperature: 0.4,
      max_tokens: 500
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  )

  return response.data.choices[0].message.content
}

async function callGroq(messages) {
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      messages,
      temperature: 0.4,
      max_tokens: 500
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  )

  return response.data.choices[0].message.content
}

async function callOllama(messages) {
  const baseUrl = (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/$/, '')
  const model = process.env.OLLAMA_MODEL || 'llama3'

  const response = await axios.post(`${baseUrl}/api/chat`, { model, messages })
  if (response.data?.message?.content) return response.data.message.content
  if (Array.isArray(response.data?.messages)) {
    const last = response.data.messages[response.data.messages.length - 1]
    return last?.content || 'I could not generate a response right now.'
  }
  return 'I could not generate a response right now.'
}

async function generateLLMResponse(userMessage, context = {}) {
  const provider = detectProvider()
  const messages = buildMessages(userMessage, context)

  try {
    if (provider === providers.OPENAI) return await callOpenAI(messages)
    if (provider === providers.GROQ) return await callGroq(messages)
    if (provider === providers.OLLAMA) return await callOllama(messages)
  } catch (error) {
    console.error('LLM provider error:', error.message)
  }

  return `I understand you're asking about "${userMessage}". I can help with order tracking (share your order ID), returns, shipping times, or recommend products. What would you like to know?`
}

module.exports = {
  generateLLMResponse
}

