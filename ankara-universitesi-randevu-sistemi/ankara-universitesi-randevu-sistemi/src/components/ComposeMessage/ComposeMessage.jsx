import { useState } from 'react'

export default function ComposeMessage({ 
  onSend, 
  onCancel, 
  recipients = [],
  currentUserRole 
}) {
  const [formData, setFormData] = useState({
    receiverId: '',
    subject: '',
    content: ''
  })
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    
    if (!formData.receiverId) {
      newErrors.receiverId = 'Lütfen alıcı seçin'
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Lütfen konu girin'
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Lütfen mesaj yazın'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return

    setSending(true)
    await onSend(formData)
    setSending(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          ✉️ Yeni Mesaj
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
        {/* Recipient */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Alıcı *
          </label>
          <select
            value={formData.receiverId}
            onChange={(e) => setFormData({ ...formData, receiverId: parseInt(e.target.value) })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.receiverId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            disabled={sending}
          >
            <option value="">Seçiniz...</option>
            {recipients.map((recipient) => (
              <option key={recipient.id} value={recipient.id}>
                {recipient.name} {recipient.title ? `(${recipient.title})` : ''}
              </option>
            ))}
          </select>
          {errors.receiverId && (
            <p className="text-red-500 text-sm mt-1">{errors.receiverId}</p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Konu *
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Mesaj konusu..."
            disabled={sending}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mesaj *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows="8"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none ${
              errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Mesajınızı buraya yazın..."
            disabled={sending}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formData.content.length} karakter
          </p>
        </div>
      </form>

      {/* Footer */}
      <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium"
          disabled={sending}
        >
          İptal
        </button>
        <button
          onClick={handleSubmit}
          disabled={sending}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition shadow-md hover:shadow-lg font-medium"
        >
          {sending ? 'Gönderiliyor...' : '📤 Gönder'}
        </button>
      </div>
    </div>
  )
}


