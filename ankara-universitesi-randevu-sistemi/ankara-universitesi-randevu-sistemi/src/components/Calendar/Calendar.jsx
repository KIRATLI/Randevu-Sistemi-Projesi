import { useState } from 'react'

export default function Calendar({ selectedDate, onDateSelect, availableSlots = [], bookedSlots = [] }) {
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

  const isSelected = (day) => {
    if (!selectedDate) return false
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const isPast = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const hasAvailableSlots = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return availableSlots.includes(dateStr)
  }

  const isFullyBooked = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return bookedSlots.includes(dateStr)
  }

  const handleDateClick = (day) => {
    if (isPast(day) || isFullyBooked(day)) return
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    onDateSelect(date)
  }

  const renderCalendarDays = () => {
    const days = []
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-12 md:h-16" />
      )
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const past = isPast(day)
      const today = isToday(day)
      const selected = isSelected(day)
      const available = hasAvailableSlots(day)
      const fullyBooked = isFullyBooked(day)

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={past || fullyBooked}
          className={`
            h-12 md:h-16 rounded-lg flex items-center justify-center text-sm md:text-base font-medium
            transition-all relative
            ${past ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed' : ''}
            ${fullyBooked ? 'bg-red-100 dark:bg-red-900/20 text-red-500 cursor-not-allowed' : ''}
            ${selected ? 'bg-blue-600 text-white shadow-lg scale-105' : ''}
            ${!selected && !past && !fullyBooked ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white' : ''}
            ${today && !selected ? 'ring-2 ring-blue-500' : ''}
            ${available && !selected && !past && !fullyBooked ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : ''}
          `}
        >
          {day}
          {available && !past && !fullyBooked && !selected && (
            <span className="absolute bottom-1 w-1 h-1 bg-green-500 rounded-full" />
          )}
        </button>
      )
    }

    return days
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
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
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 dark:bg-green-900/20 border border-green-500 rounded" />
          <span className="text-gray-600 dark:text-gray-400">Müsait</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded" />
          <span className="text-gray-600 dark:text-gray-400">Seçili</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 dark:bg-red-900/20 border border-red-500 rounded" />
          <span className="text-gray-600 dark:text-gray-400">Dolu</span>
        </div>
      </div>
    </div>
  )
}


