import { useState, useEffect } from 'react'

export default function ChangePassword({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  useEffect(() => {
    const password = formData.newPassword
    setPasswordStrength({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    })
  }, [formData.newPassword])

  const validate = () => {
    const newErrors = {}
    
    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Mevcut şifrenizi girin'
    }

    if (!passwordStrength.minLength || !passwordStrength.hasUpperCase || 
        !passwordStrength.hasLowerCase || !passwordStrength.hasNumber || 
        !passwordStrength.hasSpecialChar) {
      newErrors.newPassword = 'Şifre tüm gereksinimleri karşılamalıdır'
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor'
    }

    if (formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = 'Yeni şifre eski şifre ile aynı olamaz'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return

    setSaving(true)
    await onSave(formData.oldPassword, formData.newPassword)
    setSaving(false)
  }

  const PasswordRequirement = ({ met, text }) => (
    <div className="flex items-center gap-2 text-sm">
      <span className={met ? 'text-green-500' : 'text-gray-400'}>
        {met ? '✓' : '○'}
      </span>
      <span className={met ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
        {text}
      </span>
    </div>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          🔐 Şifre Değiştir
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
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Old Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mevcut Şifre *
          </label>
          <input
            type="password"
            value={formData.oldPassword}
            onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.oldPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="••••••••"
            disabled={saving}
          />
          {errors.oldPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Yeni Şifre *
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="••••••••"
            disabled={saving}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Yeni Şifre Tekrar *
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="••••••••"
            disabled={saving}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Şifre gereksinimleri:
          </p>
          <PasswordRequirement met={passwordStrength.minLength} text="En az 8 karakter" />
          <PasswordRequirement met={passwordStrength.hasUpperCase} text="En az bir büyük harf (A-Z)" />
          <PasswordRequirement met={passwordStrength.hasLowerCase} text="En az bir küçük harf (a-z)" />
          <PasswordRequirement met={passwordStrength.hasNumber} text="En az bir rakam (0-9)" />
          <PasswordRequirement met={passwordStrength.hasSpecialChar} text="En az bir özel karakter (!@#$%...)" />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium"
            disabled={saving}
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition shadow-md hover:shadow-lg font-medium"
          >
            {saving ? 'Değiştiriliyor...' : '🔒 Şifreyi Değiştir'}
          </button>
        </div>
      </form>
    </div>
  )
}


