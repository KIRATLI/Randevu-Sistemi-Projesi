import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout'
import AppointmentCalendar from '../../../components/AppointmentCalendar/AppointmentCalendar'
import { api } from '../../../utils/api'

export default function AcademicianDashboard() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

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

  const today = new Date().toISOString().split('T')[0]
  
  const stats = {
    today: appointments.filter(a => a.date === today && a.status === 'confirmed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    totalStudents: new Set(appointments.map(a => a.studentId)).size,
  }

  const todayAppointments = appointments
    .filter(apt => apt.date === today && apt.status === 'confirmed')
    .sort((a, b) => a.time.localeCompare(b.time))

  const pendingAppointments = appointments
    .filter(apt => apt.status === 'pending')
    .slice(0, 3)

  const handleQuickApprove = async (appointment) => {
    try {
      const response = await api.approveAppointment(appointment.id)
      if (response.success) {
        loadAppointments()
      }
    } catch (error) {
      console.error('Error approving appointment:', error)
    }
  }

  return (
    <DashboardLayout userRole="academician">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Akademisyen Dashboard
          </h1>
          <Link
            to="/academician/schedule"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md hover:shadow-lg font-medium"
          >
            ⚙️ Program Ayarları
          </Link>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90 mb-1">
                  Bugünkü Randevular
                </h3>
                <p className="text-3xl font-bold">{stats.today}</p>
              </div>
              <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90 mb-1">
                  Bekleyen Talepler
                </h3>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90 mb-1">
                  Toplam Öğrenci
                </h3>
                <p className="text-3xl font-bold">{stats.totalStudents}</p>
              </div>
              <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Alert for pending */}
        {stats.pending > 0 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="font-medium text-orange-800 dark:text-orange-300">
                  {stats.pending} randevu talebi onay bekliyor
                </p>
              </div>
              <Link
                to="/academician/appointments"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition text-sm font-medium"
              >
                İncele
              </Link>
            </div>
          </div>
        )}

        {/* Calendar View */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              📅 Randevu Takvimi
            </h2>
            <Link
              to="/academician/appointments"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Tümünü Gör →
            </Link>
          </div>
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <AppointmentCalendar
              appointments={appointments}
              onAppointmentClick={setSelectedAppointment}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📋 Bugünün Programı
            </h2>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">
                  Bugün randevunuz yok
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div className="text-center min-w-[60px]">
                      <div className="text-lg font-bold text-green-700 dark:text-green-400">
                        {apt.time}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {apt.studentName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {apt.subject || 'Randevu'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Requests */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ⏳ Bekleyen Talepler
            </h2>
            {pendingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">
                  Bekleyen talep yok
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {apt.studentName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {apt.date} • {apt.time}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickApprove(apt)}
                      className="w-full mt-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm font-medium"
                    >
                      ✓ Hızlı Onayla
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Appointment Detail Modal */}
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
                  <span className="font-medium text-gray-700 dark:text-gray-300">Öğrenci:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{selectedAppointment.studentName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Öğrenci No:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{selectedAppointment.studentNo}</span>
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
                  <span className="font-medium text-gray-700 dark:text-gray-300">Konu:</span>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedAppointment.subject}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Link
                  to="/academician/appointments"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-center"
                >
                  Tüm Randevular
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

