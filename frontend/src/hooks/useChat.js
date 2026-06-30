// hooks/useChat.js
// Manages chat state and handles streaming from backend
// This is the brain of our chat UI

import { useState, useRef } from 'react'

const API_URL = import.meta.env.VITE_API_URL

export const useChat = () => {
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const abortControllerRef = useRef(null)

  const sendMessage = async (text) => {
    if (!text.trim() || isStreaming) return

    const token = localStorage.getItem('token')

    // Add user message immediately (optimistic update)
    const userMessage = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])

    // Add empty assistant message — we'll fill it as chunks arrive
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    setIsStreaming(true)
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch(`${API_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: text
        }),
        signal: abortControllerRef.current.signal
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() // keep incomplete line for next chunk

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue

          const jsonStr = line.replace('data: ', '')
          const data = JSON.parse(jsonStr)

          if (data.type === 'conversation_id') {
            setConversationId(data.value)
          } else if (data.type === 'chunk') {
            // Append chunk to the last (assistant) message
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

  const startNewChat = () => {
    setMessages([])
    setConversationId(null)
  }

  return {
    messages,
    isStreaming,
    sendMessage,
    startNewChat
  }
}