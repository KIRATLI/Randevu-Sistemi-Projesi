import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'

const PRIORITIES = {
    low: { label: 'Düşük', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: '🟢' },
    medium: { label: 'Orta', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: '🟡' },
    high: { label: 'Yüksek', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: '🔴' }
}

const STATUSES = {
    open: { label: 'Açık', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    in_progress: { label: 'Devam Ediyor', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    resolved: { label: 'Çözüldü', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    closed: { label: 'Kapatıldı', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }
}

export default function Tickets() {
    const [tickets, setTickets] = useState([])
    const [filteredTickets, setFilteredTickets] = useState([])
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('all')
    const [priorityFilter, setPriorityFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [replyText, setReplyText] = useState('')

    useEffect(() => {
        loadTickets()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [tickets, statusFilter, priorityFilter, searchQuery])

    const loadTickets = async () => {
        setLoading(true)
        try {
            // Mock data
            const mockTickets = [
                {
                    id: 1,
                    ticketNo: 'TKT-001',
                    subject: 'Randevu sistemi giriş sorunu',
                    description: 'Sisteme giriş yaparken "Şifre hatalı" hatası alıyorum ancak şifremi doğru giriyorum.',
                    userName: 'Ahmet Yılmaz',
                    userRole: 'student',
                    userEmail: 'ahmet@ankara.edu.tr',
                    priority: 'high',
                    status: 'open',
                    category: 'Teknik',
                    createdAt: '2025-12-20T10:30:00',
                    updatedAt: '2025-12-20T10:30:00',
                    replies: []
                },
                {
                    id: 2,
                    ticketNo: 'TKT-002',
                    subject: 'Randevu iptali ile ilgili',
                    description: 'Randevumu iptal etmek istiyorum ancak iptal butonu görünmüyor.',
                    userName: 'Zeynep Kara',
                    userRole: 'student',
                    userEmail: 'zeynep@ankara.edu.tr',
                    priority: 'medium',
                    status: 'in_progress',
                    category: 'Destek',
                    createdAt: '2025-12-19T14:15:00',
                    updatedAt: '2025-12-20T09:20:00',
                    replies: [
                        {
                            id: 1,
                            author: 'Admin',
                            role: 'admin',
                            message: 'Merhaba, randevunuzu iptal edebilmek için randevu tarihine en az 24 saat olması gerekmektedir.',
                            createdAt: '2025-12-20T09:20:00'
                        }
                    ]
                },
                {
                    id: 3,
                    ticketNo: 'TKT-003',
                    subject: 'Akademisyen bilgilerini güncelleyemiyorum',
                    description: 'Profil sayfasında ofis bilgimi güncellemek istiyorum ancak kaydet butonu çalışmıyor.',
                    userName: 'Prof. Dr. Ayşe Demir',
                    userRole: 'academician',
                    userEmail: 'ayse@ankara.edu.tr',
                    priority: 'low',
                    status: 'resolved',
                    category: 'Teknik',
                    createdAt: '2025-12-18T16:45:00',
                    updatedAt: '2025-12-19T11:30:00',
                    replies: [
                        {
                            id: 1,
                            author: 'Admin',
                            role: 'admin',
                            message: 'Sorun giderildi. Artık bilgilerinizi güncelleyebilirsiniz.',
                            createdAt: '2025-12-19T11:30:00'
                        }
                    ]
                }
            ]
            setTickets(mockTickets)
        } catch (error) {
            console.error('Ticketlar yüklenemedi:', error)
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let filtered = [...tickets]

        if (statusFilter !== 'all') {
            filtered = filtered.filter(t => t.status === statusFilter)
        }

        if (priorityFilter !== 'all') {
            filtered = filtered.filter(t => t.priority === priorityFilter)
        }

        if (searchQuery) {
            filtered = filtered.filter(t =>
                t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.userName.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        setFilteredTickets(filtered)
    }

    const handleStatusChange = (ticketId, newStatus) => {
        setTickets(tickets.map(t =>
            t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
        ))
        if (selectedTicket?.id === ticketId) {
            setSelectedTicket({ ...selectedTicket, status: newStatus })
        }
    }

    const handleReply = (ticketId) => {
        if (!replyText.trim()) return

        const newReply = {
            id: Date.now(),
            author: 'Admin',
            role: 'admin',
            message: replyText,
            createdAt: new Date().toISOString()
        }

        setTickets(tickets.map(t =>
            t.id === ticketId
                ? { ...t, replies: [...t.replies, newReply], updatedAt: new Date().toISOString() }
                : t
        ))

        if (selectedTicket?.id === ticketId) {
            setSelectedTicket({
                ...selectedTicket,
                replies: [...selectedTicket.replies, newReply]
            })
        }

        setReplyText('')
        alert('✓ Yanıt gönderildi')
    }

    const getTimeAgo = (dateString) => {
        const now = new Date()
        const past = new Date(dateString)
        const diffMs = now - past
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return 'Az önce'
        if (diffMins < 60) return `${diffMins} dakika önce`
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} saat önce`
        return `${Math.floor(diffMins / 1440)} gün önce`
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
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        🎫 Destek Talepleri
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Kullanıcı destek taleplerini görüntüleyin ve yönetin
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Toplam</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tickets.length}</p>
                            </div>
                            <div className="text-3xl">🎫</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Açık</p>
                                <p className="text-2xl font-bold text-blue-600">{tickets.filter(t => t.status === 'open').length}</p>
                            </div>
                            <div className="text-3xl">📩</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Devam Ediyor</p>
                                <p className="text-2xl font-bold text-purple-600">{tickets.filter(t => t.status === 'in_progress').length}</p>
                            </div>
                            <div className="text-3xl">⏳</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Çözüldü</p>
                                <p className="text-2xl font-bold text-green-600">{tickets.filter(t => t.status === 'resolved').length}</p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="🔍 Ticket numarası, konu veya kullanıcı ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                <option value="all">📊 Tüm Durumlar</option>
                                <option value="open">Açık</option>
                                <option value="in_progress">Devam Ediyor</option>
                                <option value="resolved">Çözüldü</option>
                                <option value="closed">Kapatıldı</option>
                            </select>
                        </div>
                        <div>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                <option value="all">⚡ Tüm Öncelikler</option>
                                <option value="high">Yüksek</option>
                                <option value="medium">Orta</option>
                                <option value="low">Düşük</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tickets List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ticket</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Konu</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Kullanıcı</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Öncelik</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Durum</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tarih</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredTickets.map(ticket => (
                                    <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm font-medium text-blue-600 dark:text-blue-400">
                                                {ticket.ticketNo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{ticket.subject}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{ticket.category}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">{ticket.userName}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{ticket.userRole === 'student' ? '👨‍🎓' : '👨‍🏫'} {ticket.userRole}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${PRIORITIES[ticket.priority].color}`}>
                                                {PRIORITIES[ticket.priority].icon} {PRIORITIES[ticket.priority].label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUSES[ticket.status].color}`}>
                                                {STATUSES[ticket.status].label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {getTimeAgo(ticket.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setSelectedTicket(ticket)
                                                }}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                Detay
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Ticket Detail Modal */}
                {selectedTicket && (
                    <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSelectedTicket(null)} />
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {selectedTicket.ticketNo} - {selectedTicket.subject}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {selectedTicket.userName} • {new Date(selectedTicket.createdAt).toLocaleString('tr-TR')}
                                        </p>
                                    </div>
                                    <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-gray-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Ticket Info */}
                                    <div className="flex gap-4">
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${PRIORITIES[selectedTicket.priority].color}`}>
                                            {PRIORITIES[selectedTicket.priority].icon} {PRIORITIES[selectedTicket.priority].label}
                                        </span>
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${STATUSES[selectedTicket.status].color}`}>
                                            {STATUSES[selectedTicket.status].label}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Açıklama</h3>
                                        <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                            {selectedTicket.description}
                                        </p>
                                    </div>

                                    {/* Replies */}
                                    {selectedTicket.replies.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Yanıtlar</h3>
                                            <div className="space-y-3">
                                                {selectedTicket.replies.map(reply => (
                                                    <div key={reply.id} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="font-medium text-blue-900 dark:text-blue-200">{reply.author}</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                {new Date(reply.createdAt).toLocaleString('tr-TR')}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700 dark:text-gray-300">{reply.message}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Reply Form */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Yanıt Yaz</h3>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            rows="4"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                            placeholder="Yanıtınızı yazın..."
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex gap-2">
                                            <select
                                                value={selectedTicket.status}
                                                onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="open">Açık</option>
                                                <option value="in_progress">Devam Ediyor</option>
                                                <option value="resolved">Çözüldü</option>
                                                <option value="closed">Kapatıldı</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedTicket(null)}
                                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                Kapat
                                            </button>
                                            <button
                                                onClick={() => handleReply(selectedTicket.id)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Yanıt Gönder
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}
