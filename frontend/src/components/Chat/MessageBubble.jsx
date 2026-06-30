// components/Chat/MessageBubble.jsx
// Renders a single chat message with markdown support + actions

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const MessageBubble = ({ role, content, isStreaming, onRegenerate, onEdit }) => {
  const isUser = role === 'user'
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(content)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleEditSubmit = () => {
    if (editText.trim() && editText !== content) {
      onEdit(editText)
    }
    setIsEditing(false)
  }

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

      <div className="flex flex-col gap-1.5 min-w-0">
        {/* Bubble */}
        {isEditing ? (
          <div className="bg-[#222] border border-[#7c6af7] rounded-xl p-2.5">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-transparent text-[#ddd] text-[13px] outline-none resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleEditSubmit}
                className="px-3 py-1 bg-[#7c6af7] text-white text-xs rounded-md"
              >
                Save & submit
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-[#333] text-[#ccc] text-xs rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed ${
              isUser
                ? 'bg-[#7c6af7] text-white'
                : 'bg-[#222] text-[#ddd] border border-[#2a2a2a]'
            }`}
          >
            {isUser ? (
              <span className="whitespace-pre-wrap">{content}</span>
            ) : (
              <div className="markdown-body">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ borderRadius: '8px', fontSize: '12px', margin: '8px 0' }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-[#333] px-1.5 py-0.5 rounded text-[12px]" {...props}>
                          {children}
                        </code>
                      )
                    },
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
            {isStreaming && (
              <span className="inline-block w-0.5 h-3.5 bg-[#7c6af7] ml-0.5 animate-pulse"></span>
            )}
          </div>
        )}

        {/* Actions */}
        {!isEditing && !isStreaming && content && (
          <div className={`flex gap-1.5 ${isUser ? 'self-end' : 'self-start'}`}>
            <button
              onClick={handleCopy}
              className="px-2 py-1 bg-transparent border border-[#333] hover:border-[#444] rounded text-[10px] text-[#666] hover:text-[#aaa] transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            {isUser ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-2 py-1 bg-transparent border border-[#333] hover:border-[#444] rounded text-[10px] text-[#666] hover:text-[#aaa] transition-colors"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={onRegenerate}
                className="px-2 py-1 bg-transparent border border-[#333] hover:border-[#444] rounded text-[10px] text-[#666] hover:text-[#aaa] transition-colors"
              >
                Regenerate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBubble