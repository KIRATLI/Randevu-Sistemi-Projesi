import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../utils/api'
import { useTheme } from '../../contexts/ThemeContext'

export default function Login() {
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState('student') // 'student' or 'academician'
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await api.login({ ...formData, role: activeTab })
    if (response.success) {
      // Redirect based on selected role
      if (activeTab === 'student') navigate('/student/dashboard')
      else if (activeTab === 'academician') navigate('/academician/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-600 rounded-full mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ankara Üniversitesi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Randevu Sistemi</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Giriş Yap</h2>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Tab Selection */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('student')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                activeTab === 'student'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              👨‍🎓 Öğrenci
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('academician')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                activeTab === 'academician'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              👨‍🏫 Akademisyen
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-posta
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                placeholder="ornek@ankara.edu.tr"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Şifremi unuttum
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
            >
              {activeTab === 'student' ? 'Öğrenci Girişi' : 'Akademisyen Girişi'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/register" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Hesabınız yok mu? Kayıt olun
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link 
            to="/admin/login"
            className="text-xs text-gray-500 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition inline-flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Yönetici Girişi
          </Link>
        </div>
      </div>
    </div>
  )
}

