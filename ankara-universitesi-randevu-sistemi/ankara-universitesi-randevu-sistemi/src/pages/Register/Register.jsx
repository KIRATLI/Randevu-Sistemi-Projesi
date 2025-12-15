import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../utils/api'
import { useTheme } from '../../contexts/ThemeContext'

export default function Register() {
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    // Öğrenci alanları
    studentNo: '',
    // Akademisyen alanları
    registrationNo: '',
    // Ortak alanlar
    department: '',
    faculty: ''
  })
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  // Şifre doğrulama
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

    // Şifre kontrolü
    if (!passwordStrength.minLength) {
      newErrors.password = 'Şifre en az 8 karakter olmalıdır'
    } else if (!passwordStrength.hasUpperCase) {
      newErrors.password = 'Şifre en az bir büyük harf içermelidir'
    } else if (!passwordStrength.hasLowerCase) {
      newErrors.password = 'Şifre en az bir küçük harf içermelidir'
    } else if (!passwordStrength.hasNumber) {
      newErrors.password = 'Şifre en az bir rakam içermelidir'
    } else if (!passwordStrength.hasSpecialChar) {
      newErrors.password = 'Şifre en az bir özel karakter içermelidir'
    }

    // Şifre eşleşme kontrolü
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

    const response = await api.register(formData)
    if (response.success) {
      navigate('/login')
    }
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ankara Üniversitesi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Randevu Sistemi</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Kayıt Ol
            </h2>
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
                Ad Soyad
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                placeholder="Adınız Soyadınız"
                required
              />
            </div>

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
                Kayıt Tipi
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  role: e.target.value,
                  studentNo: '',
                  registrationNo: ''
                })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              >
                <option value="student">👨‍🎓 Öğrenci</option>
                <option value="academician">👨‍🏫 Akademisyen</option>
              </select>
            </div>

            {/* Öğrenci No / Sicil No */}
            {formData.role === 'student' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Öğrenci Numarası
                </label>
                <input
                  type="text"
                  value={formData.studentNo}
                  onChange={(e) => setFormData({ ...formData, studentNo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                  placeholder="örn: 12345678"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sicil Numarası
                </label>
                <input
                  type="text"
                  value={formData.registrationNo}
                  onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                  placeholder="örn: AKD-2024-001"
                  required
                />
              </div>
            )}

            {/* Fakülte */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fakülte
              </label>
              <select
                value={formData.faculty}
                onChange={(e) => setFormData({ ...formData, faculty: e.target.value, department: '' })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                required
              >
                <option value="">Fakülte Seçiniz</option>
                <option value="muhendislik">Mühendislik Fakültesi</option>
                <option value="fen">Fen Fakültesi</option>
                <option value="tip">Tıp Fakültesi</option>
                <option value="hukuk">Hukuk Fakültesi</option>
                <option value="edebiyat">Dil ve Tarih-Coğrafya Fakültesi</option>
                <option value="iletisim">İletişim Fakültesi</option>
                <option value="egitim">Eğitim Bilimleri Fakültesi</option>
                <option value="siyasal">Siyasal Bilgiler Fakültesi</option>
              </select>
            </div>

            {/* Bölüm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bölüm
              </label>
              {formData.faculty === 'muhendislik' ? (
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                  required
                >
                  <option value="">Bölüm Seçiniz</option>
                  <option value="bilgisayar">Bilgisayar Mühendisliği</option>
                  <option value="elektrik">Elektrik-Elektronik Mühendisliği</option>
                  <option value="makine">Makine Mühendisliği</option>
                  <option value="insaat">İnşaat Mühendisliği</option>
                  <option value="endustri">Endüstri Mühendisliği</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                  placeholder="Bölüm adını yazın"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Şifre
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
                Şifre Tekrar
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
            >
              Kayıt Ol
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Zaten hesabınız var mı? Giriş yapın
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

