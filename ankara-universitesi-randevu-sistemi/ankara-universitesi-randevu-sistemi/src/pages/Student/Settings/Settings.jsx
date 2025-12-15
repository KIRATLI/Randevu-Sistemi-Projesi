import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import ProfileCard from '../../../components/ProfileCard/ProfileCard'
import EditProfile from '../../../components/EditProfile/EditProfile'
import ChangePassword from '../../../components/ChangePassword/ChangePassword'
import { api } from '../../../utils/api'

export default function StudentSettings() {
  const currentUserId = 1 // Mock student ID

  const [profile, setProfile] = useState(null)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showAvatarUpload, setShowAvatarUpload] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    appointmentReminders: true,
    messageNotifications: true,
    systemNotifications: true
  })
  const [savingSettings, setSavingSettings] = useState(false)

  useEffect(() => {
    loadProfile()
    loadNotificationSettings()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await api.getProfile(currentUserId)
      if (response.success) {
        setProfile(response.data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadNotificationSettings = async () => {
    try {
      const response = await api.getNotificationSettings(currentUserId)
      if (response.success) {
        setNotificationSettings(response.data)
      }
    } catch (error) {
      console.error('Error loading notification settings:', error)
    }
  }

  const handleNotificationSettingChange = async (key, value) => {
    const newSettings = { ...notificationSettings, [key]: value }
    setNotificationSettings(newSettings)
    
    setSavingSettings(true)
    try {
      await api.updateNotificationSettings(currentUserId, newSettings)
    } catch (error) {
      console.error('Error updating settings:', error)
    } finally {
      setSavingSettings(false)
    }
  }

  const handleSaveProfile = async (updatedData) => {
    try {
      const response = await api.updateProfile(currentUserId, updatedData)
      if (response.success) {
        setProfile({ ...profile, ...updatedData })
        setShowEditProfile(false)
        alert('✓ Profil güncellendi')
      }
    } catch (error) {
      alert('✗ Bir hata oluştu')
    }
  }

  const handleChangePassword = async (oldPassword, newPassword) => {
    try {
      const response = await api.changePassword(currentUserId, oldPassword, newPassword)
      if (response.success) {
        setShowChangePassword(false)
        alert('✓ Şifre başarıyla değiştirildi')
      }
    } catch (error) {
      alert('✗ Eski şifre yanlış veya bir hata oluştu')
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const response = await api.uploadAvatar(currentUserId, file)
      if (response.success) {
        setProfile({ ...profile, avatar: response.avatarUrl })
        setShowAvatarUpload(false)
        alert('✓ Profil fotoğrafı güncellendi')
      }
    } catch (error) {
      alert('✗ Bir hata oluştu')
    }
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
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          ⚙️ Ayarlar
        </h1>

        {/* Profile Card */}
        <ProfileCard
          profile={profile}
          onEdit={() => setShowEditProfile(true)}
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setShowAvatarUpload(true)}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-2xl">
                📷
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Profil Fotoğrafı
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fotoğrafınızı değiştirin
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowChangePassword(true)}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-2xl">
                🔐
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Şifre Değiştir
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Güvenliğinizi koruyun
                </p>
              </div>
            </div>
          </button>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-2xl">
                📊
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  İstatistikler
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Yakında eklenecek
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📚 Eğitim Bilgileri
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Öğrenci No:</span>
                <span className="font-medium text-gray-900 dark:text-white">{profile.studentNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Fakülte:</span>
                <span className="font-medium text-gray-900 dark:text-white">{profile.faculty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Bölüm:</span>
                <span className="font-medium text-gray-900 dark:text-white">{profile.department}</span>
              </div>
              {profile.enrollmentYear && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Kayıt Yılı:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{profile.enrollmentYear}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📞 İletişim Bilgileri
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-1">E-posta:</span>
                <span className="font-medium text-gray-900 dark:text-white">{profile.email}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-1">Telefon:</span>
                <span className="font-medium text-gray-900 dark:text-white">{profile.phone || 'Belirtilmemiş'}</span>
              </div>
              {profile.emergencyContact && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400 block mb-1">Acil Durum:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{profile.emergencyContact}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🔔 Bildirim Ayarları
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">E-posta Bildirimleri</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">E-posta ile bildirim alın</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => handleNotificationSettingChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                  disabled={savingSettings}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Push Bildirimleri</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tarayıcı bildirimleri</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.pushNotifications}
                  onChange={(e) => handleNotificationSettingChange('pushNotifications', e.target.checked)}
                  className="sr-only peer"
                  disabled={savingSettings}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Randevu Hatırlatmaları</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Randevu öncesi hatırlatma</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.appointmentReminders}
                  onChange={(e) => handleNotificationSettingChange('appointmentReminders', e.target.checked)}
                  className="sr-only peer"
                  disabled={savingSettings}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Mesaj Bildirimleri</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Yeni mesaj bildirimleri</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.messageNotifications}
                  onChange={(e) => handleNotificationSettingChange('messageNotifications', e.target.checked)}
                  className="sr-only peer"
                  disabled={savingSettings}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Sistem Bildirimleri</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sistem güncellemeleri</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.systemNotifications}
                  onChange={(e) => handleNotificationSettingChange('systemNotifications', e.target.checked)}
                  className="sr-only peer"
                  disabled={savingSettings}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {savingSettings && (
              <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
                Kaydediliyor...
              </p>
            )}
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowEditProfile(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <EditProfile
                profile={profile}
                onSave={handleSaveProfile}
                onCancel={() => setShowEditProfile(false)}
              />
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowChangePassword(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <ChangePassword
                onSave={handleChangePassword}
                onCancel={() => setShowChangePassword(false)}
              />
            </div>
          </div>
        )}

        {/* Avatar Upload Modal */}
        {showAvatarUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowAvatarUpload(false)}>
            <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                📷 Profil Fotoğrafı Yükle
              </h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => setShowAvatarUpload(false)}
                className="mt-4 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                İptal
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

