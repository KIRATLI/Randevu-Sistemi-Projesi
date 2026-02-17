import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([])
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingAnnouncement, setEditingAnnouncement] = useState(null)
    const [targetFilter, setTargetFilter] = useState('all')
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'info',
        targetAudience: 'all',
        priority: 'medium',
        expiresAt: ''
    })

    useEffect(() => {
        loadAnnouncements()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [announcements, targetFilter])

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

        if (targetFilter !== 'all') {
            filtered = filtered.filter(ann => ann.targetAudience === targetFilter || ann.targetAudience === 'all')
        }

        setFilteredAnnouncements(filtered)
    }

    const handleAddAnnouncement = () => {
        setEditingAnnouncement(null)
        setFormData({
            title: '',
            content: '',
            type: 'info',
            targetAudience: 'all',
            priority: 'medium',
            expiresAt: ''
        })
        setShowForm(true)
    }

    const handleEditAnnouncement = (announcement) => {
        setEditingAnnouncement(announcement)
        setFormData({
            title: announcement.title,
            content: announcement.content,
            type: announcement.type,
            targetAudience: announcement.targetAudience,
            priority: announcement.priority,
            expiresAt: announcement.expiresAt ? announcement.expiresAt.split('T')[0] : ''
        })
        setShowForm(true)
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

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingAnnouncement) {
                const response = await api.updateAnnouncement(editingAnnouncement.id, formData)
                if (response.success) {
                    await loadAnnouncements()
                    alert('✓ Duyuru güncellendi')
                }
            } else {
                const response = await api.createAnnouncement(formData)
                if (response.success) {
                    await loadAnnouncements()
                    alert('✓ Duyuru oluşturuldu')
                }
            }
            setShowForm(false)
            setEditingAnnouncement(null)
        } catch (error) {
            console.error('Kaydetme hatası:', error)
            alert('✗ İşlem başarısız')
        }
    }

    const getTypeBadge = (type) => {
        const typeMap = {
            'info': { label: 'Bilgi', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: 'ℹ️' },
            'warning': { label: 'Uyarı', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: '⚠️' },
            'success': { label: 'Başarı', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: '✅' },
            'danger': { label: 'Tehlike', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: '❌' }
        }
        const typeInfo = typeMap[type] || typeMap['info']
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeInfo.color} flex items-center gap-1 w-fit`}>
                <span>{typeInfo.icon}</span>
                {typeInfo.label}
            </span>
        )
    }

    const getPriorityBadge = (priority) => {
        const colors = {
            'high': 'text-red-600 dark:text-red-400',
            'medium': 'text-yellow-600 dark:text-yellow-400',
            'low': 'text-green-600 dark:text-green-400'
        }
        const labels = {
            'high': 'Yüksek',
            'medium': 'Orta',
            'low': 'Düşük'
        }
        return (
            <span className={`text-sm font-medium ${colors[priority]}`}>
                {labels[priority]}
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
                            📢 Duyuru Yönetimi
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Toplam {filteredAnnouncements.length} duyuru
                        </p>
                    </div>
                    <button
                        onClick={handleAddAnnouncement}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Duyuru
                    </button>
                </div>

                {/* Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
                    <select
                        value={targetFilter}
                        onChange={(e) => setTargetFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                        <option value="all">🎯 Tüm Hedef Kitleler</option>
                        <option value="student">👨‍🎓 Öğrenciler</option>
                        <option value="academician">👨‍🏫 Akademisyenler</option>
                    </select>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Toplam</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{announcements.length}</p>
                            </div>
                            <div className="text-3xl">📢</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Aktif</p>
                                <p className="text-2xl font-bold text-green-600">{announcements.filter(a => a.status === 'active').length}</p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Yüksek Öncelik</p>
                                <p className="text-2xl font-bold text-red-600">{announcements.filter(a => a.priority === 'high').length}</p>
                            </div>
                            <div className="text-3xl">⚡</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Görüntüleme</p>
                                <p className="text-2xl font-bold text-blue-600">{announcements.reduce((sum, a) => sum + (a.views || 0), 0)}</p>
                            </div>
                            <div className="text-3xl">👁️</div>
                        </div>
                    </div>
                </div>

                {/* Announcements List */}
                <div className="space-y-4">
                    {filteredAnnouncements.map((announcement) => (
                        <div key={announcement.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {getTypeBadge(announcement.type)}
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(announcement.createdAt).toLocaleDateString('tr-TR')}
                                        </span>
                                        {announcement.status === 'active' && (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                Aktif
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        {announcement.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                                        {announcement.content}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            🎯 Hedef: <span className="font-medium">
                                                {announcement.targetAudience === 'all' ? 'Herkes' :
                                                    announcement.targetAudience === 'student' ? 'Öğrenciler' : 'Akademisyenler'}
                                            </span>
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Öncelik: {getPriorityBadge(announcement.priority)}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            👁️ {announcement.views} görüntüleme
                                        </span>
                                        {announcement.expiresAt && (
                                            <span className="text-gray-500 dark:text-gray-400">
                                                ⏰ Son: {new Date(announcement.expiresAt).toLocaleDateString('tr-TR')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleEditAnnouncement(announcement)}
                                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAnnouncement(announcement)}
                                        className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form Modal */}
                {showForm && (
                    <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowForm(false)} />
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                        {editingAnnouncement ? 'Duyuru Düzenle' : 'Yeni Duyuru Oluştur'}
                                    </h2>
                                    <form onSubmit={handleFormSubmit}>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Başlık *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                    placeholder="Duyuru başlığı..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    İçerik *
                                                </label>
                                                <textarea
                                                    required
                                                    value={formData.content}
                                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                    rows="5"
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                    placeholder="Duyuru içeriği..."
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Tip *
                                                    </label>
                                                    <select
                                                        required
                                                        value={formData.type}
                                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                    >
                                                        <option value="info">ℹ️ Bilgi</option>
                                                        <option value="warning">⚠️ Uyarı</option>
                                                        <option value="success">✅ Başarı</option>
                                                        <option value="danger">❌ Tehlike</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Öncelik *
                                                    </label>
                                                    <select
                                                        required
                                                        value={formData.priority}
                                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                    >
                                                        <option value="low">Düşük</option>
                                                        <option value="medium">Orta</option>
                                                        <option value="high">Yüksek</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Hedef Kitle *
                                                    </label>
                                                    <select
                                                        required
                                                        value={formData.targetAudience}
                                                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                    >
                                                        <option value="all">🎯 Herkes</option>
                                                        <option value="student">👨‍🎓 Öğrenciler</option>
                                                        <option value="academician">👨‍🏫 Akademisyenler</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Son Geçerlilik Tarihi
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={formData.expiresAt}
                                                        onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                    />
                                                </div>
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
                                                {editingAnnouncement ? 'Güncelle' : 'Oluştur'}
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
