<template>
  <div class="app-container">
    <div class="chat-container">
      <div class="chat-header">
        <h1>AI Chat App</h1>
        <p>Powered by Vue3 + Hono + AI SDK (UIMessage)</p>
      </div>

      <div class="messages-container" ref="messagesContainer">
        <div
          v-for="(message, index) in chat.messages"
          :key="index"
          :class="['message', message.role]"
        >
          <div class="message-bubble">
            <strong>{{ message.role === 'user' ? 'You' : 'AI' }}:</strong>
            <div class="message-content">
              <template v-for="(part, partIndex) in message.parts" :key="partIndex">
                <p v-if="part.type === 'text'">{{ part.text }}</p>
              </template>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="input-form">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="Type your message..."
          :disabled="chat.isLoading"
          class="message-input"
        />
        <button type="submit" :disabled="chat.isLoading || !inputMessage.trim()" class="send-button">
          {{ chat.isLoading ? 'Sending...' : 'Send' }}
        </button>
      </form>
    </div>

    <div class="debug-panel">
      <div class="debug-header">
        <h2>UIMessage Debug Panel</h2>
        <span class="message-count">{{ chat.messages.length }} messages</span>
      </div>
      <div class="debug-content">
        <pre><code>{{ formattedMessages }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, computed } from 'vue'
import { Chat } from '@ai-sdk/vue'

const chat = new Chat({
  api: '/api/chat',
  messages: []
})

const inputMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const formattedMessages = computed(() => {
  return JSON.stringify(chat.messages, null, 2)
})

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const handleSubmit = async () => {
  if (!inputMessage.value.trim() || chat.isLoading) return

  const message = inputMessage.value
  inputMessage.value = ''

  chat.sendMessage({ text: message })

  scrollToBottom()
}

// メッセージが更新されたらスクロール
watch(() => chat.messages.length, () => {
  scrollToBottom()
}, { deep: true })
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  background: #f5f5f5;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 2px solid #e0e0e0;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chat-header h1 {
  margin: 0;
  font-size: 28px;
}

.chat-header p {
  margin: 5px 0 0 0;
  font-size: 14px;
  opacity: 0.9;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  width: 100%;
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.message.user .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message.assistant .message-bubble {
  background: white;
  color: #333;
}

.message-bubble strong {
  display: block;
  margin-bottom: 5px;
  font-size: 12px;
  opacity: 0.8;
}

.message-content p {
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.input-form {
  display: flex;
  gap: 10px;
  padding: 20px;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.message-input:focus {
  border-color: #667eea;
}

.message-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.send-button {
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.debug-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  overflow: hidden;
}

.debug-header {
  background: #2d2d2d;
  color: #ffffff;
  padding: 15px 20px;
  border-bottom: 1px solid #3e3e3e;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.debug-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #4ec9b0;
}

.message-count {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.debug-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.debug-content pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #d4d4d4;
}

.debug-content code {
  color: #ce9178;
}

.debug-content::-webkit-scrollbar {
  width: 10px;
}

.debug-content::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.debug-content::-webkit-scrollbar-thumb {
  background: #3e3e3e;
  border-radius: 5px;
}

.debug-content::-webkit-scrollbar-thumb:hover {
  background: #4e4e4e;
}
</style>
