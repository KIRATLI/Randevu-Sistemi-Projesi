import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'

export default function Reports() {
  const [reportData, setReportData] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [reportsResponse, logsResponse] = await Promise.all([
        api.getReports(),
        api.getSystemLogs()
      ])

      if (reportsResponse.success) {
        setReportData(reportsResponse.data)
      }

      if (logsResponse.success) {
        setLogs(logsResponse.data)
      }
    } catch (error) {
      console.error('Raporlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            📊 Raporlar ve Analiz
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sistem performansı ve kullanım raporları
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium transition border-b-2 ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📈 Genel Bakış
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-3 font-medium transition border-b-2 ${
                activeTab === 'appointments'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📅 Randevu İstatistikleri
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-3 font-medium transition border-b-2 ${
                activeTab === 'logs'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📝 Sistem Logları
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && reportData && (
          <div className="space-y-6">
            {/* Appointment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                <h3 className="text-sm font-medium opacity-90 mb-2">Toplam Randevu</h3>
                <p className="text-3xl font-bold">{reportData.totalAppointments}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                <h3 className="text-sm font-medium opacity-90 mb-2">Tamamlanan</h3>
                <p className="text-3xl font-bold">{reportData.completedAppointments}</p>
                <p className="text-xs opacity-80 mt-1">
                  {((reportData.completedAppointments / reportData.totalAppointments) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white shadow-lg">
                <h3 className="text-sm font-medium opacity-90 mb-2">İptal Edilen</h3>
                <p className="text-3xl font-bold">{reportData.cancelledAppointments}</p>
                <p className="text-xs opacity-80 mt-1">
                  {((reportData.cancelledAppointments / reportData.totalAppointments) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
                <h3 className="text-sm font-medium opacity-90 mb-2">Beklemede</h3>
                <p className="text-3xl font-bold">{reportData.pendingAppointments}</p>
                <p className="text-xs opacity-80 mt-1">
                  {((reportData.pendingAppointments / reportData.totalAppointments) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Top Academicians */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  🏆 En Aktif Akademisyenler
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {reportData.topAcademicians.map((academician, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {academician.name}
                        </p>
                        <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${(academician.appointments / reportData.topAcademicians[0].appointments) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {academician.appointments}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          randevu
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Department Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  🏢 Bölüm Bazında İstatistikler
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportData.departmentStats.map((dept, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {dept.name}
                        </p>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {dept.count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${(dept.count / reportData.departmentStats[0].count) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && reportData && (
          <div className="space-y-6">
            {/* Monthly Trend */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  📈 Aylık Randevu Trendi
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-end gap-2 h-64">
                  {reportData.monthlyTrend.map((month, index) => {
                    const maxValue = Math.max(...reportData.monthlyTrend.map(m => m.value))
                    const height = (month.value / maxValue) * 100
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-xs font-medium text-gray-900 dark:text-white">
                          {month.value}
                        </div>
                        <div
                          className="w-full bg-blue-600 rounded-t-lg transition-all hover:bg-blue-700 cursor-pointer"
                          style={{ height: `${height}%` }}
                          title={`${month.month}: ${month.value} randevu`}
                        />
                        <div className="text-xs text-gray-600 dark:text-gray-400 rotate-45 origin-left mt-2">
                          {month.month}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Statistics Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                📊 İstatistik Özeti
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {((reportData.completedAppointments / reportData.totalAppointments) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Tamamlanma Oranı
                  </p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {((reportData.cancelledAppointments / reportData.totalAppointments) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    İptal Oranı
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {(reportData.monthlyTrend.reduce((sum, m) => sum + m.value, 0) / 12).toFixed(0)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Aylık Ortalama
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.max(...reportData.monthlyTrend.map(m => m.value))}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    En Yüksek (Aylık)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                📝 Son Sistem Aktiviteleri
              </h2>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Tümünü Dışa Aktar
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tarih/Saat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      İşlem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Detaylar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {log.user}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

