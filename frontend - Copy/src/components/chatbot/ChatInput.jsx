function ChatInput({ value, onChange, onSendMessage, disabled }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedInput = value.trim()
    if (trimmedInput && !disabled) {
      onSendMessage(trimmedInput)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about orders, returns, recommendations..."
          disabled={disabled}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={!value.trim() || disabled}
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatInput

