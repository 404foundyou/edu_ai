// components/Chat/InputBar.jsx
// Text input + send button at the bottom of chat

import { useState } from 'react'

const InputBar = ({ onSend, isStreaming }) => {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (!text.trim() || isStreaming) return
    onSend(text)
    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="px-5 py-4 border-t border-[#2a2a2a]">
      <div className="flex items-end gap-2 bg-[#222] border border-[#333] rounded-xl px-3 py-2.5 focus-within:border-[#7c6af7] transition-colors">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="flex-1 bg-transparent outline-none text-[#ddd] text-[13px] resize-none placeholder-[#555]"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || isStreaming}
          className="w-[30px] h-[30px] rounded-lg bg-[#7c6af7] hover:bg-[#6a5ae0] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default InputBar