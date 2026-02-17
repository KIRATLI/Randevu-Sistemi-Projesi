import { useState } from 'react'

export default function AppointmentCalendar({ appointments = [], onAppointmentClick }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ]

  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1

    return { daysInMonth, startingDayOfWeek }
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth)

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const isToday = (day) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }

  const getAppointmentsForDay = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return appointments.filter(apt => apt.date === dateStr)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-green-500',
      rejected: 'bg-red-500',
      cancelled: 'bg-gray-500',
      completed: 'bg-blue-500',
    }
    return colors[status] || 'bg-gray-500'
  }

  const renderCalendarDays = () => {
    const days = []
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-24 md:min-h-32 bg-gray-50 dark:bg-gray-900/50" />
      )
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const today = isToday(day)
      const dayAppointments = getAppointmentsForDay(day)

      days.push(
        <div
          key={day}
          className={`min-h-24 md:min-h-32 border border-gray-200 dark:border-gray-700 p-1 md:p-2 overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
            today ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500' : 'bg-white dark:bg-gray-800'
          }`}
        >
          <div className={`text-sm md:text-base font-semibold mb-1 ${
            today ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
          }`}>
            {day}
          </div>
          
          <div className="space-y-1">
            {dayAppointments.slice(0, 3).map((apt) => (
              <button
                key={apt.id}
                onClick={() => onAppointmentClick?.(apt)}
                className={`w-full text-left px-1 md:px-2 py-1 rounded text-xs hover:opacity-80 transition ${getStatusColor(apt.status)} text-white truncate`}
                title={`${apt.time} - ${apt.studentName || apt.academicianName}`}
              >
                <div className="flex items-center gap-1">
                  <span className="font-medium">{apt.time}</span>
                  <span className="truncate">{apt.studentName || apt.academicianName}</span>
                </div>
              </button>
            ))}
            {dayAppointments.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 px-1 md:px-2">
                +{dayAppointments.length - 3} daha
              </div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        {dayNames.map((day) => (
          <div
            key={day}
            className="py-2 md:py-3 text-center text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded" />
          <span className="text-gray-600 dark:text-gray-400">Bekleyen</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span className="text-gray-600 dark:text-gray-400">Onaylı</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span className="text-gray-600 dark:text-gray-400">Tamamlandı</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span className="text-gray-600 dark:text-gray-400">Reddedildi</span>
        </div>
      </div>
    </div>
  )
}


