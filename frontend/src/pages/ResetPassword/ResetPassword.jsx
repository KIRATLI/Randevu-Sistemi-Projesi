import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { darkMode, toggleDarkMode } = useTheme()
  
  const [formData, setFormData] = useState({
    code: searchParams.get('code') || '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  useEffect(() => {
    const password = formData.password
    setPasswordStrength({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    })
  }, [formData.password])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.code) {
      newErrors.code = 'Doğrulama kodu gereklidir'
    }

    if (!passwordStrength.minLength || !passwordStrength.hasUpperCase || 
        !passwordStrength.hasLowerCase || !passwordStrength.hasNumber || 
        !passwordStrength.hasSpecialChar) {
      newErrors.password = 'Şifre tüm gereksinimleri karşılamalıdır'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    // Mock API call
    setTimeout(() => {
      setLoading(false)
      alert('Şifreniz başarıyla sıfırlandı!')
      navigate('/login')
    }, 1500)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-blue-600 rounded-full mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Şifre Sıfırla
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            E-postanıza gönderilen kodu girin ve yeni şifrenizi belirleyin
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Doğrulama Kodu
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition text-center tracking-wider text-lg ${
                  errors.code ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="XXXXXX"
                maxLength="6"
                required
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                E-postanıza gönderilen 6 haneli kodu girin
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Yeni Şifre
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition ${
                  errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="••••••••"
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Yeni Şifre Tekrar
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="••••••••"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Şifre Gereksinimleri */}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
            >
              {loading ? 'Şifre Sıfırlanıyor...' : 'Şifreyi Sıfırla'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button 
              onClick={() => navigate('/forgot-password')}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm block w-full"
            >
              Kod gelmedi mi? Tekrar gönder
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="text-gray-600 dark:text-gray-400 hover:underline text-sm"
            >
              Giriş sayfasına dön
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


