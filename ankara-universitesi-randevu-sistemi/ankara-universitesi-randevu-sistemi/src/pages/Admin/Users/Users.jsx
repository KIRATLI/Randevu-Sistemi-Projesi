import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'
import UserTable from '../../../components/UserTable/UserTable'
import UserForm from '../../../components/UserForm/UserForm'
import Pagination from '../../../components/Pagination/Pagination'

export default function Users() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [users, searchQuery, roleFilter, statusFilter])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await api.getUsers()
      if (response.success) {
        setUsers(response.data)
      }
    } catch (error) {
      console.error('Kullanıcılar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...users]

    // Search
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.studentNo && user.studentNo.includes(searchQuery)) ||
        (user.registrationNo && user.registrationNo.includes(searchQuery))
      )
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }

  const handleAddUser = () => {
    setEditingUser(null)
    setShowForm(true)
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowForm(true)
  }

  const handleDeleteUser = async (user) => {
    if (window.confirm(`"${user.name}" kullanıcısını silmek istediğinize emin misiniz?`)) {
      try {
        const response = await api.deleteUser(user.id)
        if (response.success) {
          setUsers(users.filter(u => u.id !== user.id))
          alert('✓ Kullanıcı silindi')
        }
      } catch (error) {
        console.error('Silme hatası:', error)
        alert('✗ Kullanıcı silinemedi')
      }
    }
  }

  const handleFormSubmit = async (formData) => {
    try {
      if (editingUser) {
        const response = await api.updateUser(editingUser.id, formData)
        if (response.success) {
          setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u))
          alert('✓ Kullanıcı güncellendi')
        }
      } else {
        const response = await api.createUser(formData)
        if (response.success) {
          setUsers([...users, response.data])
          alert('✓ Kullanıcı eklendi')
        }
      }
      setShowForm(false)
      setEditingUser(null)
    } catch (error) {
      console.error('Kaydetme hatası:', error)
      alert('✗ İşlem başarısız')
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
              👥 Kullanıcı Yönetimi
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Toplam {filteredUsers.length} kullanıcı
            </p>
          </div>
          <button
            onClick={handleAddUser}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Kullanıcı
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Ad, e-posta veya numara ile ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="all">🎭 Tüm Roller</option>
                <option value="student">👨‍🎓 Öğrenci</option>
                <option value="academician">👨‍🏫 Akademisyen</option>
                <option value="admin">👨‍💼 Admin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="all">📊 Tüm Durumlar</option>
                <option value="active">✓ Aktif</option>
                <option value="inactive">○ Pasif</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
            <div className="flex gap-2 mt-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Filtreler:</span>
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                  Arama: "{searchQuery}"
                </span>
              )}
              {roleFilter !== 'all' && (
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full text-sm">
                  Rol: {roleFilter}
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full text-sm">
                  Durum: {statusFilter}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('')
                  setRoleFilter('all')
                  setStatusFilter('all')
                }}
                className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
              >
                ✕ Temizle
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <UserTable
            users={paginatedUsers}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />

          {/* Pagination */}
          <div className="px-6 pb-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <UserForm
            user={editingUser}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingUser(null)
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

