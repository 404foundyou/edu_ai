// pages/ChatPage.jsx
// Main chat page — sidebar + chat window connected together

import { useState, useCallback } from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import ChatWindow from '../components/Chat/ChatWindow'

const ChatPage = () => {
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [loadedMessages, setLoadedMessages] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSelectConversation = (conv) => {
    setActiveConversationId(conv.id)
    setLoadedMessages({ conversationId: conv.id })
  }

  const handleNewChat = () => {
    setActiveConversationId(null)
    setLoadedMessages({ conversationId: null })
  }

  const handleConversationCreated = (id) => {
    setActiveConversationId(id)
    setRefreshKey((prev) => prev + 1)
  }

  // When title is generated — refresh sidebar to show new title
  const handleTitleGenerated = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  return (
    <div className="flex h-screen bg-[#1a1a1a]">
      <Sidebar
        key={refreshKey}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        activeConversationId={activeConversationId}
      />
      <ChatWindow
        loadedMessages={loadedMessages}
        onConversationCreated={handleConversationCreated}
        onTitleGenerated={handleTitleGenerated}
      />
    </div>
  )
}

export default ChatPage