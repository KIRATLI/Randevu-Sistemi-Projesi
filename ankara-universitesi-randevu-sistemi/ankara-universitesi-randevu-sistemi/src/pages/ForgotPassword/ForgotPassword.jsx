import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

export default function ForgotPassword() {
  const { darkMode, toggleDarkMode } = useTheme()
  const [step, setStep] = useState(1) // 1: Email, 2: Code sent
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Mock API call - gerçek backend'de mail gönderilecek
    setTimeout(() => {
      setStep(2)
      setMessage(`${email} adresine şifre sıfırlama kodu gönderildi.`)
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-blue-600 rounded-full mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Şifremi Unuttum
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            E-posta adresinize şifre sıfırlama kodu göndereceğiz
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

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                  placeholder="ornek@ankara.edu.tr"
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Kayıtlı e-posta adresinizi girin
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
              >
                {loading ? 'Gönderiliyor...' : 'Kod Gönder'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-green-800 dark:text-green-300 text-sm">
                  {message}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  E-postanızdaki linke tıklayarak şifrenizi sıfırlayabilirsiniz.
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  Link 15 dakika geçerlidir.
                </p>
              </div>

              <Link
                to="/reset-password"
                className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg text-center"
              >
                Şifre Sıfırlama Sayfasına Git
              </Link>

              <button
                onClick={() => {
                  setStep(1)
                  setEmail('')
                  setMessage('')
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Başka bir e-posta ile dene
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Giriş sayfasına dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


