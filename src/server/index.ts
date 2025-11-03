import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { streamText, convertToModelMessages } from 'ai'
import { openai } from '@ai-sdk/openai'
import { serve } from '@hono/node-server'

const app = new Hono()

app.use('/*', cors())

app.post('/api/chat', async (c) => {
  try {
    const { messages } = await c.req.json()
    console.log('Received messages:', messages)

    // Convert UIMessage[] to ModelMessage[]
    const modelMessages = convertToModelMessages(messages)

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: modelMessages,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Error in /api/chat:', error)
    return c.json({ error: 'Internal server error', details: String(error) }, 500)
  }
})

const port = 3001

serve({
  fetch: app.fetch,
  port,
})

console.log(`Server is running on http://localhost:${port}`)
