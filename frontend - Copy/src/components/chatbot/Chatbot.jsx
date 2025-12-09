import { useState } from 'react'
import ChatIcon from './ChatIcon'
import ChatWindow from './ChatWindow'

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Floating Chat Icon */}
      <div
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/40 blur-xl animate-ping-slow" />
          <div className="bg-navy text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:shadow-[0_20px_50px_rgba(79,70,229,0.35)] transition transform hover:scale-110">
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <ChatIcon />
            )}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  )
}

export default Chatbot

