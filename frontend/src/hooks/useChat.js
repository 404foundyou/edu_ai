// hooks/useChat.js
// Manages chat state, streaming, and conversation loading

import { useState } from 'react'
import client from '../api/client'

const API_URL = import.meta.env.VITE_API_URL

export const useChat = ({ onConversationCreated, onTitleGenerated } = {}) => {
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [conversationId, setConversationId] = useState(null)

  // Load an existing conversation from DB
  const loadConversation = async (id) => {
    try {
      const res = await client.get(`/history/${id}`)
      setMessages(res.data.map((msg) => ({
        role: msg.role,
        content: msg.content
      })))
      setConversationId(id)
    } catch (err) {
      console.error('Failed to load conversation:', err)
    }
  }

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
            if (!conversationId) {
              setConversationId(data.value)
              if (onConversationCreated) onConversationCreated(data.value)
            }
          } else if (data.type === 'title') {
            // Notify parent to update sidebar title
            if (onTitleGenerated) onTitleGenerated(data.value)
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

    setMessages((prev) => {
      const updated = prev.slice(0, index)
      return [...updated, { role: 'user', content: newText }, { role: 'assistant', content: '' }]
    })

    await streamFromEndpoint('/chat/stream', {
      conversation_id: conversationId,
      message: newText
    })
  }

  const resetChat = () => {
    setMessages([])
    setConversationId(null)
  }

  return {
    messages,
    isStreaming,
    sendMessage,
    regenerateLastMessage,
    editMessage,
    loadConversation,
    resetChat
  }
}