// components/Chat/ChatWindow.jsx
// Main chat container with persona switcher

import { useEffect, useRef, useState } from 'react'
import MessageBubble from './MessageBubble'
import InputBar from './InputBar'
import PersonaSwitcher from './PersonaSwitcher'
import { useChat } from '../../hooks/useChat'

const ChatWindow = ({ loadedMessages, onConversationCreated, onTitleGenerated }) => {
  const [persona, setPersona] = useState('default')

  const {
    messages,
    isStreaming,
    sendMessage,
    regenerateLastMessage,
    editMessage,
    loadConversation,
    resetChat
  } = useChat({ onConversationCreated, onTitleGenerated, persona })

  const bottomRef = useRef(null)

  useEffect(() => {
    if (!loadedMessages) return
    if (loadedMessages.conversationId === null) {
      resetChat()
    } else if (loadedMessages.conversationId) {
      loadConversation(loadedMessages.conversationId)
    }
  }, [loadedMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 flex flex-col bg-[#1a1a1a]">

      {/* Top bar */}
      <div className="flex items-center justify-end px-5 py-2.5 border-b border-[#2a2a2a]">
        <PersonaSwitcher selected={persona} onSelect={setPersona} />
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#7c6af7] flex items-center justify-center text-white font-semibold text-lg">
              e
            </div>
            <p className="text-[#ccc] text-base font-medium">edu_ai</p>
            <p className="text-[#555] text-xs">Ask me anything to get started</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              role={msg.role}
              content={msg.content}
              isStreaming={isStreaming && idx === messages.length - 1 && msg.role === 'assistant'}
              onRegenerate={regenerateLastMessage}
              onEdit={(newText) => editMessage(idx, newText)}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <InputBar onSend={sendMessage} isStreaming={isStreaming} />
    </div>
  )
}

export default ChatWindow