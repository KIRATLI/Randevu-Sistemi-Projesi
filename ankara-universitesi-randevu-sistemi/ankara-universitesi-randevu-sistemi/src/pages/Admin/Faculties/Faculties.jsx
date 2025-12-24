import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'

export default function Faculties() {
    const [faculties, setFaculties] = useState([])
    const [filteredFaculties, setFilteredFaculties] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingFaculty, setEditingFaculty] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        dean: '',
        email: '',
        phone: '',
        building: '',
        established: ''
    })

    useEffect(() => {
        loadFaculties()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [faculties, searchQuery])

    const loadFaculties = async () => {
        setLoading(true)
        try {
            const response = await api.getFaculties()
            if (response.success) {
                setFaculties(response.data)
            }
        } catch (error) {
            console.error('Fakülteler yüklenemedi:', error)
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let filtered = [...faculties]
        if (searchQuery) {
            filtered = filtered.filter(faculty =>
                faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faculty.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faculty.dean.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }
        setFilteredFaculties(filtered)
    }

    const handleAddFaculty = () => {
        setEditingFaculty(null)
        setFormData({
            name: '',
            code: '',
            dean: '',
            email: '',
            phone: '',
            building: '',
            established: ''
        })
        setShowForm(true)
    }

    const handleEditFaculty = (faculty) => {
        setEditingFaculty(faculty)
        setFormData({
            name: faculty.name,
            code: faculty.code,
            dean: faculty.dean,
            email: faculty.email,
            phone: faculty.phone,
            building: faculty.building,
            established: faculty.established
        })
        setShowForm(true)
    }

    const handleDeleteFaculty = async (faculty) => {
        if (window.confirm(`"${faculty.name}" fakültesini silmek istediğinize emin misiniz?`)) {
            try {
                const response = await api.deleteFaculty(faculty.id)
                if (response.success) {
                    setFaculties(faculties.filter(f => f.id !== faculty.id))
                    alert('✓ Fakülte silindi')
                }
            } catch (error) {
                console.error('Silme hatası:', error)
                alert('✗ Fakülte silinemedi')
            }
        }
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingFaculty) {
                const response = await api.updateFaculty(editingFaculty.id, formData)
                if (response.success) {
                    setFaculties(faculties.map(f => f.id === editingFaculty.id ? { ...f, ...formData } : f))
                    alert('✓ Fakülte güncellendi')
                }
            } else {
                const response = await api.createFaculty(formData)
                if (response.success) {
                    setFaculties([...faculties, response.data])
                    alert('✓ Fakülte eklendi')
                }
            }
            setShowForm(false)
            setEditingFaculty(null)
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
                            🏛️ Fakülte Yönetimi
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Toplam {filteredFaculties.length} fakülte
                        </p>
                    </div>
                    <button
                        onClick={handleAddFaculty}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Fakülte
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="🔍 Fakülte adı, kod veya dekan ile ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        />
                        <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kod</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fakülte Adı</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dekan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bina</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Öğrenci</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">İletişim</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredFaculties.map((faculty) => (
                                    <tr key={faculty.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {faculty.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{faculty.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Kuruluş: {faculty.established}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{faculty.dean}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{faculty.building}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-gray-300">{faculty.studentCount} öğrenci</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{faculty.academicianCount} akademisyen</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-gray-300">{faculty.email}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{faculty.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditFaculty(faculty)}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFaculty(faculty)}
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
                                        {editingFaculty ? 'Fakülte Düzenle' : 'Yeni Fakülte Ekle'}
                                    </h2>
                                    <form onSubmit={handleFormSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Fakülte Adı *
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
                                                    Fakülte Kodu *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.code}
                                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Dekan
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.dean}
                                                    onChange={(e) => setFormData({ ...formData, dean: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Bina
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.building}
                                                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
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
                                                {editingFaculty ? 'Güncelle' : 'Ekle'}
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
