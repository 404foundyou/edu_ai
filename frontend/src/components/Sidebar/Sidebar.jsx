// components/Sidebar/Sidebar.jsx
// Full sidebar — logo, new chat, search, conversation list, user footer

import { useState, useEffect } from 'react'
import ConversationList from './ConversationList'
import { useAuth } from '../../context/AuthContext'
import client from '../../api/client'

const Sidebar = ({ onSelectConversation, onNewChat, activeConversationId }) => {
  const { user, logout } = useAuth()
  const [conversations, setConversations] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  // Load conversations on mount
  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const res = await client.get('/history/')
      setConversations(res.data)
    } catch (err) {
      console.error('Failed to load conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await client.delete(`/history/${id}`)
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (activeConversationId === id) onNewChat()
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  const handleNewChat = () => {
    onNewChat()
  }

  // Filter conversations by search
  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  // Expose refresh function so parent can call it
  Sidebar.refresh = fetchConversations

  return (
    <div className="w-60 bg-[#171717] border-r border-[#2a2a2a] flex flex-col h-full">

      {/* Header */}
      <div className="px-3 py-3 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#7c6af7]"></div>
            <span className="text-white text-sm font-medium">edu_ai</span>
          </div>
          <button
            onClick={handleNewChat}
            className="w-7 h-7 rounded-lg hover:bg-[#2a2a2a] flex items-center justify-center text-[#666] hover:text-white transition-colors"
            title="New chat"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-[#222] border border-[#2a2a2a] rounded-lg px-2.5 py-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats"
            className="bg-transparent outline-none text-[#aaa] text-[12px] w-full placeholder-[#444]"
          />
        </div>
      </div>

      {/* Conversation list */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#7c6af7] animate-pulse"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#444] text-[12px]">
            {search ? 'No results' : 'No conversations yet'}
          </p>
        </div>
      ) : (
        <ConversationList
          conversations={filtered}
          activeId={activeConversationId}
          onSelect={onSelectConversation}
          onDelete={handleDelete}
        />
      )}

      {/* Footer */}
      <div className="px-3 py-3 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#222] cursor-pointer group">
          <div className="w-6 h-6 rounded-full bg-[#7c6af7] flex items-center justify-center text-white text-[10px] font-medium flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="text-[#aaa] text-[12px] flex-1 truncate">{user?.name}</span>
          <button
            onClick={logout}
            className="hidden group-hover:block text-[#555] hover:text-red-400 transition-colors"
            title="Logout"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  )
}

export default Sidebar