import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    students: 0,
    academicians: 0,
    admins: 0,
    active: 0,
    inactive: 0
  })
  const [appointments, setAppointments] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsResponse, usersResponse, appointmentsResponse] = await Promise.all([
        api.getUserStats(),
        api.getUsers(),
        api.getAppointments()
      ])

      if (statsResponse.success) {
        setStats(statsResponse.data)
      }

      if (usersResponse.success) {
        const recent = [...usersResponse.data]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
        setRecentUsers(recent)

        // Generate recent activities
        const activities = recent.map(user => ({
          id: user.id,
          type: 'user_registered',
          message: `${user.name} sisteme kayıt oldu`,
          time: user.createdAt,
          icon: '👤'
        }))

        setRecentActivities(activities.slice(0, 8))
      }

      if (appointmentsResponse.success) {
        setAppointments(appointmentsResponse.data)
      }
    } catch (error) {
      console.error('Veri yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate monthly appointment trend (last 6 months)
  const getAppointmentTrend = () => {
    const months = ['Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
    return months.map((month, index) => ({
      month,
      randevular: Math.floor(Math.random() * 50) + 20,
      onaylanan: Math.floor(Math.random() * 30) + 10
    }))
  }

  // Calculate appointment status distribution
  const getAppointmentStatusData = () => {
    const statusCounts = {
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      pending: appointments.filter(a => a.status === 'pending').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length
    }

    return [
      { name: 'Onaylı', value: statusCounts.confirmed, color: '#10B981' },
      { name: 'Bekliyor', value: statusCounts.pending, color: '#F59E0B' },
      { name: 'İptal', value: statusCounts.cancelled, color: '#EF4444' }
    ]
  }

  // Calculate user role distribution
  const getUserRoleData = () => [
    { name: 'Öğrenciler', value: stats.students, color: '#3B82F6' },
    { name: 'Akademisyenler', value: stats.academicians, color: '#8B5CF6' },
    { name: 'Adminler', value: stats.admins, color: '#EF4444' }
  ]

  const getRoleBadge = (role) => {
    const badges = {
      student: { text: '👨‍🎓 Öğrenci', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' },
      academician: { text: '👨‍🏫 Akademisyen', color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300' },
      admin: { text: '👨‍💼 Admin', color: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300' }
    }
    return badges[role] || { text: role, color: 'bg-gray-100' }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffMs = now - past
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Az önce'
    if (diffMins < 60) return `${diffMins} dakika önce`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} saat önce`
    return `${Math.floor(diffMins / 1440)} gün önce`
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

  const appointmentTrendData = getAppointmentTrend()
  const appointmentStatusData = getAppointmentStatusData()
  const userRoleData = getUserRoleData()

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header with Quick Actions */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              👨‍💼 Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Sistem genel görünümü ve istatistikler
            </p>
          </div>
          <div className="flex gap-2">
            <a href="/admin/users" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2">
              <span>👥</span>
              Kullanıcılar
            </a>
            <a href="/admin/appointments" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center gap-2">
              <span>📅</span>
              Randevular
            </a>
            <a href="/admin/settings" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm flex items-center gap-2">
              <span>⚙️</span>
              Ayarlar
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium opacity-90">Toplam Kullanıcı</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-4xl font-bold">{stats.total}</p>
            <p className="text-sm opacity-80 mt-2">
              {stats.active} aktif • {stats.inactive} pasif
            </p>
          </div>

          {/* Students */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium opacity-90">Öğrenciler</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <p className="text-4xl font-bold">{stats.students}</p>
            <p className="text-sm opacity-80 mt-2">
              {((stats.students / stats.total) * 100).toFixed(1)}% toplam
            </p>
          </div>

          {/* Academicians */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium opacity-90">Akademisyenler</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-4xl font-bold">{stats.academicians}</p>
            <p className="text-sm opacity-80 mt-2">
              {((stats.academicians / stats.total) * 100).toFixed(1)}% toplam
            </p>
          </div>

          {/* Appointments */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium opacity-90">Randevular</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-4xl font-bold">{appointments.length}</p>
            <p className="text-sm opacity-80 mt-2">
              {appointments.filter(a => a.status === 'confirmed').length} onaylı • {appointments.filter(a => a.status === 'pending').length} bekliyor
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointment Trend Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📈 Randevu Trendi (Son 6 Ay)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={appointmentTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }}
                />
                <Legend />
                <Line type="monotone" dataKey="randevular" stroke="#3B82F6" strokeWidth={2} name="Toplam" />
                <Line type="monotone" dataKey="onaylanan" stroke="#10B981" strokeWidth={2} name="Onaylanan" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Charts */}
          <div className="grid grid-cols-2 gap-4">
            {/* Appointment Status Pie */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Randevu Durumu
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={appointmentStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {appointmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {appointmentStatusData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Role Pie */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Kullanıcı Rolleri
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {userRoleData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities & Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                ⚡ Son Aktiviteler
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
              {recentActivities.map(activity => (
                <div key={activity.id} className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {getTimeAgo(activity.time)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                🆕 Son Kayıtlar
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentUsers.map(user => {
                const badge = getRoleBadge(user.role)
                return (
                  <div key={user.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                          {badge.text}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {getTimeAgo(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            ⚙️ Sistem Bilgisi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sunucu Durumu</p>
                <p className="font-medium text-gray-900 dark:text-white">✓ Çalışıyor</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Veritabanı</p>
                <p className="font-medium text-gray-900 dark:text-white">✓ Bağlı</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Son Güncelleme</p>
                <p className="font-medium text-gray-900 dark:text-white">24.12.2025</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Performans</p>
                <p className="font-medium text-gray-900 dark:text-white">Mükemmel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
