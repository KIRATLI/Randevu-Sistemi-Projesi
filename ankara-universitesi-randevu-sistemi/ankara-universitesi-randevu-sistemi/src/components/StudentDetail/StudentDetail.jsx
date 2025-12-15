import { useState, useEffect } from 'react'
import { api } from '../../utils/api'

export default function StudentDetail({ student, onClose }) {
  const [studentDetail, setStudentDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('info') // 'info' or 'appointments'

  useEffect(() => {
    loadStudentDetail()
  }, [student.id])

  const loadStudentDetail = async () => {
    setLoading(true)
    try {
      const response = await api.getStudentDetail(student.id)
      if (response.success) {
        setStudentDetail(response.data)
      }
    } catch (error) {
      console.error('Öğrenci detayları yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateTime = (date, time) => {
    return `${formatDate(date)} - ${time}`
  }

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { text: '✓ Onaylandı', color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' },
      pending: { text: '⏳ Bekliyor', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300' },
      completed: { text: '✓ Tamamlandı', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' },
      cancelled: { text: '✗ İptal', color: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300' },
      rejected: { text: '✗ Reddedildi', color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300' }
    }
    return badges[status] || badges.pending
  }

  if (loading || !studentDetail) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-full p-1">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl">
                {getInitials(studentDetail.name)}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">
                {studentDetail.name}
              </h2>
              <p className="text-blue-100">
                {studentDetail.studentNo} • {studentDetail.year}. Sınıf
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {studentDetail.gpa.toFixed(2)}
              </div>
              <div className="text-blue-100 text-sm">GPA</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-3 border-b-2 font-medium transition ${
                activeTab === 'info'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📋 Bilgiler
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-3 border-b-2 font-medium transition ${
                activeTab === 'appointments'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📅 Randevu Geçmişi ({studentDetail.appointments.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'info' ? (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {studentDetail.totalAppointments}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Toplam Randevu
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {studentDetail.completedAppointments}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Tamamlanan
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {studentDetail.cancelledAppointments}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    İptal Edilen
                  </p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">E-posta</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {studentDetail.email}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Telefon</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {studentDetail.phone}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bölüm</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {studentDetail.department}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fakülte</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {studentDetail.faculty}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kayıt Tarihi</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(studentDetail.registrationDate)}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Durum</p>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    ✓ Aktif
                  </p>
                </div>
              </div>

              {/* Notes */}
              {studentDetail.notes && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    📝 Notlar
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {studentDetail.notes}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {studentDetail.appointments.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  Randevu geçmişi bulunamadı
                </div>
              ) : (
                studentDetail.appointments.map((appointment) => {
                  const badge = getStatusBadge(appointment.status)
                  return (
                    <div
                      key={appointment.id}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            {appointment.subject}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            📅 {formatDateTime(appointment.date, appointment.time)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                          {badge.text}
                        </span>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          💬 {appointment.notes}
                        </p>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
}


