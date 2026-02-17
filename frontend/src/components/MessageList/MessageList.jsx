export default function MessageList({ messages = [], onMessageClick, currentUserId, currentUserRole }) {
  const groupedMessages = {}
  
  // Group messages by thread
  messages.forEach(msg => {
    if (!groupedMessages[msg.threadId]) {
      groupedMessages[msg.threadId] = []
    }
    groupedMessages[msg.threadId].push(msg)
  })

  // Get latest message from each thread
  const latestMessages = Object.values(groupedMessages).map(thread => {
    return thread.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
  })

  // Sort by date
  const sortedMessages = latestMessages.sort((a, b) => new Date(b.date) - new Date(a.date))

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Dün'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('tr-TR', { weekday: 'long' })
    } else {
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
    }
  }

  const getOtherPerson = (message) => {
    if (currentUserRole === 'student') {
      return message.senderRole === 'academician' ? message.senderName : message.receiverName
    } else {
      return message.senderRole === 'student' ? message.senderName : message.receiverName
    }
  }

  const isUnread = (message) => {
    return !message.read && message.receiverId === currentUserId
  }

  if (sortedMessages.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Henüz mesajınız yok
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {sortedMessages.map((message) => (
        <button
          key={message.id}
          onClick={() => onMessageClick(message)}
          className={`w-full text-left px-4 md:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${
            isUnread(message) ? 'bg-blue-50 dark:bg-blue-900/10' : ''
          }`}
        >
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
              isUnread(message) 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {message.senderRole === 'academician' || message.receiverRole === 'academician' ? '👨‍🏫' : '👨‍🎓'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className={`font-semibold truncate ${
                  isUnread(message) 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {getOtherPerson(message)}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {formatDate(message.date)}
                </span>
              </div>
              
              <p className={`text-sm mb-1 truncate ${
                isUnread(message) 
                  ? 'text-gray-900 dark:text-white font-medium' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {message.subject}
              </p>
              
              <p className="text-sm text-gray-500 dark:text-gray-500 truncate">
                {message.content}
              </p>
            </div>

            {/* Unread Badge */}
            {isUnread(message) && (
              <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}


