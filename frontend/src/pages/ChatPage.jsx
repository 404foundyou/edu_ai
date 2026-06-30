// pages/ChatPage.jsx
// Main chat page — sidebar + chat window

import ChatWindow from '../components/Chat/ChatWindow'

const ChatPage = () => {
  return (
    <div className="flex h-screen bg-[#1a1a1a]">
      {/* Sidebar */}
      <div className="w-60 bg-[#171717] border-r border-[#2a2a2a]">
        <p className="text-white p-4 text-sm">Sidebar coming soon</p>
      </div>

      {/* Main chat area */}
      <ChatWindow />
    </div>
  )
}

export default ChatPage