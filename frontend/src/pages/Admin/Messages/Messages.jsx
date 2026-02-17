import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'
import AnnouncementCard from '../../../components/AnnouncementCard/AnnouncementCard'
import ComposeAnnouncement from '../../../components/ComposeAnnouncement/ComposeAnnouncement'

export default function AdminMessages() {
  const [announcements, setAnnouncements] = useState([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [showBulkMessageModal, setShowBulkMessageModal] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [activeTab, setActiveTab] = useState('all') // 'all', 'active', 'archived'
  const [bulkMessageData, setBulkMessageData] = useState({
    targetAudience: 'all',
    subject: '',
    message: ''
  })

  useEffect(() => {
    loadAnnouncements()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [announcements, activeTab])

  const loadAnnouncements = async () => {
    setLoading(true)
    try {
      const response = await api.getAnnouncements()
      if (response.success) {
        setAnnouncements(response.data)
      }
    } catch (error) {
      console.error('Duyurular yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...announcements]

    if (activeTab === 'active') {
      filtered = filtered.filter(a => a.status === 'active')
    } else if (activeTab === 'archived') {
      filtered = filtered.filter(a => a.status === 'archived')
    }

    setFilteredAnnouncements(filtered)
  }

  const handleCreateAnnouncement = () => {
    setEditingAnnouncement(null)
    setShowComposeModal(true)
  }

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement)
    setShowComposeModal(true)
  }

  const handleDeleteAnnouncement = async (announcement) => {
    if (window.confirm(`"${announcement.title}" duyurusunu silmek istediğinize emin misiniz?`)) {
      try {
        const response = await api.deleteAnnouncement(announcement.id)
        if (response.success) {
          setAnnouncements(announcements.filter(a => a.id !== announcement.id))
          alert('✓ Duyuru silindi')
        }
      } catch (error) {
        console.error('Silme hatası:', error)
        alert('✗ Duyuru silinemedi')
      }
    }
  }

  const handleSubmitAnnouncement = async (formData) => {
    try {
      if (editingAnnouncement) {
        const response = await api.updateAnnouncement(editingAnnouncement.id, formData)
        if (response.success) {
          setAnnouncements(announcements.map(a => 
            a.id === editingAnnouncement.id ? { ...a, ...formData } : a
          ))
          alert('✓ Duyuru güncellendi')
        }
      } else {
        const response = await api.createAnnouncement(formData)
        if (response.success) {
          setAnnouncements([response.data, ...announcements])
          alert('✓ Duyuru oluşturuldu')
        }
      }
      setShowComposeModal(false)
      setEditingAnnouncement(null)
    } catch (error) {
      console.error('Kaydetme hatası:', error)
      alert('✗ İşlem başarısız')
    }
  }

  const handleSendBulkMessage = async (e) => {
    e.preventDefault()
    if (!bulkMessageData.subject.trim() || !bulkMessageData.message.trim()) {
      alert('Konu ve mesaj alanları zorunludur')
      return
    }

    try {
      const response = await api.sendBulkMessage(bulkMessageData)
      if (response.success) {
        alert(`✓ ${response.message}\n${response.sentCount} kullanıcıya gönderildi.`)
        setShowBulkMessageModal(false)
        setBulkMessageData({ targetAudience: 'all', subject: '', message: '' })
      }
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error)
      alert('✗ Mesaj gönderilemedi')
    }
  }

  // Stats
  const stats = {
    total: announcements.length,
    active: announcements.filter(a => a.status === 'active').length,
    archived: announcements.filter(a => a.status === 'archived').length,
    totalViews: announcements.reduce((sum, a) => sum + a.views, 0)
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              📧 Sistem Mesajları & Duyurular
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Kullanıcılara duyuru ve toplu mesaj yönetimi
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowBulkMessageModal(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Toplu Mesaj Gönder
            </button>
            <button
              onClick={handleCreateAnnouncement}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Duyuru
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Toplam Duyuru</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Aktif</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold">{stats.active}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Arşivlendi</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <p className="text-3xl font-bold">{stats.archived}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Toplam Görüntüleme</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <p className="text-3xl font-bold">{stats.totalViews}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-3 border-b-2 font-medium transition ${
                activeTab === 'all'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📋 Tümü ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-3 border-b-2 font-medium transition ${
                activeTab === 'active'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              ✅ Aktif ({stats.active})
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`py-3 border-b-2 font-medium transition ${
                activeTab === 'archived'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📦 Arşiv ({stats.archived})
            </button>
          </div>
        </div>

        {/* Announcements List */}
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <svg className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Duyuru bulunamadı
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onEdit={handleEditAnnouncement}
                onDelete={handleDeleteAnnouncement}
              />
            ))}
          </div>
        )}

        {/* Compose Announcement Modal */}
        {showComposeModal && (
          <ComposeAnnouncement
            announcement={editingAnnouncement}
            onSubmit={handleSubmitAnnouncement}
            onCancel={() => {
              setShowComposeModal(false)
              setEditingAnnouncement(null)
            }}
          />
        )}

        {/* Bulk Message Modal */}
        {showBulkMessageModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <h3 className="text-xl font-semibold text-white">
                  📨 Toplu Mesaj Gönder
                </h3>
              </div>

              <form onSubmit={handleSendBulkMessage} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hedef Kitle *
                  </label>
                  <select
                    value={bulkMessageData.targetAudience}
                    onChange={(e) => setBulkMessageData({ ...bulkMessageData, targetAudience: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="all">👥 Tüm Kullanıcılar</option>
                    <option value="student">👨‍🎓 Tüm Öğrenciler</option>
                    <option value="academician">👨‍🏫 Tüm Akademisyenler</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Konu *
                  </label>
                  <input
                    type="text"
                    value={bulkMessageData.subject}
                    onChange={(e) => setBulkMessageData({ ...bulkMessageData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Mesaj konusu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mesaj *
                  </label>
                  <textarea
                    value={bulkMessageData.message}
                    onChange={(e) => setBulkMessageData({ ...bulkMessageData, message: e.target.value })}
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                    placeholder="Mesaj içeriği..."
                  />
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    ⚠️ Bu mesaj seçilen tüm kullanıcılara gönderilecektir. Dikkatli olun!
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBulkMessageModal(false)
                      setBulkMessageData({ targetAudience: 'all', subject: '', message: '' })
                    }}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Gönder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

