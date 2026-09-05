import { useState } from 'react'

export default function MessageThread({ 
  messages = [], 
  currentUserId, 
  currentUserRole,
  onSendReply,
  onBack 
}) {
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  const sortedMessages = [...messages].sort((a, b) => new Date(a.date) - new Date(b.date))

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSendReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setSending(true)
    await onSendReply(replyText)
    setReplyText('')
    setSending(false)
  }

  const otherPerson = sortedMessages[0]?.senderId === currentUserId 
    ? sortedMessages[0]?.receiverName 
    : sortedMessages[0]?.senderName

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Mesaj bulunamadı</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {otherPerson}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {sortedMessages[0]?.subject}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50 dark:bg-gray-900/50">
        {sortedMessages.map((message) => {
          const isCurrentUser = message.senderId === currentUserId
          
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  isCurrentUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm">
                    {message.senderName}
                  </span>
                  <span className={`text-xs ${
                    isCurrentUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatDateTime(message.date)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Reply Form */}
      <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <form onSubmit={handleSendReply} className="flex gap-3">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Mesajınızı yazın..."
            rows="3"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!replyText.trim() || sending}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition shadow-md hover:shadow-lg font-medium self-end"
          >
            {sending ? '...' : 'Gönder'}
          </button>
        </form>
      </div>
    </div>
  )
}


