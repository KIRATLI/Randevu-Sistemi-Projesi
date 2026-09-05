import { useState, useEffect } from 'react'

export default function ComposeAnnouncement({ announcement, onSubmit, onCancel }) {
  const isEdit = !!announcement

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    targetAudience: 'all',
    priority: 'medium',
    expiresAt: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || '',
        content: announcement.content || '',
        type: announcement.type || 'info',
        targetAudience: announcement.targetAudience || 'all',
        priority: announcement.priority || 'medium',
        expiresAt: announcement.expiresAt ? announcement.expiresAt.split('T')[0] : ''
      })
    }
  }, [announcement])

  const validate = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Başlık gereklidir'
    if (formData.title.length < 5) newErrors.title = 'Başlık en az 5 karakter olmalıdır'
    if (!formData.content.trim()) newErrors.content = 'İçerik gereklidir'
    if (formData.content.length < 20) newErrors.content = 'İçerik en az 20 karakter olmalıdır'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">
            {isEdit ? '✏️ Duyuruyu Düzenle' : '➕ Yeni Duyuru Oluştur'}
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Başlık *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.title ? 'border-red-500' : ''
              }`}
              placeholder="Duyuru başlığını girin"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              İçerik *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none ${
                errors.content ? 'border-red-500' : ''
              }`}
              placeholder="Duyuru içeriğini girin..."
            />
            <div className="flex justify-between mt-1">
              {errors.content ? (
                <p className="text-red-500 text-xs">{errors.content}</p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Minimum 20 karakter
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formData.content.length} karakter
              </p>
            </div>
          </div>

          {/* Type & Priority Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tip *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="info">ℹ️ Bilgilendirme</option>
                <option value="warning">⚠️ Uyarı</option>
                <option value="success">✅ Başarı</option>
                <option value="error">❌ Hata</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Öncelik *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="low">🟢 Düşük</option>
                <option value="medium">🟡 Orta</option>
                <option value="high">🔴 Yüksek</option>
              </select>
            </div>
          </div>

          {/* Target Audience & Expires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hedef Kitle *
              </label>
              <select
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">👥 Herkes</option>
                <option value="student">👨‍🎓 Öğrenciler</option>
                <option value="academician">👨‍🏫 Akademisyenler</option>
                <option value="admin">👨‍💼 Adminler</option>
              </select>
            </div>

            {/* Expires At */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Son Geçerlilik Tarihi (Opsiyonel)
              </label>
              <input
                type="date"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Boş bırakılırsa süresiz olur
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📋 Önizleme
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {formData.title || 'Başlık buraya gelecek'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formData.content || 'İçerik buraya gelecek'}
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isEdit ? 'Güncelle' : 'Yayınla'}
          </button>
        </div>
      </div>
    </div>
  )
}


