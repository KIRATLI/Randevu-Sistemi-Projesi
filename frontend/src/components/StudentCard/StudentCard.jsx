export default function StudentCard({ student, onViewDetail }) {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getYearBadge = (year) => {
    const colors = {
      1: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      2: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
      3: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300',
      4: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300'
    }
    return colors[year] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
  }

  const getGPAColor = (gpa) => {
    if (gpa >= 3.5) return 'text-green-600 dark:text-green-400'
    if (gpa >= 3.0) return 'text-blue-600 dark:text-blue-400'
    if (gpa >= 2.5) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 relative">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-full p-1">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              {getInitials(student.name)}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-lg">
              {student.name}
            </h3>
            <p className="text-blue-100 text-sm">
              {student.studentNo}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getYearBadge(student.year)}`}>
            {student.year}. Sınıf
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Department */}
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {student.department}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {student.faculty}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
            <p className={`text-lg font-bold ${getGPAColor(student.gpa)}`}>
              {student.gpa.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">GPA</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {student.totalAppointments}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Randevu</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {student.completedAppointments}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tamamlanan</p>
          </div>
        </div>

        {/* Last & Next Appointment */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">Son: {formatDate(student.lastAppointment)}</span>
          </div>
          {student.nextAppointment && (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-medium">Sonraki: {formatDate(student.nextAppointment)}</span>
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="truncate">{student.email}</span>
        </div>

        {/* View Detail Button */}
        <button
          onClick={() => onViewDetail(student)}
          className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Detayları Görüntüle
        </button>
      </div>
    </div>
  )
}


