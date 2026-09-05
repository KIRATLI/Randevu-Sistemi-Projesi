import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'

export default function Settings() {
    const [settings, setSettings] = useState({
        // Randevu Ayarları
        defaultDuration: '30',
        maxDailyAppointments: '10',
        cancellationDeadline: '24',

        // Çalışma Saatleri
        workStartTime: '09:00',
        workEndTime: '17:00',

        // Bildirim Ayarları
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,

        // Sistem Ayarları
        maintenanceMode: false,
        allowRegistration: true,
        requireEmailVerification: true
    })

    const [saved, setSaved] = useState(false)

    const handleSave = (e) => {
        e.preventDefault()
        // API'ye kaydetme işlemi burada yapılacak
        console.log('Ayarlar kaydedildi:', settings)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        alert('✓ Sistem ayarları kaydedildi')
    }

    const handleReset = () => {
        if (window.confirm('Tüm ayarları varsayılan değerlere sıfırlamak istediğinize emin misiniz?')) {
            setSettings({
                defaultDuration: '30',
                maxDailyAppointments: '10',
                cancellationDeadline: '24',
                workStartTime: '09:00',
                workEndTime: '17:00',
                emailNotifications: true,
                smsNotifications: false,
                pushNotifications: true,
                maintenanceMode: false,
                allowRegistration: true,
                requireEmailVerification: true
            })
            alert('✓ Ayarlar sıfırlandı')
        }
    }

    return (
        <DashboardLayout userRole="admin">
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        ⚙️ Sistem Ayarları
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Randevu sistemi genel ayarlarını yapılandırın
                    </p>
                </div>

                <form onSubmit={handleSave}>
                    <div className="space-y-6">
                        {/* Randevu Ayarları */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span>📅</span>
                                Randevu Ayarları
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Varsayılan Randevu Süresi
                                    </label>
                                    <select
                                        value={settings.defaultDuration}
                                        onChange={(e) => setSettings({ ...settings, defaultDuration: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="15">15 dakika</option>
                                        <option value="30">30 dakika</option>
                                        <option value="45">45 dakika</option>
                                        <option value="60">60 dakika</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Maksimum Günlük Randevu
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={settings.maxDailyAppointments}
                                        onChange={(e) => setSettings({ ...settings, maxDailyAppointments: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        İptal Süresi (saat öncesine kadar)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="72"
                                        value={settings.cancellationDeadline}
                                        onChange={(e) => setSettings({ ...settings, cancellationDeadline: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Çalışma Saatleri */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span>🕒</span>
                                Genel Çalışma Saatleri
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Başlangıç Saati
                                    </label>
                                    <input
                                        type="time"
                                        value={settings.workStartTime}
                                        onChange={(e) => setSettings({ ...settings, workStartTime: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Bitiş Saati
                                    </label>
                                    <input
                                        type="time"
                                        value={settings.workEndTime}
                                        onChange={(e) => setSettings({ ...settings, workEndTime: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Not: Bu ayarlar tüm akademisyenler için varsayılan değerlerdir. Her akademisyen kendi çalışma saatlerini özelleştirebilir.
                            </p>
                        </div>

                        {/* Bildirim Ayarları */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span>🔔</span>
                                Bildirim Ayarları
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">E-posta Bildirimleri</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Kullanıcılara e-posta ile bildirim gönder</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">SMS Bildirimleri</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Kullanıcılara SMS ile bildirim gönder</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSettings({ ...settings, smsNotifications: !settings.smsNotifications })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.smsNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Push Bildirimleri</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Tarayıcı push bildirimleri</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSettings({ ...settings, pushNotifications: !settings.pushNotifications })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sistem Ayarları */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span>🔧</span>
                                Sistem Kontrolleri
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <div>
                                        <p className="font-medium text-red-900 dark:text-red-200">Bakım Modu</p>
                                        <p className="text-sm text-red-700 dark:text-red-300">Sistem bakımda, kullanıcılar erişemez</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Kullanıcı Kaydına İzin Ver</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Yeni kullanıcılar kayıt olabilir</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSettings({ ...settings, allowRegistration: !settings.allowRegistration })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.allowRegistration ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.allowRegistration ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">E-posta Doğrulaması Gerekli</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Yeni kullanıcılar e-posta doğrulamalı</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSettings({ ...settings, requireEmailVerification: !settings.requireEmailVerification })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.requireEmailVerification ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            >
                                Sıfırla
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                            >
                                {saved && <span>✓</span>}
                                Kaydet
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}
