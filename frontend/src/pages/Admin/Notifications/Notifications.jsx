import { useState } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'

export default function Notifications() {
    const [formData, setFormData] = useState({
        targetAudience: 'all',
        title: '',
        message: '',
        type: 'info',
        sendEmail: true,
        sendPush: true
    })
    const [sending, setSending] = useState(false)
    const [history, setHistory] = useState([
        {
            id: 1,
            title: 'Sistem Bakımı Bildirimi',
            message: 'Sistem 25 Aralık günü bakımda olacaktır.',
            targetAudience: 'all',
            sentCount: 250,
            sentAt: '2025-12-20T10:30:00',
            type: 'warning'
        },
        {
            id: 2,
            title: 'Final Sınavı Hatırlatması',
            message: 'Final sınavları 10 Ocak tarihinde başlayacaktır.',
            targetAudience: 'student',
            sentCount: 205,
            sentAt: '2025-12-18T14:15:00',
            type: 'info'
        }
    ])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!window.confirm(`${getTargetLabel(formData.targetAudience)} kullanıcılarına bildirim göndermek istediğinize emin misiniz?`)) {
            return
        }

        setSending(true)
        try {
            const response = await api.sendBulkMessage(formData)
            if (response.success) {
                alert(`✓ Bildirim başarıyla gönderildi! (${response.sentCount} kullanıcı)`)

                // Add to history
                setHistory([
                    {
                        id: Date.now(),
                        ...formData,
                        sentCount: response.sentCount,
                        sentAt: new Date().toISOString()
                    },
                    ...history
                ])

                // Reset form
                setFormData({
                    targetAudience: 'all',
                    title: '',
                    message: '',
                    type: 'info',
                    sendEmail: true,
                    sendPush: true
                })
            }
        } catch (error) {
            console.error('Bildirim gönderme hatası:', error)
            alert('✗ Bildirim gönderilemedi')
        } finally {
            setSending(false)
        }
    }

    const getTargetLabel = (target) => {
        const labels = {
            'all': 'Tüm',
            'student': 'Öğrenci',
            'academician': 'Akademisyen'
        }
        return labels[target]
    }

    const getTypeIcon = (type) => {
        const icons = {
            'info': 'ℹ️',
            'warning': '⚠️',
            'success': '✅',
            'error': '❌'
        }
        return icons[type] || 'ℹ️'
    }

    const getTypeBadge = (type) => {
        const colors = {
            'info': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'warning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            'success': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'error': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }
        return colors[type] || colors['info']
    }

    return (
        <DashboardLayout userRole="admin">
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        🔔 Toplu Bildirim Gönder
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Kullanıcı gruplarına toplu bildirim ve email gönderin
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                Yeni Bildirim Oluştur
                            </h2>

                            <div className="space-y-4">
                                {/* Target Audience */}
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
                                        <option value="all">🎯 Tüm Kullanıcılar</option>
                                        <option value="student">👨‍🎓 Öğrenciler</option>
                                        <option value="academician">👨‍🏫 Akademisyenler</option>
                                    </select>
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Bildirim Tipi *
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
                                        <option value="error">❌ Hata</option>
                                    </select>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Başlık *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength="100"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                        placeholder="Bildirim başlığı..."
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {formData.title.length}/100 karakter
                                    </p>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Mesaj *
                                    </label>
                                    <textarea
                                        required
                                        maxLength="500"
                                        rows="5"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                        placeholder="Bildirim mesajı..."
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {formData.message.length}/500 karakter
                                    </p>
                                </div>

                                {/* Send Options */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Gönderim Kanalları
                                    </label>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="sendPush"
                                                checked={formData.sendPush}
                                                onChange={(e) => setFormData({ ...formData, sendPush: e.target.checked })}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor="sendPush" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                📱 Push Bildirimi (Tarayıcı ve uygulama)
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="sendEmail"
                                                checked={formData.sendEmail}
                                                onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor="sendEmail" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                📧 E-posta Bildirimi
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={sending || (!formData.sendPush && !formData.sendEmail)}
                                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {sending ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Gönderiliyor...
                                            </>
                                        ) : (
                                            <>
                                                <span>📤</span>
                                                Bildirimi Gönder
                                            </>
                                        )}
                                    </button>
                                    {!formData.sendPush && !formData.sendEmail && (
                                        <p className="text-xs text-red-600 dark:text-red-400 mt-2 text-center">
                                            En az bir gönderim kanalı seçmelisiniz
                                        </p>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Preview & Stats */}
                    <div className="space-y-6">
                        {/* Preview */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                📱 Önizleme
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border-l-4 border-blue-600">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{getTypeIcon(formData.type)}</span>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {formData.title || 'Başlık buraya gelecek...'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {formData.message || 'Mesaj içeriği buraya gelecek...'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                            Az önce
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Target Stats */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                📊 Hedef İstatistikleri
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Tüm Kullanıcılar</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">~250</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Öğrenciler</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">~205</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Akademisyenler</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">~45</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History */}
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        📜 Gönderim Geçmişi
                    </h2>
                    <div className="space-y-3">
                        {history.map((item) => (
                            <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadge(item.type)}`}>
                                                {getTypeIcon(item.type)} {item.type}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {getTargetLabel(item.targetAudience)}
                                            </span>
                                        </div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.message}</p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                            {item.sentCount} kişi
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {new Date(item.sentAt).toLocaleDateString('tr-TR')}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(item.sentAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
