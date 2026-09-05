import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'

export default function Departments() {
    const [departments, setDepartments] = useState([])
    const [faculties, setFaculties] = useState([])
    const [filteredDepartments, setFilteredDepartments] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingDepartment, setEditingDepartment] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [facultyFilter, setFacultyFilter] = useState('all')
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        facultyId: '',
        head: '',
        email: '',
        phone: '',
        office: '',
        established: ''
    })

    useEffect(() => {
        loadDepartments()
        loadFaculties()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [departments, searchQuery, facultyFilter])

    const loadDepartments = async () => {
        setLoading(true)
        try {
            const response = await api.getDepartments()
            if (response.success) {
                setDepartments(response.data)
            }
        } catch (error) {
            console.error('Bölümler yüklenemedi:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadFaculties = async () => {
        try {
            const response = await api.getFaculties()
            if (response.success) {
                setFaculties(response.data)
            }
        } catch (error) {
            console.error('Fakülteler yüklenemedi:', error)
        }
    }

    const applyFilters = () => {
        let filtered = [...departments]

        if (searchQuery) {
            filtered = filtered.filter(dept =>
                dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dept.head.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        if (facultyFilter !== 'all') {
            filtered = filtered.filter(dept => dept.facultyId === parseInt(facultyFilter))
        }

        setFilteredDepartments(filtered)
    }

    const handleAddDepartment = () => {
        setEditingDepartment(null)
        setFormData({
            name: '',
            code: '',
            facultyId: '',
            head: '',
            email: '',
            phone: '',
            office: '',
            established: ''
        })
        setShowForm(true)
    }

    const handleEditDepartment = (department) => {
        setEditingDepartment(department)
        setFormData({
            name: department.name,
            code: department.code,
            facultyId: department.facultyId,
            head: department.head,
            email: department.email,
            phone: department.phone,
            office: department.office,
            established: department.established
        })
        setShowForm(true)
    }

    const handleDeleteDepartment = async (department) => {
        if (window.confirm(`"${department.name}" bölümünü silmek istediğinize emin misiniz?`)) {
            try {
                const response = await api.deleteDepartment(department.id)
                if (response.success) {
                    setDepartments(departments.filter(d => d.id !== department.id))
                    alert('✓ Bölüm silindi')
                }
            } catch (error) {
                console.error('Silme hatası:', error)
                alert('✗ Bölüm silinemedi')
            }
        }
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        try {
            const faculty = faculties.find(f => f.id === parseInt(formData.facultyId))
            const submitData = { ...formData, facultyName: faculty?.name }

            if (editingDepartment) {
                const response = await api.updateDepartment(editingDepartment.id, submitData)
                if (response.success) {
                    setDepartments(departments.map(d => d.id === editingDepartment.id ? { ...d, ...submitData } : d))
                    alert('✓ Bölüm güncellendi')
                }
            } else {
                const response = await api.createDepartment(submitData)
                if (response.success) {
                    setDepartments([...departments, response.data])
                    alert('✓ Bölüm eklendi')
                }
            }
            setShowForm(false)
            setEditingDepartment(null)
        } catch (error) {
            console.error('Kaydetme hatası:', error)
            alert('✗ İşlem başarısız')
        }
    }

    if (loading) {
        return (
            <DashboardLayout userRole="admin">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout userRole="admin">
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            📚 Bölüm Yönetimi
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Toplam {filteredDepartments.length} bölüm
                        </p>
                    </div>
                    <button
                        onClick={handleAddDepartment}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Bölüm
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 relative">
                            <input
                                type="text"
                                placeholder="🔍 Bölüm adı, kod veya bölüm başkanı ile ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                            <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div>
                            <select
                                value={facultyFilter}
                                onChange={(e) => setFacultyFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                <option value="all">🏛️ Tüm Fakülteler</option>
                                {faculties.map(faculty => (
                                    <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kod</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bölüm Adı</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fakülte</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bölüm Başkanı</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text- gray-500 dark:text-gray-300 uppercase tracking-wider">İletişim</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredDepartments.map((department) => (
                                    <tr key={department.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                {department.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{department.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{department.office} • Kuruluş: {department.established}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{department.facultyName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{department.head}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-gray-300">{department.email}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{department.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditDepartment(department)}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDepartment(department)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Sil
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowForm(false)} />
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                        {editingDepartment ? 'Bölüm Düzenle' : 'Yeni Bölüm Ekle'}
                                    </h2>
                                    <form onSubmit={handleFormSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Bölüm Adı *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Bölüm Kodu *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.code}
                                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Fakülte *
                                                </label>
                                                <select
                                                    required
                                                    value={formData.facultyId}
                                                    onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="">Fakülte Seçin</option>
                                                    {faculties.map(faculty => (
                                                        <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Bölüm Başkanı
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.head}
                                                    onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Ofis
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.office}
                                                    onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
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
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Telefon
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Kuruluş Yılı
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.established}
                                                    onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-4 mt-6">
                                            <button
                                                type="button"
                                                onClick={() => setShowForm(false)}
                                                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                            >
                                                İptal
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                {editingDepartment ? 'Güncelle' : 'Ekle'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}
