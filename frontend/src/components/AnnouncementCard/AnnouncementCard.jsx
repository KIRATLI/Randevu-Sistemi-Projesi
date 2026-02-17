export default function AnnouncementCard({ announcement, onEdit, onDelete, onView }) {
  const getTypeConfig = (type) => {
    const configs = {
      info: {
        icon: 'ℹ️',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        textColor: 'text-blue-800 dark:text-blue-300',
        badgeColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
      },
      warning: {
        icon: '⚠️',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        textColor: 'text-yellow-800 dark:text-yellow-300',
        badgeColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
      },
      success: {
        icon: '✅',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        textColor: 'text-green-800 dark:text-green-300',
        badgeColor: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
      },
      error: {
        icon: '❌',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        textColor: 'text-red-800 dark:text-red-300',
        badgeColor: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
      }
    }
    return configs[type] || configs.info
  }

  const getPriorityBadge = (priority) => {
    const badges = {
      high: { text: '🔴 Yüksek', color: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300' },
      medium: { text: '🟡 Orta', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300' },
      low: { text: '🟢 Düşük', color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' }
    }
    return badges[priority] || badges.medium
  }

  const getAudienceBadge = (audience) => {
    const badges = {
      all: { text: '👥 Herkes', color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300' },
      student: { text: '👨‍🎓 Öğrenciler', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' },
      academician: { text: '👨‍🏫 Akademisyenler', color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' },
      admin: { text: '👨‍💼 Adminler', color: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300' }
    }
    return badges[audience] || badges.all
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: '✓ Aktif', color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' },
      archived: { text: '📦 Arşivlendi', color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300' },
      draft: { text: '📝 Taslak', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300' }
    }
    return badges[status] || badges.active
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const config = getTypeConfig(announcement.type)
  const priorityBadge = getPriorityBadge(announcement.priority)
  const audienceBadge = getAudienceBadge(announcement.targetAudience)
  const statusBadge = getStatusBadge(announcement.status)

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 hover:shadow-lg transition`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-3xl">{config.icon}</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {announcement.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityBadge.color}`}>
                {priorityBadge.text}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${audienceBadge.color}`}>
                {audienceBadge.text}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                {statusBadge.text}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onView && (
            <button
              onClick={() => onView(announcement)}
              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
              title="Görüntüle"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(announcement)}
              className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition"
              title="Düzenle"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(announcement)}
              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
              title="Sil"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className={`text-sm ${config.textColor} mb-3 line-clamp-3`}>
        {announcement.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDate(announcement.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {announcement.views} görüntüleme
          </span>
        </div>
        {announcement.expiresAt && (
          <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDate(announcement.expiresAt)} tarihinde sona erecek
          </span>
        )}
      </div>
    </div>
  )
}


