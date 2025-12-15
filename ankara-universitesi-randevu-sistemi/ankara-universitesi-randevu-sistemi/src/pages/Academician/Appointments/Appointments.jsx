import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import AppointmentCard from '../../../components/AppointmentCard/AppointmentCard'
import AppointmentCalendar from '../../../components/AppointmentCalendar/AppointmentCalendar'
import { api } from '../../../utils/api'

export default function AcademicianAppointments() {
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('all')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'calendar'
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const response = await api.getAppointments()
      if (response.success) {
        // Filter by academician (mock: academicianId = 1)
        const academicianAppointments = response.data.filter(apt => apt.academicianId === 1)
        setAppointments(academicianAppointments)
      }
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (appointment) => {
    if (!confirm(`${appointment.studentName} öğrencisinin ${appointment.date} ${appointment.time} randevusunu onaylamak istediğinize emin misiniz?`)) {
      return
    }

    try {
      const response = await api.approveAppointment(appointment.id)
      if (response.success) {
        alert('✓ Randevu onaylandı')
        loadAppointments()
      }
    } catch (error) {
      alert('✗ Bir hata oluştu')
    }
  }

  const handleReject = (appointment) => {
    setSelectedAppointment(appointment)
    setShowRejectModal(true)
  }

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      alert('Lütfen red nedeni belirtin')
      return
    }

    try {
      const response = await api.rejectAppointment(selectedAppointment.id, rejectReason)
      if (response.success) {
        alert('✓ Randevu reddedildi')
        setShowRejectModal(false)
        setRejectReason('')
        setSelectedAppointment(null)
        loadAppointments()
      }
    } catch (error) {
      alert('✗ Bir hata oluştu')
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0]
      return apt.date === today && apt.status === 'confirmed'
    }
    if (filter === 'upcoming') {
      return apt.status === 'confirmed' && new Date(`${apt.date} ${apt.time}`) > new Date()
    }
    return apt.status === filter
  })

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    today: appointments.filter(a => {
      const today = new Date().toISOString().split('T')[0]
      return a.date === today && a.status === 'confirmed'
    }).length,
  }

  if (loading) {
    return (
      <DashboardLayout userRole="academician">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="academician">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Randevu Yönetimi
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">Toplam</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">Bugün</p>
            <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">Bekleyen</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">Onaylı</p>
            <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
          </div>
        </div>

        {/* Alert for pending appointments */}
        {stats.pending > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="font-medium text-yellow-800 dark:text-yellow-300">
                  {stats.pending} randevu talebi onay bekliyor
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Lütfen bekleyen talepleri inceleyin ve onaylayın/reddedin
                </p>
              </div>
            </div>
          </div>
        )}

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
            onClick={() => setFilter('today')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Bugün ({stats.today})
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
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Yaklaşan
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
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Bu kategoride randevu bulunamadı
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                userRole="academician"
                onView={setSelectedAppointment}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowRejectModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Randevu Reddetme
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                <strong>{selectedAppointment?.studentName}</strong> öğrencisinin randevusunu reddetmek üzeresiniz.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Red Nedeni (Öğrenci görecek)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Örn: O saatte başka bir toplantım var, lütfen farklı bir saat seçin"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectReason('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  İptal
                </button>
                <button
                  onClick={confirmReject}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Reddet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

