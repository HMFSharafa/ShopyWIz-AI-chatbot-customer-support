import React from 'react'

function MessageBubble({ text, sender, timestamp }) {
  const isUser = sender === 'user'
  const timeString = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-600 text-white flex items-center justify-center text-xs font-semibold shadow">
          AI
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary text-white rounded-br-none shadow-md'
            : 'bg-white text-gray-800 rounded-bl-none shadow border border-gray-100'
        }`}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">{text}</div>
        <div
          className={`text-[11px] mt-2 flex ${isUser ? 'justify-end text-blue-100' : 'justify-start text-gray-500'}`}
        >
          {timeString}
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold shadow-inner">
          You
        </div>
      )}
    </div>
  )
}

export default MessageBubble


