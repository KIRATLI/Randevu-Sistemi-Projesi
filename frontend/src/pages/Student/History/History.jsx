import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function History() {
    const [appointments, setAppointments] = useState([])
    const [filteredAppointments, setFilteredAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        loadAppointments()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [appointments, filter, searchQuery])

    const loadAppointments = async () => {
        setLoading(true)
        try {
            const response = await api.getAppointments()
            if (response.success) {
                // Filter only past appointments for history
                const now = new Date()
                const pastAppointments = response.data.filter(apt => {
                    const aptDate = new Date(`${apt.date}T${apt.time}`)
                    return aptDate < now
                })
                setAppointments(pastAppointments)
            }
        } catch (error) {
            console.error('Randevular yüklenemedi:', error)
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let filtered = [...appointments]

        if (filter !== 'all') {
            filtered = filtered.filter(apt => apt.status === filter)
        }

        if (searchQuery) {
            filtered = filtered.filter(apt =>
                apt.academicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                apt.subject.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        setFilteredAppointments(filtered)
    }

    // Statistics calculations
    const getStats = () => {
        const total = appointments.length
        const completed = appointments.filter(a => a.status === 'completed').length
        const cancelled = appointments.filter(a => a.status === 'cancelled').length
        const noShow = appointments.filter(a => a.status === 'rejected').length

        return { total, completed, cancelled, noShow }
    }

    // Top academicians
    const getTopAcademicians = () => {
        const academicianCounts = {}
        appointments.forEach(apt => {
            academicianCounts[apt.academicianName] = (academicianCounts[apt.academicianName] || 0) + 1
        })

        return Object.entries(academicianCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
    }

    // Monthly trend
    const getMonthlyTrend = () => {
        const monthCounts = {}
        appointments.forEach(apt => {
            const date = new Date(apt.date)
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
            monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
        })

        return Object.entries(monthCounts)
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => a.month.localeCompare(b.month))
            .slice(-6) // Last 6 months
            .map(item => ({
                month: new Date(item.month).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
                count: item.count
            }))
    }

    // Status distribution
    const getStatusDistribution = () => {
        const stats = getStats()
        return [
            { name: 'Tamamlandı', value: stats.completed, color: '#10B981' },
            { name: 'İptal', value: stats.cancelled, color: '#EF4444' },
            { name: 'Diğer', value: stats.noShow, color: '#F59E0B' }
        ].filter(item => item.value > 0)
    }

    const getStatusBadge = (status) => {
        const statusMap = {
            'completed': { label: 'Tamamlandı', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
            'cancelled': { label: 'İptal', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
            'rejected': { label: 'Red', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }
        }
        const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                {statusInfo.label}
            </span>
        )
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

    const stats = getStats()
    const topAcademicians = getTopAcademicians()
    const monthlyTrend = getMonthlyTrend()
    const statusDistribution = getStatusDistribution()

    return (
        <DashboardLayout userRole="student">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        📝 Randevu Geçmişi
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Geçmiş randevularınızı görüntüleyin ve istatistikleri inceleyin
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium opacity-90">Toplam Randevu</h3>
                            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold">{stats.total}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium opacity-90">Tamamlanan</h3>
                            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold">{stats.completed}</p>
                        <p className="text-sm opacity-80 mt-1">
                            {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}% oran
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium opacity-90">İptal Edilen</h3>
                            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold">{stats.cancelled}</p>
                        <p className="text-sm opacity-80 mt-1">
                            {stats.total > 0 ? ((stats.cancelled / stats.total) * 100).toFixed(1) : 0}% oran
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium opacity-90">Ortalama/Ay</h3>
                            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold">{monthlyTrend.length > 0 ? Math.round(stats.total / 6) : 0}</p>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Trend */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            📈 Aylık Randevu Trendi
                        </h2>
                        {monthlyTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                                    <XAxis dataKey="month" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1F2937',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#F3F4F6'
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Randevu Sayısı" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                                Henüz veri yok
                            </div>
                        )}
                    </div>

                    {/* Status Distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            📊 Durum Dağılımı
                        </h2>
                        {statusDistribution.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={statusDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {statusDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 space-y-2">
                                    {statusDistribution.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-[240px] text-gray-500 dark:text-gray-400">
                                Henüz veri yok
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Academicians */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        🏆 En Çok Randevu Aldığınız Akademisyenler
                    </h2>
                    {topAcademicians.length > 0 ? (
                        <div className="space-y-4">
                            {topAcademicians.map((academician, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white">{academician.name}</p>
                                        <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                                                style={{ width: `${(academician.count / topAcademicians[0].count) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{academician.count}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">randevu</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                            Henüz randevu geçmişiniz yok
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="🔍 Akademisyen veya konu ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        >
                            <option value="all">📊 Tüm Randevular</option>
                            <option value="completed">✅ Tamamlanan</option>
                            <option value="cancelled">❌ İptal Edilen</option>
                            <option value="rejected">⚠️ Red Edilen</option>
                        </select>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            📋 Randevu Listesi ({filteredAppointments.length})
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tarih</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Akademisyen</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Konu</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Durum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredAppointments.length > 0 ? (
                                    filteredAppointments.map(appointment => (
                                        <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {appointment.date} - {appointment.time}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {appointment.academicianName}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {appointment.subject}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(appointment.status)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            Randevu bulunamadı
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
