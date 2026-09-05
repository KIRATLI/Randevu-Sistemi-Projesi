import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'

const QUICK_TEMPLATES = [
  { id: 1, title: 'Toplantı', message: 'O saatte başka bir toplantım var, lütfen farklı bir saat seçin.' },
  { id: 2, title: 'İzinli', message: 'Belirtilen tarihte izinli olacağım, farklı bir tarih seçebilir misiniz?' },
  { id: 3, title: 'Dolu', message: 'O gün randevu kotam dolmuştur, başka bir gün randevu alabilirsiniz.' }
]

export default function AcademicianAppointments() {
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedAppointments, setSelectedAppointments] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [bulkReason, setBulkReason] = useState('')

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const response = await api.getAppointments()
      if (response.success) {
        setAppointments(response.data)
      }
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (appointment) => {
    if (!confirm(`${appointment.studentName} öğrencisinin randevusunu onaylamak istediğinize emin misiniz?`)) {
      return
    }

    try {
      const response = await api.approveAppointment(appointment.id)
      if (response.success) {
        alert('✓ Randevu onaylandı')
        loadAppointments()
      }
    } catch (error) {
      alert('✗ Bir hata oluştu')
    }
  }

  const handleReject = (appointment) => {
    setSelectedAppointment(appointment)
    setShowRejectModal(true)
  }

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      alert('Lütfen red nedeni belirtin')
      return
    }

    try {
      const response = await api.rejectAppointment(selectedAppointment.id, rejectReason)
      if (response.success) {
        alert('✓ Randevu reddedildi')
        setShowRejectModal(false)
        setRejectReason('')
        setSelectedAppointment(null)
        loadAppointments()
      }
    } catch (error) {
      alert('✗ Bir hata oluştu')
    }
  }

  const handleSelectAppointment = (appointmentId) => {
    setSelectedAppointments(prev =>
      prev.includes(appointmentId)
        ? prev.filter(id => id !== appointmentId)
        : [...prev, appointmentId]
    )
  }

  const handleSelectAll = () => {
    if (selectedAppointments.length === filteredAppointments.length) {
      setSelectedAppointments([])
    } else {
      setSelectedAppointments(filteredAppointments.map(apt => apt.id))
    }
  }

  const handleBulkApprove = async () => {
    if (!confirm(`${selectedAppointments.length} randevuyu toplu onaylamak istediğinize emin misiniz?`)) {
      return
    }

    try {
      for (const id of selectedAppointments) {
        await api.approveAppointment(id)
      }
      alert(`✓ ${selectedAppointments.length} randevu onaylandı`)
      setSelectedAppointments([])
      loadAppointments()
    } catch (error) {
      alert('✗ Bir hata oluştu')
    }
  }

  const handleBulkReject = () => {
    setShowBulkActions(true)
  }

  const confirmBulkReject = async () => {
    if (!bulkReason.trim()) {
      alert('Lütfen red nedeni belirtin')
      return
    }

    try {
      for (const id of selectedAppointments) {
        await api.rejectAppointment(id, bulkReason)
      }
      alert(`✓ ${selectedAppointments.length} randevu reddedildi`)
      setShowBulkActions(false)
      setBulkReason('')
      setSelectedAppointments([])
      loadAppointments()
    } catch (error) {
      alert('✗ Bir hata oluştu')
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0]
      return apt.date === today && apt.status === 'confirmed'
    }
    if (filter === 'upcoming') {
      return apt.status === 'confirmed' && new Date(`${apt.date} ${apt.time}`) > new Date()
    }
    return apt.status === filter
  })

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    today: appointments.filter(a => {
      const today = new Date().toISOString().split('T')[0]
      return a.date === today && a.status === 'confirmed'
    }).length,
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          📅 Randevu Yönetimi
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">Toplam</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">Bugün</p>
            <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">Bekleyen</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400">Onaylı</p>
            <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedAppointments.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-blue-900 dark:text-blue-300">
                {selectedAppointments.length} randevu seçildi
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedAppointments([])}
                  className="px-4 py-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  İptal
                </button>
                <button
                  onClick={handleBulkApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  ✓ Toplu Onayla
                </button>
                <button
                  onClick={handleBulkReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  ✗ Toplu Reddet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            Tümü ({stats.total})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            Bekleyen ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg font-medium ${filter === 'confirmed' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            Onaylı ({stats.confirmed})
          </button>
        </div>

        {/* Select All */}
        {filteredAppointments.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedAppointments.length === filteredAppointments.length}
                onChange={handleSelectAll}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="font-medium">Tümünü Seç ({filteredAppointments.length})</span>
            </label>
          </div>
        )}

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex gap-4">
              <input
                type="checkbox"
                checked={selectedAppointments.includes(appointment.id)}
                onChange={() => handleSelectAppointment(appointment.id)}
                className="w-5 h-5 text-blue-600 rounded mt-1"
              />
              <div className="flex-1">
                <div className="flex justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{appointment.studentName}</h3>
                    <p className="text-sm text-gray-500">{appointment.studentNo}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {appointment.status === 'confirmed' ? 'Onaylı' : appointment.status === 'pending' ? 'Bekliyor' : 'Red'}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  📅 {appointment.date} - {appointment.time} • {appointment.subject}
                </p>
                {appointment.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(appointment)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      ✓ Onayla
                    </button>
                    <button
                      onClick={() => handleReject(appointment)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      ✗ Reddet
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowRejectModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">Randevu Reddet</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Hızlı Şablonlar</label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TEMPLATES.map(template => (
                    <button
                      key={template.id}
                      onClick={() => setRejectReason(template.message)}
                      className="px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100"
                    >
                      {template.title}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 mb-4"
                placeholder="Red nedeni..."
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                  İptal
                </button>
                <button
                  onClick={confirmReject}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Reddet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions Modal */}
        {showBulkActions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowBulkActions(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">Toplu Reddetme - {selectedAppointments.length} Randevu</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Hızlı Şablonlar</label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TEMPLATES.map(template => (
                    <button
                      key={template.id}
                      onClick={() => setBulkReason(template.message)}
                      className="px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100"
                    >
                      {template.title}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={bulkReason}
                onChange={(e) => setBulkReason(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 mb-4"
                placeholder="Red nedeni..."
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkActions(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                  İptal
                </button>
                <button
                  onClick={confirmBulkReject}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Toplu Reddet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
