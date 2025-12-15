export default function NotificationItem({ notification, onClick, onMarkRead, onDelete }) {
  const getTypeConfig = (type) => {
    const configs = {
      appointment_confirmed: {
        icon: '✅',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20'
      },
      appointment_rejected: {
        icon: '❌',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20'
      },
      appointment_cancelled: {
        icon: '🚫',
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20'
      },
      appointment_reminder: {
        icon: '⏰',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20'
      },
      appointment_request: {
        icon: '📅',
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20'
      },
      new_message: {
        icon: '💬',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20'
      },
      system: {
        icon: '⚙️',
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-50 dark:bg-gray-700/50'
      },
      announcement: {
        icon: '📢',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
      }
    }
    return configs[type] || configs.system
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000) // seconds

    if (diff < 60) return 'Az önce'
    if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`
    if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`
    if (diff < 604800) return `${Math.floor(diff / 86400)} gün önce`

    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const config = getTypeConfig(notification.type)

  return (
    <div
      className={`relative p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition cursor-pointer ${
        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
      }`}
      onClick={onClick}
    >
      {/* Unread Indicator */}
      {!notification.read && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
      )}

      <div className="flex gap-3 ml-2">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 ${config.bgColor} rounded-full flex items-center justify-center text-xl`}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`font-medium text-sm ${
              !notification.read 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
              {formatDate(notification.date)}
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {notification.message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-start gap-1">
          {!notification.read && onMarkRead && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMarkRead(notification.id)
              }}
              className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition"
              title="Okundu olarak işaretle"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(notification.id)
              }}
              className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition"
              title="Sil"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


