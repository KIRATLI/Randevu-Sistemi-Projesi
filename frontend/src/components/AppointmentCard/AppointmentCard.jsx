export default function AppointmentCard({ appointment, onView, onApprove, onReject, onCancel, userRole }) {
  const statusColors = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
    confirmed: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
    rejected: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300',
    cancelled: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
    completed: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
  }

  const statusTexts = {
    pending: 'Onay Bekliyor',
    confirmed: 'Onaylandı',
    rejected: 'Reddedildi',
    cancelled: 'İptal Edildi',
    completed: 'Tamamlandı',
  }

  const statusIcons = {
    pending: '⏳',
    confirmed: '✅',
    rejected: '❌',
    cancelled: '🚫',
    completed: '✓',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {userRole === 'student' ? appointment.academicianName : appointment.studentName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {appointment.subject || 'Randevu Konusu Belirtilmemiş'}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
          {statusIcons[appointment.status]} {statusTexts[appointment.status]}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">{appointment.date}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{appointment.time}</span>
          {appointment.duration && (
            <span className="ml-2 text-xs">({appointment.duration} dk)</span>
          )}
        </div>
        {userRole === 'academician' && appointment.studentNo && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Öğrenci No: {appointment.studentNo}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {onView && (
          <button
            onClick={() => onView(appointment)}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-medium"
          >
            Detaylar
          </button>
        )}

        {userRole === 'academician' && appointment.status === 'pending' && (
          <>
            {onApprove && (
              <button
                onClick={() => onApprove(appointment)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
              >
                Onayla
              </button>
            )}
            {onReject && (
              <button
                onClick={() => onReject(appointment)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
              >
                Reddet
              </button>
            )}
          </>
        )}

        {userRole === 'student' && 
         (appointment.status === 'pending' || appointment.status === 'confirmed') && 
         onCancel && (
          <button
            onClick={() => onCancel(appointment)}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
          >
            İptal Et
          </button>
        )}
      </div>
    </div>
  )
}


