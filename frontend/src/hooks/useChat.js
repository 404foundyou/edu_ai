// hooks/useChat.js
// Manages chat state and handles streaming from backend

import { useState, useRef } from 'react'

const API_URL = import.meta.env.VITE_API_URL

export const useChat = () => {
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [conversationId, setConversationId] = useState(null)

  const streamFromEndpoint = async (endpoint, body) => {
    const token = localStorage.getItem('token')
    setIsStreaming(true)

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue

          const data = JSON.parse(line.replace('data: ', ''))

          if (data.type === 'conversation_id') {
            setConversationId(data.value)
          } else if (data.type === 'chunk') {
            setMessages((prev) => {
              const updated = [...prev]
              const lastIndex = updated.length - 1
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: updated[lastIndex].content + data.value
              }
              return updated
            })
          } else if (data.type === 'done') {
            setIsStreaming(false)
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error)
      setIsStreaming(false)
    }
  }

  const sendMessage = async (text) => {
    if (!text.trim() || isStreaming) return

    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    await streamFromEndpoint('/chat/stream', {
      conversation_id: conversationId,
      message: text
    })
  }

  const regenerateLastMessage = async () => {
    if (isStreaming || !conversationId) return

    // Remove last assistant message from UI, add fresh empty one
    setMessages((prev) => {
      const updated = [...prev]
      updated[updated.length - 1] = { role: 'assistant', content: '' }
      return updated
    })

    await streamFromEndpoint('/chat/regenerate', {
      conversation_id: conversationId,
      message: ''
    })
  }

  const editMessage = async (index, newText) => {
    if (isStreaming) return

    // Keep messages up to (not including) the edited one, update it, remove everything after
    setMessages((prev) => {
      const updated = prev.slice(0, index)
      return [...updated, { role: 'user', content: newText }, { role: 'assistant', content: '' }]
    })

    await streamFromEndpoint('/chat/stream', {
      conversation_id: conversationId,
      message: newText
    })
  }

  const startNewChat = () => {
    setMessages([])
    setConversationId(null)
  }

  return {
    messages,
    isStreaming,
    sendMessage,
    regenerateLastMessage,
    editMessage,
    startNewChat
  }
}