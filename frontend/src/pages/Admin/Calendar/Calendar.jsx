import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/tr'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'

// Set Turkish locale
moment.locale('tr')
const localizer = momentLocalizer(moment)

export default function CalendarView() {
    const [appointments, setAppointments] = useState([])
    const [events, setEvents] = useState([])
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [view, setView] = useState('month')
    const [filter, setFilter] = useState('all')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAppointments()
    }, [])

    useEffect(() => {
        // Convert appointments to calendar events
        const calendarEvents = appointments
            .filter(apt => {
                if (filter === 'all') return true
                return apt.status === filter
            })
            .map(apt => {
                const startDate = new Date(`${apt.date}T${apt.time}`)
                const endDate = new Date(startDate.getTime() + apt.duration * 60000)

                return {
                    id: apt.id,
                    title: `${apt.studentName} - ${apt.academicianName}`,
                    start: startDate,
                    end: endDate,
                    resource: apt,
                    status: apt.status
                }
            })

        setEvents(calendarEvents)
    }, [appointments, filter])

    const loadAppointments = async () => {
        setLoading(true)
        try {
            const response = await api.getAppointments()
            if (response.success) {
                setAppointments(response.data)
            }
        } catch (error) {
            console.error('Randevular yüklenemedi:', error)
        } finally {
            setLoading(false)
        }
    }

    const eventStyleGetter = (event) => {
        let backgroundColor = '#3B82F6'

        switch (event.status) {
            case 'confirmed':
                backgroundColor = '#10B981'
                break
            case 'pending':
                backgroundColor = '#F59E0B'
                break
            case 'cancelled':
                backgroundColor = '#EF4444'
                break
            case 'completed':
                backgroundColor = '#8B5CF6'
                break
            default:
                backgroundColor = '#6B7280'
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        }
    }

    const handleSelectEvent = (event) => {
        setSelectedEvent(event.resource)
    }

    const handleSelectSlot = (slotInfo) => {
        console.log('Slot selected:', slotInfo)
        // Here you can add logic to create new appointment
    }

    const getStatusBadge = (status) => {
        const statusMap = {
            'confirmed': { label: 'Onaylandı', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
            'pending': { label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
            'cancelled': { label: 'İptal', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
            'completed': { label: 'Tamamlandı', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
        }
        const statusInfo = statusMap[status] || statusMap['pending']
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                {statusInfo.label}
            </span>
        )
    }

    if (loading) {
        return (
            <DashboardLayout userRole="admin">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout userRole="admin">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            📅 Randevu Takvimi
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Tüm randevuları takvim görünümünde inceleyin
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        >
                            <option value="all">📊 Tüm Randevular</option>
                            <option value="confirmed">✅ Onaylandı</option>
                            <option value="pending">⏳ Bekliyor</option>
                            <option value="cancelled">❌ İptal</option>
                            <option value="completed">✔️ Tamamlandı</option>
                        </select>
                        <button
                            onClick={loadAppointments}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Yenile
                        </button>
                    </div>
                </div>

                {/* Legend */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Durum Göstergeleri:</span>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Onaylandı</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Bekliyor</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">İptal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-purple-500 rounded"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Tamamlandı</span>
                        </div>
                        <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
                            Toplam: <span className="font-bold">{events.length}</span> randevu
                        </div>
                    </div>
                </div>

                {/* Calendar */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden" style={{ height: '700px' }}>
                    <style>{`
            .rbc-calendar {
              font-family: inherit;
            }
            .rbc-header {
              padding: 12px 0;
              font-weight: 600;
              border-bottom: 2px solid #e5e7eb;
              background-color: #f9fafb;
            }
            .dark .rbc-header {
              background-color: #374151;
              border-color: #4b5563;
              color: #f3f4f6;
            }
            .rbc-today {
              background-color: #dbeafe;
            }
            .dark .rbc-today {
              background-color: #1e3a8a;
            }
            .rbc-off-range-bg {
              background-color: #f3f4f6;
            }
            .dark .rbc-off-range-bg {
              background-color: #1f2937;
            }
            .rbc-event {
              padding: 2px 5px;
              font-size: 0.875rem;
            }
            .rbc-toolbar button {
              color: #374151;
              border: 1px solid #d1d5db;
              padding: 8px 16px;
              border-radius: 6px;
              background-color: white;
            }
            .dark .rbc-toolbar button {
              color: #f3f4f6;
              border-color: #4b5563;
              background-color: #374151;
            }
            .rbc-toolbar button:active,
            .rbc-toolbar button.rbc-active {
              background-color: #3b82f6;
              color: white;
              border-color: #3b82f6;
            }
            .rbc-month-view, .rbc-time-view {
              border: 1px solid #e5e7eb;
            }
            .dark .rbc-month-view, .dark .rbc-time-view {
              border-color: #4b5563;
              color: #f3f4f6;
            }
            .rbc-day-bg, .rbc-time-slot {
              border-color: #e5e7eb;
            }
            .dark .rbc-day-bg, .dark .rbc-time-slot {
              border-color: #4b5563;
            }
            .rbc-label {
              color: #6b7280;
            }
            .dark .rbc-label {
              color: #9ca3af;
            }
          `}</style>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%', padding: '20px' }}
                        onSelectEvent={handleSelectEvent}
                        onSelectSlot={handleSelectSlot}
                        selectable
                        eventPropGetter={eventStyleGetter}
                        view={view}
                        onView={(newView) => setView(newView)}
                        messages={{
                            next: "Sonraki",
                            previous: "Önceki",
                            today: "Bugün",
                            month: "Ay",
                            week: "Hafta",
                            day: "Gün",
                            agenda: "Ajanda",
                            date: "Tarih",
                            time: "Saat",
                            event: "Randevu",
                            noEventsInRange: "Bu aralıkta randevu yok",
                            showMore: (total) => `+${total} daha`
                        }}
                    />
                </div>

                {/* Event Details Modal */}
                {selectedEvent && (
                    <>
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={() => setSelectedEvent(null)}
                        />
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
                                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        📅 Randevu Detayları
                                    </h2>
                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Öğrenci</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{selectedEvent.studentName}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{selectedEvent.studentNo}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Akademisyen</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{selectedEvent.academicianName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Tarih & Saat</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {selectedEvent.date} - {selectedEvent.time}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{selectedEvent.duration} dakika</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Durum</p>
                                            <div className="mt-1">
                                                {getStatusBadge(selectedEvent.status)}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Konu</p>
                                        <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                            {selectedEvent.subject}
                                        </p>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={() => setSelectedEvent(null)}
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                        >
                                            Kapat
                                        </button>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                            Düzenle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}
