import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'

export default function ScheduleSettings() {
  const [schedule, setSchedule] = useState({
    workingHours: [
      { day: 'monday', dayName: 'Pazartesi', enabled: true, start: '09:00', end: '17:00' },
      { day: 'tuesday', dayName: 'Salı', enabled: true, start: '09:00', end: '17:00' },
      { day: 'wednesday', dayName: 'Çarşamba', enabled: true, start: '09:00', end: '17:00' },
      { day: 'thursday', dayName: 'Perşembe', enabled: true, start: '09:00', end: '17:00' },
      { day: 'friday', dayName: 'Cuma', enabled: true, start: '09:00', end: '17:00' },
      { day: 'saturday', dayName: 'Cumartesi', enabled: false, start: '09:00', end: '17:00' },
      { day: 'sunday', dayName: 'Pazar', enabled: false, start: '09:00', end: '17:00' }
    ],
    slotDuration: 30,
    breakDuration: 15,
    maxAppointmentsPerDay: 10
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadSchedule()
  }, [])

  const loadSchedule = async () => {
    try {
      const response = await api.getSchedule(1) // Mock academician ID
      if (response.success && response.data) {
        // Merge with day names
        const workingHoursWithNames = response.data.workingHours.map(wh => ({
          ...wh,
          dayName: schedule.workingHours.find(s => s.day === wh.day)?.dayName || ''
        }))
        setSchedule({
          ...response.data,
          workingHours: workingHoursWithNames
        })
      }
    } catch (error) {
      console.error('Error loading schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDayToggle = (index) => {
    const newWorkingHours = [...schedule.workingHours]
    newWorkingHours[index].enabled = !newWorkingHours[index].enabled
    setSchedule({ ...schedule, workingHours: newWorkingHours })
  }

  const handleTimeChange = (index, field, value) => {
    const newWorkingHours = [...schedule.workingHours]
    newWorkingHours[index][field] = value
    setSchedule({ ...schedule, workingHours: newWorkingHours })
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      const response = await api.updateSchedule(schedule)
      if (response.success) {
        setMessage('✓ Program ayarları başarıyla kaydedildi!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage('✗ Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setSaving(false)
    }
  }

  const handleQuickSetup = (preset) => {
    let newWorkingHours = [...schedule.workingHours]
    
    if (preset === 'full') {
      // Hafta içi 09:00-17:00
      newWorkingHours = newWorkingHours.map(wh => ({
        ...wh,
        enabled: wh.day !== 'saturday' && wh.day !== 'sunday',
        start: '09:00',
        end: '17:00'
      }))
    } else if (preset === 'half') {
      // Hafta içi 09:00-13:00
      newWorkingHours = newWorkingHours.map(wh => ({
        ...wh,
        enabled: wh.day !== 'saturday' && wh.day !== 'sunday',
        start: '09:00',
        end: '13:00'
      }))
    } else if (preset === 'afternoon') {
      // Hafta içi 13:00-17:00
      newWorkingHours = newWorkingHours.map(wh => ({
        ...wh,
        enabled: wh.day !== 'saturday' && wh.day !== 'sunday',
        start: '13:00',
        end: '17:00'
      }))
    }
    
    setSchedule({ ...schedule, workingHours: newWorkingHours })
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Program Ayarları
          </h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition shadow-md hover:shadow-lg font-medium"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${message.includes('✓') ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'}`}>
            {message}
          </div>
        )}

        {/* Quick Setup */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Hızlı Ayarlar
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleQuickSetup('full')}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Tam Gün (09:00-17:00)
            </button>
            <button
              onClick={() => handleQuickSetup('half')}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Sabah (09:00-13:00)
            </button>
            <button
              onClick={() => handleQuickSetup('afternoon')}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Öğleden Sonra (13:00-17:00)
            </button>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Çalışma Saatleri
          </h2>
          <div className="space-y-4">
            {schedule.workingHours.map((day, index) => (
              <div
                key={day.day}
                className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3 md:w-48">
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={() => handleDayToggle(index)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {day.dayName}
                  </span>
                </div>

                {day.enabled ? (
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600 dark:text-gray-400">
                        Başlangıç:
                      </label>
                      <input
                        type="time"
                        value={day.start}
                        onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <span className="text-gray-500">—</span>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600 dark:text-gray-400">
                        Bitiş:
                      </label>
                      <input
                        type="time"
                        value={day.end}
                        onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400 dark:text-gray-600 italic">
                    Çalışma günü değil
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Appointment Settings */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Randevu Ayarları
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Randevu Süresi (dakika)
              </label>
              <select
                value={schedule.slotDuration}
                onChange={(e) => setSchedule({ ...schedule, slotDuration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value={15}>15 dakika</option>
                <option value={30}>30 dakika</option>
                <option value={45}>45 dakika</option>
                <option value={60}>60 dakika</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Randevular Arası Mola (dakika)
              </label>
              <select
                value={schedule.breakDuration}
                onChange={(e) => setSchedule({ ...schedule, breakDuration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value={0}>Mola yok</option>
                <option value={5}>5 dakika</option>
                <option value={10}>10 dakika</option>
                <option value={15}>15 dakika</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Günlük Maksimum Randevu
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={schedule.maxAppointmentsPerDay}
                onChange={(e) => setSchedule({ ...schedule, maxAppointmentsPerDay: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
            📋 Özet
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li>
              • Çalışma günleri: {schedule.workingHours.filter(d => d.enabled).map(d => d.dayName).join(', ')}
            </li>
            <li>
              • Randevu süresi: {schedule.slotDuration} dakika
            </li>
            <li>
              • Mola süresi: {schedule.breakDuration} dakika
            </li>
            <li>
              • Günlük maksimum randevu: {schedule.maxAppointmentsPerDay}
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}

