import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'
import AcademicianCard from '../../../components/AcademicianCard/AcademicianCard'
import Pagination from '../../../components/Pagination/Pagination'

export default function AcademicianList() {
  const [academicians, setAcademicians] = useState([])
  const [filteredAcademicians, setFilteredAcademicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedTitle, setSelectedTitle] = useState('all')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)

  useEffect(() => {
    loadAcademicians()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [academicians, searchQuery, selectedFaculty, selectedDepartment, selectedTitle, showAvailableOnly])

  const loadAcademicians = async () => {
    setLoading(true)
    try {
      const response = await api.getAcademicians()
      if (response.success) {
        setAcademicians(response.data)
      }
    } catch (error) {
      console.error('Akademisyenler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...academicians]

    // Search
    if (searchQuery) {
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Faculty filter
    if (selectedFaculty !== 'all') {
      filtered = filtered.filter(a => a.faculty === selectedFaculty)
    }

    // Department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(a => a.department === selectedDepartment)
    }

    // Title filter
    if (selectedTitle !== 'all') {
      filtered = filtered.filter(a => a.title === selectedTitle)
    }

    // Available only
    if (showAvailableOnly) {
      filtered = filtered.filter(a => a.available)
    }

    setFilteredAcademicians(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedFaculty('all')
    setSelectedDepartment('all')
    setSelectedTitle('all')
    setShowAvailableOnly(false)
  }

  // Get unique values
  const faculties = [...new Set(academicians.map(a => a.faculty))]
  const departments = [...new Set(
    academicians
      .filter(a => selectedFaculty === 'all' || a.faculty === selectedFaculty)
      .map(a => a.department)
  )]
  const titles = [...new Set(academicians.map(a => a.title))]

  // Pagination
  const totalPages = Math.ceil(filteredAcademicians.length / itemsPerPage)
  const paginatedAcademicians = filteredAcademicians.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
    return (
      <DashboardLayout userRole="student">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              👨‍🏫 Akademisyen Listesi
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {filteredAcademicians.length} akademisyen bulundu
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              title="Kart Görünümü"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded transition ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              title="Liste Görünümü"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Ad, bölüm veya uzmanlık alanı ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Faculty */}
            <div>
              <select
                value={selectedFaculty}
                onChange={(e) => {
                  setSelectedFaculty(e.target.value)
                  setSelectedDepartment('all')
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="all">🏛️ Tüm Fakülteler</option>
                {faculties.map(faculty => (
                  <option key={faculty} value={faculty}>{faculty}</option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="all">📚 Tüm Bölümler</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <select
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="all">👔 Tüm Ünvanlar</option>
                {titles.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Available Only Checkbox */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Sadece müsait akademisyenleri göster
              </span>
            </label>

            {/* Clear Filters */}
            {(searchQuery || selectedFaculty !== 'all' || selectedDepartment !== 'all' || selectedTitle !== 'all' || showAvailableOnly) && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                ✕ Filtreleri Temizle
              </button>
            )}
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedFaculty !== 'all' || selectedDepartment !== 'all' || selectedTitle !== 'all' || showAvailableOnly) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Aktif Filtreler:</span>
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                  Arama: "{searchQuery}"
                </span>
              )}
              {selectedFaculty !== 'all' && (
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full text-sm">
                  {selectedFaculty}
                </span>
              )}
              {selectedDepartment !== 'all' && (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full text-sm">
                  {selectedDepartment}
                </span>
              )}
              {selectedTitle !== 'all' && (
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 rounded-full text-sm">
                  {selectedTitle}
                </span>
              )}
              {showAvailableOnly && (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full text-sm">
                  ✓ Müsait Olanlar
                </span>
              )}
            </div>
          )}
        </div>

        {/* Academicians List */}
        {paginatedAcademicians.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <svg className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Akademisyen bulunamadı
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Farklı filtreler deneyebilirsiniz
            </p>
          </div>
        ) : (
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {paginatedAcademicians.map((academician) => (
                <AcademicianCard
                  key={academician.id}
                  academician={academician}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

