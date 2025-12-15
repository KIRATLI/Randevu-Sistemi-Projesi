import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout'
import AppointmentCalendar from '../../../components/AppointmentCalendar/AppointmentCalendar'
import { api } from '../../../utils/api'

export default function StudentDashboard() {
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
        // Filter by student (mock: studentId = 1)
        const studentAppointments = response.data.filter(apt => apt.studentId === 1)
        setAppointments(studentAppointments)
      }
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    active: appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  }

  const upcomingAppointments = appointments
    .filter(apt => {
      const aptDate = new Date(`${apt.date} ${apt.time}`)
      return aptDate > new Date() && (apt.status === 'confirmed' || apt.status === 'pending')
    })
    .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`))
    .slice(0, 3)

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Öğrenci Dashboard
          </h1>
          <Link
            to="/student/academicians"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md hover:shadow-lg font-medium"
          >
            + Yeni Randevu
          </Link>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90 mb-1">
                  Aktif Randevular
                </h3>
                <p className="text-3xl font-bold">{stats.active}</p>
              </div>
              <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90 mb-1">
                  Onay Bekleyen
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
                  Tamamlanan
                </h3>
                <p className="text-3xl font-bold">{stats.completed}</p>
              </div>
              <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              📅 Randevu Takvimi
            </h2>
            <Link
              to="/student/appointments"
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

        {/* Upcoming Appointments */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Yaklaşan Randevular
          </h2>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">
                Yaklaşan randevunuz bulunmuyor
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {new Date(apt.date).getDate()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(apt.date).toLocaleDateString('tr-TR', { month: 'short' })}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {apt.academicianName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {apt.time} • {apt.subject || 'Randevu'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    apt.status === 'confirmed' 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                      : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                  }`}>
                    {apt.status === 'confirmed' ? 'Onaylı' : 'Bekliyor'}
                  </span>
                </div>
              ))}
            </div>
          )}
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
                  <span className="font-medium text-gray-700 dark:text-gray-300">Konu:</span>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedAppointment.subject}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Link
                  to="/student/appointments"
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

