import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'

export default function NotificationSettings() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState({
        // Email Notifications
        emailEnabled: true,
        emailAppointmentConfirmed: true,
        emailAppointmentRejected: true,
        emailAppointmentCancelled: true,
        emailAppointmentReminder: true,
        emailAnnouncements: true,

        // SMS Notifications
        smsEnabled: false,
        smsAppointmentConfirmed: false,
        smsAppointmentRejected: false,
        smsAppointmentCancelled: false,
        smsAppointmentReminder: true,

        // Push Notifications
        pushEnabled: true,
        pushAppointmentConfirmed: true,
        pushAppointmentRejected: true,
        pushAppointmentCancelled: true,
        pushAppointmentReminder: true,
        pushMessages: true,
        pushAnnouncements: true,

        // Notification Frequency
        frequency: 'instant', // instant, daily, weekly

        // Quiet Hours
        quietHoursEnabled: false,
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00',

        // Notification Categories
        categoryAppointments: true,
        categoryMessages: true,
        categoryAnnouncements: true,
        categorySystem: false
    })

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        setLoading(true)
        try {
            // Mock data - gerçek API'den gelecek
            // const response = await api.getNotificationSettings()
            // if (response.success) {
            //   setSettings(response.data)
            // }
            setTimeout(() => setLoading(false), 500)
        } catch (error) {
            console.error('Ayarlar yüklenemedi:', error)
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            // const response = await api.updateNotificationSettings(settings)
            // if (response.success) {
            //   alert('✓ Bildirim tercihleri kaydedildi')
            // }
            setTimeout(() => {
                alert('✓ Bildirim tercihleri kaydedildi')
                setSaving(false)
            }, 1000)
        } catch (error) {
            console.error('Kaydetme hatası:', error)
            alert('✗ Ayarlar kaydedilemedi')
            setSaving(false)
        }
    }

    const handleToggle = (key) => {
        setSettings({ ...settings, [key]: !settings[key] })
    }

    const handleMasterToggle = (type, value) => {
        const updates = {}
        Object.keys(settings).forEach(key => {
            if (key.startsWith(type)) {
                updates[key] = value
            }
        })
        setSettings({ ...settings, ...updates })
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

    return (
        <DashboardLayout userRole="student">
            <div className="space-y-6 max-w-4xl">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        📱 Bildirim Tercihleri
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Bildirim tercihlerinizi yönetin ve özelleştirin
                    </p>
                </div>

                {/* Email Notifications */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                📧 Email Bildirimleri
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Email yoluyla bildirim alın
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.emailEnabled}
                                onChange={() => handleMasterToggle('email', !settings.emailEnabled)}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Randevu Onayı</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Randevunuz onaylandığında</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.emailAppointmentConfirmed && settings.emailEnabled}
                                    onChange={() => handleToggle('emailAppointmentConfirmed')}
                                    disabled={!settings.emailEnabled}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                            </label>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Randevu Reddi</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Randevunuz reddedildiğinde</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.emailAppointmentRejected && settings.emailEnabled}
                                    onChange={() => handleToggle('emailAppointmentRejected')}
                                    disabled={!settings.emailEnabled}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                            </label>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Randevu İptali</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Randevunuz iptal edildiğinde</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.emailAppointmentCancelled && settings.emailEnabled}
                                    onChange={() => handleToggle('emailAppointmentCancelled')}
                                    disabled={!settings.emailEnabled}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                            </label>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Randevu Hatırlatma</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Randevunuzdan 1 gün önce</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.emailAppointmentReminder && settings.emailEnabled}
                                    onChange={() => handleToggle('emailAppointmentReminder')}
                                    disabled={!settings.emailEnabled}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                            </label>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Duyurular</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Yeni duyurular yayınlandığında</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.emailAnnouncements && settings.emailEnabled}
                                    onChange={() => handleToggle('emailAnnouncements')}
                                    disabled={!settings.emailEnabled}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Push Notifications */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                🔔 Push Bildirimleri
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Tarayıcı ve uygulama bildirimleri
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.pushEnabled}
                                onChange={() => handleMasterToggle('push', !settings.pushEnabled)}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Randevu Onayı</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Randevunuz onaylandığında</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.pushAppointmentConfirmed && settings.pushEnabled}
                                    onChange={() => handleToggle('pushAppointmentConfirmed')}
                                    disabled={!settings.pushEnabled}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                            </label>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Yeni Mesajlar</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Yeni mesaj aldığınızda</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.pushMessages && settings.pushEnabled}
                                    onChange={() => handleToggle('pushMessages')}
                                    disabled={!settings.pushEnabled}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                            </label>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Duyurular</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Yeni duyurular yayınlandığında</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.pushAnnouncements && settings.pushEnabled}
                                    onChange={() => handleToggle('pushAnnouncements')}
                                    disabled={!settings.pushEnabled}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Notification Frequency */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        ⏰ Bildirim Sıklığı
                    </h2>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="frequency"
                                value="instant"
                                checked={settings.frequency === 'instant'}
                                onChange={(e) => setSettings({ ...settings, frequency: e.target.value })}
                                className="w-4 h-4 text-blue-600"
                            />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Anında</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Her bildirim anında gelsin</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="frequency"
                                value="daily"
                                checked={settings.frequency === 'daily'}
                                onChange={(e) => setSettings({ ...settings, frequency: e.target.value })}
                                className="w-4 h-4 text-blue-600"
                            />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Günlük Özet</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Bildirimleri günde bir kez toplu gönder</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="frequency"
                                value="weekly"
                                checked={settings.frequency === 'weekly'}
                                onChange={(e) => setSettings({ ...settings, frequency: e.target.value })}
                                className="w-4 h-4 text-blue-600"
                            />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Haftalık Özet</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Bildirimleri haftada bir kez toplu gönder</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Quiet Hours */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                🌙 Sessiz Saatler
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Belirli saatlerde bildirim almayın
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.quietHoursEnabled}
                                onChange={() => handleToggle('quietHoursEnabled')}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    {settings.quietHoursEnabled && (
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Başlangıç Saati
                                    </label>
                                    <input
                                        type="time"
                                        value={settings.quietHoursStart}
                                        onChange={(e) => setSettings({ ...settings, quietHoursStart: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Bitiş Saati
                                    </label>
                                    <input
                                        type="time"
                                        value={settings.quietHoursEnd}
                                        onChange={(e) => setSettings({ ...settings, quietHoursEnd: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                                Bu saatler arasında bildirim almayacaksınız ({settings.quietHoursStart} - {settings.quietHoursEnd})
                            </p>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => loadSettings()}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                        Sıfırla
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Kaydediliyor...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Kaydet
                            </>
                        )}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    )
}
