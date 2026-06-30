// components/Chat/ChatWindow.jsx
// Main chat container — shows messages + input bar

import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import InputBar from './InputBar'
import { useChat } from '../../hooks/useChat'

const ChatWindow = () => {
  const { messages, isStreaming, sendMessage } = useChat()
  const bottomRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 flex flex-col bg-[#1a1a1a]">
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
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <InputBar onSend={sendMessage} isStreaming={isStreaming} />
    </div>
  )
}

export default ChatWindow