// components/Sidebar/ConversationList.jsx
// Groups conversations by Today, Yesterday, Older

const groupByDate = (conversations) => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const groups = { Today: [], Yesterday: [], Older: [] }

  conversations.forEach((conv) => {
    const date = new Date(conv.updated_at)
    if (date.toDateString() === today.toDateString()) {
      groups.Today.push(conv)
    } else if (date.toDateString() === yesterday.toDateString()) {
      groups.Yesterday.push(conv)
    } else {
      groups.Older.push(conv)
    }
  })

  return groups
}

const ConversationList = ({ conversations, activeId, onSelect, onDelete }) => {
  const groups = groupByDate(conversations)

  return (
    <div className="flex flex-col gap-1 overflow-y-auto flex-1 px-2 py-1">
      {Object.entries(groups).map(([label, convs]) => {
        if (convs.length === 0) return null
        return (
          <div key={label}>
            <p className="text-[#555] text-[11px] uppercase tracking-wide px-2 py-2">
              {label}
            </p>
            {convs.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={`group flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  activeId === conv.id
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-[#aaa] hover:bg-[#222] hover:text-white'
                }`}
              >
                <span className="text-[12px] truncate flex-1">{conv.title}</span>

                {/* Delete button — shows on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(conv.id)
                  }}
                  className="hidden group-hover:flex items-center justify-center w-5 h-5 rounded hover:bg-[#333] text-[#666] hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default ConversationList