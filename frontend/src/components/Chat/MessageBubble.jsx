// components/Chat/MessageBubble.jsx
// Renders a single chat message — user or assistant

const MessageBubble = ({ role, content, isStreaming }) => {
  const isUser = role === 'user'

  return (
    <div className={`flex gap-2.5 max-w-[80%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 ${
          isUser ? 'bg-[#333] text-[#ccc]' : 'bg-[#7c6af7] text-white'
        }`}
      >
        {isUser ? 'U' : 'e'}
      </div>

      {/* Bubble */}
      <div
        className={`px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-[#7c6af7] text-white'
            : 'bg-[#222] text-[#ddd] border border-[#2a2a2a]'
        }`}
      >
        {content}
        {isStreaming && (
          <span className="inline-block w-0.5 h-3.5 bg-[#7c6af7] ml-0.5 animate-pulse"></span>
        )}
      </div>
    </div>
  )
}

export default MessageBubble