import { useState } from 'react'

export default function EditProfile({ profile, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    bio: profile.bio || '',
    address: profile.address || '',
    emergencyContact: profile.emergencyContact || '',
    officeHours: profile.officeHours || '',
    specializations: profile.specializations?.join(', ') || ''
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Ad Soyad gereklidir'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta gereklidir'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return

    setSaving(true)
    
    const updatedData = {
      ...formData,
      specializations: formData.specializations
        ? formData.specializations.split(',').map(s => s.trim()).filter(s => s)
        : []
    }

    await onSave(updatedData)
    setSaving(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          ✏️ Profili Düzenle
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ad Soyad *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            disabled={saving}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            E-posta *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            disabled={saving}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Telefon
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="+90 5XX XXX XX XX"
            disabled={saving}
          />
        </div>

        {/* Bio (Academician) */}
        {profile.role === 'academician' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hakkımda
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Kendinizden bahsedin..."
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Uzmanlık Alanları
              </label>
              <input
                type="text"
                value={formData.specializations}
                onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Virgülle ayırın: Yapay Zeka, Makine Öğrenmesi..."
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ofis Saatleri
              </label>
              <input
                type="text"
                value={formData.officeHours}
                onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Örn: Pazartesi-Cuma 09:00-17:00"
                disabled={saving}
              />
            </div>
          </>
        )}

        {/* Address (Student) */}
        {profile.role === 'student' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adres
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Acil Durum İletişim
              </label>
              <input
                type="tel"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="+90 5XX XXX XX XX"
                disabled={saving}
              />
            </div>
          </>
        )}
      </form>

      {/* Footer */}
      <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium"
          disabled={saving}
        >
          İptal
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition shadow-md hover:shadow-lg font-medium"
        >
          {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
        </button>
      </div>
    </div>
  )
}


