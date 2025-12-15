import { useState, useEffect } from 'react'

export default function UserForm({ user, onSubmit, onCancel }) {
  const isEdit = !!user

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    department: '',
    faculty: '',
    phone: '',
    status: 'active',
    password: '',
    studentNo: '',
    registrationNo: '',
    title: '',
    office: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'student',
        department: user.department || '',
        faculty: user.faculty || '',
        phone: user.phone || '',
        status: user.status || 'active',
        password: '',
        studentNo: user.studentNo || '',
        registrationNo: user.registrationNo || '',
        title: user.title || '',
        office: user.office || ''
      })
    }
  }, [user])

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Ad Soyad gereklidir'
    if (!formData.email.trim()) newErrors.email = 'E-posta gereklidir'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin'
    }

    if (!isEdit && !formData.password) {
      newErrors.password = 'Şifre gereklidir'
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Şifre en az 8 karakter olmalıdır'
    }

    if (formData.role === 'student' && !formData.studentNo) {
      newErrors.studentNo = 'Öğrenci numarası gereklidir'
    }

    if (formData.role === 'academician') {
      if (!formData.registrationNo) newErrors.registrationNo = 'Sicil numarası gereklidir'
      if (!formData.title) newErrors.title = 'Ünvan gereklidir'
    }

    if (!formData.department.trim()) newErrors.department = 'Bölüm gereklidir'
    if (!formData.faculty.trim()) newErrors.faculty = 'Fakülte gereklidir'

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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEdit ? '👤 Kullanıcı Düzenle' : '➕ Yeni Kullanıcı Ekle'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Ad Soyad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ad Soyad *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* E-posta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              E-posta *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Şifre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Şifre {isEdit ? '(boş bırakılırsa değişmez)' : '*'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rol *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="student">👨‍🎓 Öğrenci</option>
              <option value="academician">👨‍🏫 Akademisyen</option>
              <option value="admin">👨‍💼 Admin</option>
            </select>
          </div>

          {/* Student No */}
          {formData.role === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Öğrenci No *
              </label>
              <input
                type="text"
                name="studentNo"
                value={formData.studentNo}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.studentNo ? 'border-red-500' : ''
                }`}
              />
              {errors.studentNo && <p className="text-red-500 text-xs mt-1">{errors.studentNo}</p>}
            </div>
          )}

          {/* Academician Fields */}
          {formData.role === 'academician' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sicil No *
                </label>
                <input
                  type="text"
                  name="registrationNo"
                  value={formData.registrationNo}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.registrationNo ? 'border-red-500' : ''
                  }`}
                />
                {errors.registrationNo && <p className="text-red-500 text-xs mt-1">{errors.registrationNo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ünvan *
                </label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.title ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Seçiniz</option>
                  <option value="Profesör">Profesör</option>
                  <option value="Doçent">Doçent</option>
                  <option value="Dr. Öğr. Üyesi">Dr. Öğr. Üyesi</option>
                  <option value="Öğr. Görevlisi">Öğr. Görevlisi</option>
                  <option value="Araştırma Görevlisi">Araştırma Görevlisi</option>
                </select>
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ofis
                </label>
                <input
                  type="text"
                  name="office"
                  value={formData.office}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </>
          )}

          {/* Bölüm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bölüm *
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.department ? 'border-red-500' : ''
              }`}
            />
            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
          </div>

          {/* Fakülte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fakülte *
            </label>
            <input
              type="text"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.faculty ? 'border-red-500' : ''
              }`}
            />
            {errors.faculty && <p className="text-red-500 text-xs mt-1">{errors.faculty}</p>}
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Telefon
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+90 5XX XXX XX XX"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Durum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Durum
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="active">✓ Aktif</option>
              <option value="inactive">○ Pasif</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {isEdit ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


