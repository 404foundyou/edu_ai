// pages/ChatPage.jsx
// Main chat page — shown after login
// Contains sidebar + chat window

const ChatPage = () => {
  return (
    <div className="flex h-screen bg-[#1a1a1a]">
      {/* Sidebar */}
      <div className="w-60 bg-[#171717] border-r border-[#2a2a2a]">
        <p className="text-white p-4">Sidebar coming soon</p>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#666]">Chat coming in Phase 5</p>
      </div>
    </div>
  )
}

export default ChatPage