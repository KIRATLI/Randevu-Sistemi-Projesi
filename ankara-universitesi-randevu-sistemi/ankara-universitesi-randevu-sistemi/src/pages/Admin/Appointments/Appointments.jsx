import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'

export default function Appointments() {
    const [appointments, setAppointments] = useState([])
    const [filteredAppointments, setFilteredAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [formData, setFormData] = useState({
        studentId: '',
        academicianId: '',
        date: '',
        time: '',
        duration: 30,
        subject: ''
    })

    useEffect(() => {
        loadAppointments()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [appointments, searchQuery, statusFilter])

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

    const applyFilters = () => {
        let filtered = [...appointments]

        if (searchQuery) {
            filtered = filtered.filter(apt =>
                apt.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                apt.academicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                apt.subject.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(apt => apt.status === statusFilter)
        }

        setFilteredAppointments(filtered)
    }

    const handleCancelAppointment = async (appointment) => {
        if (window.confirm(`"${appointment.subject}" randevusunu iptal etmek istediğinize emin misiniz?`)) {
            try {
                const response = await api.cancelAppointment(appointment.id, 'Admin tarafından iptal edildi')
                if (response.success) {
                    setAppointments(appointments.map(a =>
                        a.id === appointment.id ? { ...a, status: 'cancelled' } : a
                    ))
                    alert('✓ Randevu iptal edildi')
                }
            } catch (error) {
                console.error('İptal hatası:', error)
                alert('✗ Randevu iptal edilemedi')
            }
        }
    }

    const handleAddAppointment = () => {
        setFormData({
            studentId: '',
            academicianId: '',
            date: '',
            time: '',
            duration: 30,
            subject: ''
        })
        setShowForm(true)
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await api.createAppointment({
                ...formData,
                status: 'confirmed'
            })
            if (response.success) {
                await loadAppointments()
                alert('✓ Randevu oluşturuldu')
                setShowForm(false)
            }
        } catch (error) {
            console.error('Randevu oluşturma hatası:', error)
            alert('✗ Randevu oluşturulamadı')
        }
    }

    const getStatusBadge = (status) => {
        const statusMap = {
            'confirmed': { label: 'Onaylandı', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
            'pending': { label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
            'cancelled': { label: 'İptal', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
            'rejected': { label: 'Reddedildi', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
            'completed': { label: 'Tamamlandı', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' }
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
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            📅 Randevu Yönetimi
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Toplam {filteredAppointments.length} randevu
                        </p>
                    </div>
                    <button
                        onClick={handleAddAppointment}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Randevu Oluştur
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 relative">
                            <input
                                type="text"
                                placeholder="🔍 Öğrenci, akademisyen veya konu ile ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                            <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                <option value="all">📊 Tüm Durumlar</option>
                                <option value="confirmed">✅ Onaylandı</option>
                                <option value="pending">⏳ Bekliyor</option>
                                <option value="cancelled">❌ İptal</option>
                                <option value="completed">✔️ Tamamlandı</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Toplam</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{appointments.length}</p>
                            </div>
                            <div className="text-3xl">📊</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Onaylı</p>
                                <p className="text-2xl font-bold text-green-600">{appointments.filter(a => a.status === 'confirmed').length}</p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Bekliyor</p>
                                <p className="text-2xl font-bold text-yellow-600">{appointments.filter(a => a.status === 'pending').length}</p>
                            </div>
                            <div className="text-3xl">⏳</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">İptal</p>
                                <p className="text-2xl font-bold text-red-600">{appointments.filter(a => a.status === 'cancelled').length}</p>
                            </div>
                            <div className="text-3xl">❌</div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Öğrenci</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Akademisyen</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tarih & Saat</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Konu</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Durum</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredAppointments.map((appointment) => (
                                    <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{appointment.studentName}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{appointment.studentNo}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{appointment.academicianName}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-gray-300">{appointment.date}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{appointment.time} ({appointment.duration} dk)</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{appointment.subject}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(appointment.status)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                                                <button
                                                    onClick={() => handleCancelAppointment(appointment)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    İptal Et
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowForm(false)} />
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                        Yeni Randevu Oluştur
                                    </h2>
                                    <form onSubmit={handleFormSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Öğrenci ID *
                                                </label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={formData.studentId}
                                                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                    placeholder="Örn: 1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Akademisyen ID *
                                                </label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={formData.academicianId}
                                                    onChange={(e) => setFormData({ ...formData, academicianId: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                    placeholder="Örn: 1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Tarih *
                                                </label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={formData.date}
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Saat *
                                                </label>
                                                <input
                                                    type="time"
                                                    required
                                                    value={formData.time}
                                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Süre (dakika) *
                                                </label>
                                                <select
                                                    required
                                                    value={formData.duration}
                                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="15">15 dakika</option>
                                                    <option value="30">30 dakika</option>
                                                    <option value="45">45 dakika</option>
                                                    <option value="60">60 dakika</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Konu *
                                                </label>
                                                <textarea
                                                    required
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                    rows="3"
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                    placeholder="Randevu konusu..."
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-4 mt-6">
                                            <button
                                                type="button"
                                                onClick={() => setShowForm(false)}
                                                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                            >
                                                İptal
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                Oluştur
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}
