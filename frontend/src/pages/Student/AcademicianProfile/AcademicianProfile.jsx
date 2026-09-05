import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../../layouts/DashboardLayout'
import Calendar from '../../../components/Calendar/Calendar'
import TimeSlotPicker from '../../../components/TimeSlotPicker/TimeSlotPicker'
import { api } from '../../../utils/api'

export default function AcademicianProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [academician, setAcademician] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [availableDates, setAvailableDates] = useState([])
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadAcademicianData()
    loadAvailableDates()
  }, [id])

  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots()
    }
  }, [selectedDate])

  const loadAcademicianData = async () => {
    try {
      const response = await api.getAcademician(id)
      if(response.success) {
        setAcademician(response.data)
      }
    } catch (error) {
      console.error('Error loading academician:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableDates = async () => {
    try {
      const now = new Date()
      const response = await api.getAvailableDates(id, now.getMonth() + 1, now.getFullYear())
      if (response.success) {
        setAvailableDates(response.data)
      }
    } catch (error) {
      console.error('Error loading available dates:', error)
    }
  }

  const loadAvailableSlots = async () => {
    setLoadingSlots(true)
    setSelectedSlot(null)
    try {
      //toISOString zaman kayması yaşatıyor. Istanbul +3:00
      const dateStr = [
          selectedDate.getFullYear(),
          String(selectedDate.getMonth() + 1).padStart(2, '0'),
          String(selectedDate.getDate()).padStart(2, '0')
      ].join('-')
      console.log('Seçilen date:', dateStr)
      const response = await api.getAvailableSlots(dateStr, id)
      console.log('Gönderilen dateStr:', dateStr)
      if (response.success) {
        setAvailableSlots(response.data)
      }
    } catch (error) {
      console.error('Error loading slots:', error)
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedDate || !selectedSlot) {
      alert('Lütfen tarih ve saat seçiniz')
      return
    }

    const currentUser = JSON.parse(localStorage.getItem('user'))

    setSubmitting(true)
    try {
      const appointmentData = {
        academicianId: parseInt(id),
        date: [
            selectedDate.getFullYear(),
            String(selectedDate.getMonth() + 1).padStart(2, '0'),
            String(selectedDate.getDate()).padStart(2, '0')
        ].join('-'),
        time: selectedSlot.time,
        subject: subject,
      }

      const response = await api.createAppointment(appointmentData)
      if (response.success) {
        alert('✓ Randevu talebiniz oluşturuldu! Akademisyen onayı bekleniyor.')
        navigate('/student/appointments')
      }
    } catch (error) {
      alert('✗ Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setSubmitting(false)
    }
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

  if (!academician) {
    return (
      <DashboardLayout userRole="student">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Akademisyen bulunamadı</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        {/* Academician Info Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-xl p-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl">
              👨‍🏫
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{academician.name}</h1>
              <p className="text-blue-100 text-lg mb-4">{academician.title}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{academician.office}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{academician.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{academician.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{academician.scheduleText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About & Specializations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Hakkında
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {academician.bio}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Uzmanlık Alanları
            </h2>
            <div className="flex flex-wrap gap-2">
              {academician.specializations.map((spec, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Appointment Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              📅 Randevu Al
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <Calendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  availableSlots={availableDates}
                />
              </div>

              {/* Time Slots */}
              <div>
                {selectedDate ? (
                  <TimeSlotPicker
                    slots={availableSlots}
                    selectedSlot={selectedSlot}
                    onSlotSelect={setSelectedSlot}
                    loading={loadingSlots}
                  />
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400">
                      Lütfen önce bir tarih seçin
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Subject */}
            {selectedDate && selectedSlot && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Randevu Konusu
                </label>
                <textarea
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Görüşmek istediğiniz konuyu kısaca açıklayın..."
                  required
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          {selectedDate && selectedSlot && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Seçilen Randevu</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} - {selectedSlot.time}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition shadow-md hover:shadow-lg font-medium text-lg"
                >
                  {submitting ? 'Gönderiliyor...' : 'Randevu Talep Et'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  )
}

