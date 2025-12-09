import { useState, useEffect, useRef, useMemo } from 'react'
import axios from 'axios'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'

const API_BASE = 'http://localhost:5000'
const QUICK_QUESTIONS = [
  'Where is my order?',
  'What is your return policy?',
  'Recommend a product',
  'Do you offer cash on delivery?',
  'When will my item arrive?'
]

function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your AI Customer Support Assistant. I can help you with:\n• Order status (e.g., ORD12345)\n• Return and refund policies\n• Product recommendations\n• Shipping information\n• General questions\n\nHow can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const pingBackend = async () => {
      try {
        await axios.get(`${API_BASE}/api/health`)
        setIsOnline(true)
      } catch (error) {
        setIsOnline(false)
      }
    }

    pingBackend()
    const interval = setInterval(pingBackend, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = async (messageText) => {
    const trimmed = messageText.trim()
    if (!trimmed) return

    // Add user message
    const userMessage = {
      text: trimmed,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setInputValue('')

    try {
      const response = await axios.post(`${API_BASE}/api/chat`, {
        message: trimmed
      })

      // Add bot response
      const botMessage = {
        text: response.data.reply,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please make sure the backend server is running on port 5000.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setIsOnline(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickSelect = (question) => {
    setInputValue(question)
    handleSendMessage(question)
  }

  const statusBadge = useMemo(() => {
    return {
      label: isOnline ? 'Online' : 'Offline',
      className: isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
      dotClass: isOnline ? 'bg-green-500' : 'bg-red-500'
    }
  }, [isOnline])

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-24 sm:right-6 w-[calc(100%-32px)] sm:w-96 h-[70vh] sm:h-[620px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col border border-gray-200 animate-slide-up overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary to-primary-600 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary font-bold shadow-inner">
              AI
            </div>
            <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${statusBadge.dotClass}`}></span>
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Customer Support</h3>
            <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-2 ${statusBadge.className}`}>
              <span className={`w-2 h-2 rounded-full ${statusBadge.dotClass}`} />
              {statusBadge.label}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-blue-100 transition"
          aria-label="Close chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </button>
      </div>

      {/* Quick Questions */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <p className="text-sm text-muted mb-2">Quick questions</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((question) => (
            <button
              key={question}
              onClick={() => handleQuickSelect(question)}
              className="text-xs bg-blue-50 text-primary-600 px-3 py-2 rounded-full hover:bg-primary hover:text-white transition shadow-sm"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              text={message.text}
              sender={message.sender}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-3 shadow border border-gray-100">
                <p className="text-xs text-muted mb-1">Assistant is typing…</p>
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSendMessage={handleSendMessage}
        disabled={isLoading}
      />
    </div>
  )
}

export default ChatWindow

