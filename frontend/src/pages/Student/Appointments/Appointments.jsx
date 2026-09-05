import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import AppointmentCard from '../../../components/AppointmentCard/AppointmentCard'
import AppointmentCalendar from '../../../components/AppointmentCalendar/AppointmentCalendar'
import { api } from '../../../utils/api'

export default function StudentAppointments() {
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('all') // all, upcoming, past, pending, confirmed
  const [viewMode, setViewMode] = useState('list') // 'list' or 'calendar'
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const response = await api.getAppointments()
      if (response.success) {
        setAppointments(response.data.items || response.data)
      }
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAppointment = async (appointment) => {
    if (!confirm(`"${appointment.academicianName}" ile ${appointment.date} ${appointment.time} randevunuzu iptal etmek istediğinize emin misiniz?`)) {
      return
    }

    try {
      const response = await api.cancelAppointment(appointment.id, 'Öğrenci tarafından iptal edildi')
      if (response.success) {
        alert('✓ Randevu iptal edildi')
        loadAppointments()
      }
    } catch (error) {
      alert('✗ Bir hata oluştu')
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true
    if (filter === 'upcoming') {
      return apt.status === 'confirmed' && new Date(`${apt.date} ${apt.time}`) > new Date()
    }
    if (filter === 'past') {
      return new Date(`${apt.date} ${apt.time}`) < new Date()
    }
    return apt.status === filter
  })

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  }

  if (loading) {
    return (
      <DashboardLayout userRole="student">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Randevularım
          </h1>
          <button
            onClick={() => window.location.href = '/student/academicians'}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md hover:shadow-lg font-medium"
          >
            + Yeni Randevu
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">Toplam</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">Bekleyen</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">Onaylı</p>
            <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">Tamamlanan</p>
            <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
          </div>
        </div>

        {/* View Mode Toggle & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Tümü ({stats.total})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Yaklaşan
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Bekleyen ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'confirmed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Onaylı ({stats.confirmed})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'past'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Geçmiş
          </button>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              📋 Liste
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              📅 Takvim
            </button>
          </div>
        </div>

        {/* Appointments List or Calendar */}
        {viewMode === 'calendar' ? (
          <AppointmentCalendar
            appointments={filteredAppointments}
            onAppointmentClick={setSelectedAppointment}
          />
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <svg className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              {filter === 'all' ? 'Henüz randevunuz yok' : 'Bu kategoride randevu bulunamadı'}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => window.location.href = '/student/academicians'}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
              >
                İlk Randevunuzu Oluşturun
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                userRole="student"
                onView={setSelectedAppointment}
                onCancel={handleCancelAppointment}
              />
            ))}
          </div>
        )}

        {/* Appointment Detail Modal (Simple) */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedAppointment(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Randevu Detayları
                </h3>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Akademisyen:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{selectedAppointment.academicianName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Tarih:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{selectedAppointment.date}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Saat:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{selectedAppointment.time}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Durum:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{selectedAppointment.status}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Konu:</span>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedAppointment.subject}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

