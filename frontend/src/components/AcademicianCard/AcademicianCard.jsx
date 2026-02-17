import { Link } from 'react-router-dom'

export default function AcademicianCard({ academician, viewMode = 'grid' }) {
  const getTitleColor = (title) => {
    const colors = {
      'Profesör': 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300',
      'Doçent': 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
      'Dr. Öğretim Üyesi': 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      'Öğretim Görevlisi': 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300',
      'Araştırma Görevlisi': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    }
    return colors[title] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .filter(word => word.length > 2)
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              {getInitials(academician.name)}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {academician.name}
              </h3>
              {!academician.available && (
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-full">
                  Müsait Değil
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTitleColor(academician.title)}`}>
                {academician.title}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {academician.department}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {academician.office}
              </span>
              <span className="flex items-center gap-1">
                ⭐ {academician.rating}
              </span>
              <span className="flex items-center gap-1">
                📅 {academician.totalAppointments} randevu
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex gap-2">
            <Link
              to={`/student/academician/${academician.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Profil & Randevu Al
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Grid View
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition overflow-hidden">
      {/* Header with Gradient */}
      <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600 relative">
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full p-1 shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              {getInitials(academician.name)}
            </div>
          </div>
        </div>
        {!academician.available && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
              Müsait Değil
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pt-10 p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {academician.name}
        </h3>

        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getTitleColor(academician.title)}`}>
          {academician.title}
        </span>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-medium">{academician.department}</span>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-500">
            {academician.faculty}
          </div>

          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{academician.office}</span>
          </div>
        </div>

        {/* Specialization */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
            {academician.specialization}
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-around py-3 mb-4 border-t border-b border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {academician.rating}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">⭐ Puan</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {academician.totalAppointments}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">📅 Randevu</p>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/student/academician/${academician.id}`}
          className={`w-full px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
            academician.available
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profili Görüntüle
        </Link>
      </div>
    </div>
  )
}


