import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'

const CATEGORIES = [
    { id: 'technical', label: 'Teknik Sorun', icon: '🔧', color: 'blue' },
    { id: 'appointment', label: 'Randevu Sorunu', icon: '📅', color: 'purple' },
    { id: 'complaint', label: 'Şikayet', icon: '⚠️', color: 'red' },
    { id: 'suggestion', label: 'Öneri', icon: '💡', color: 'green' },
    { id: 'other', label: 'Diğer', icon: '📋', color: 'gray' }
]

const PRIORITIES = {
    low: { label: 'Düşük', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: '🟢' },
    medium: { label: 'Orta', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: '🟡' },
    high: { label: 'Yüksek', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: '🔴' }
}

const STATUSES = {
    open: { label: 'Açık', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    in_progress: { label: 'İşleniyor', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    resolved: { label: 'Çözüldü', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    closed: { label: 'Kapatıldı', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }
}

export default function StudentSupport() {
    const [tickets, setTickets] = useState([])
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [showNewTicketForm, setShowNewTicketForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [replyText, setReplyText] = useState('')

    const [newTicket, setNewTicket] = useState({
        category: 'technical',
        priority: 'medium',
        subject: '',
        description: ''
    })

    useEffect(() => {
        loadTickets()
    }, [])

    const loadTickets = async () => {
        setLoading(true)
        try {
            // ÖNEMLİ GİZLİLİK KURALI:
            // API'den sadece GİRİŞ YAPMIŞ ÖĞRENCİNİN kendi talepleri çekilir
            // Başka öğrencilerin talepleri GÖRÜLEMEMELİDİR
            // Örnek API çağrısı: api.getMyTickets() - sadece kendi ticket'larını döner
            // Mock data (gerçek uygulamada API'den sadece kendi ticket'ları gelecek) - gerçek API'den gelecek
            const mockTickets = [
                {
                    id: 1,
                    ticketNo: 'TKT-101',
                    subject: 'Randevu oluşturamıyorum',
                    description: 'Akademisyen profil sayfasından randevu oluşturmaya çalıştığımda hata alıyorum.',
                    category: 'technical',
                    priority: 'high',
                    status: 'in_progress',
                    createdAt: '2025-12-20T10:00:00',
                    updatedAt: '2025-12-20T14:30:00',
                    replies: [
                        {
                            id: 1,
                            author: 'Destek Ekibi',
                            role: 'admin',
                            message: 'Sorununuzu inceliyoruz. Hangi akademisyen için randevu almaya çalışıyordunuz?',
                            createdAt: '2025-12-20T14:30:00'
                        }
                    ]
                },
                {
                    id: 2,
                    ticketNo: 'TKT-102',
                    subject: 'Bildirim gelmiyor',
                    description: 'Email bildirimleri aktif olmasına rağmen randevu onayı bildirimi almadım.',
                    category: 'technical',
                    priority: 'medium',
                    status: 'resolved',
                    createdAt: '2025-12-19T09:15:00',
                    updatedAt: '2025-12-19T16:20:00',
                    replies: [
                        {
                            id: 1,
                            author: 'Destek Ekibi',
                            role: 'admin',
                            message: 'Email ayarlarınızı kontrol ettik ve düzelttik. Artık bildirim alacaksınız.',
                            createdAt: '2025-12-19T16:20:00'
                        }
                    ]
                }
            ]
            setTickets(mockTickets)
        } catch (error) {
            console.error('Talepler yüklenemedi:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateTicket = async () => {
        if (!newTicket.subject.trim() || !newTicket.description.trim()) {
            alert('Lütfen tüm alanları doldurun')
            return
        }

        try {
            const ticket = {
                ...newTicket,
                ticketNo: `TKT-${Math.floor(Math.random() * 1000) + 100}`,
                status: 'open',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                replies: []
            }

            setTickets([ticket, ...tickets])
            setShowNewTicketForm(false)
            setNewTicket({ category: 'technical', priority: 'medium', subject: '', description: '' })
            alert('✓ Destek talebiniz oluşturuldu')
        } catch (error) {
            alert('✗ Bir hata oluştu')
        }
    }

    const handleReply = async () => {
        if (!replyText.trim()) return

        // ÖNEMLİ: Kullanıcı sadece KENDİ TALEPLERİNE yanıt verebilir
        // Backend'de de bu kontrol edilmelidir
        try {
            const newReply = {
                id: Date.now(),
                author: 'Ahmet Yılmaz',
                role: 'student',
                message: replyText,
                createdAt: new Date().toISOString()
            }

            const updatedTickets = tickets.map(t =>
                t.id === selectedTicket.id
                    ? { ...t, replies: [...t.replies, newReply], updatedAt: new Date().toISOString() }
                    : t
            )

            setTickets(updatedTickets)
            setSelectedTicket({ ...selectedTicket, replies: [...selectedTicket.replies, newReply] })
            setReplyText('')
            alert('✓ Yanıtınız gönderildi')
        } catch (error) {
            alert('✗ Bir hata oluştu')
        }
    }

    const filteredTickets = tickets.filter(t => {
        if (filter === 'all') return true
        return t.status === filter
    })

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length
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
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            🎫 Destek & Şikayet
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Sorunlarınızı bildirin ve destek alın
                        </p>
                    </div>
                    <button
                        onClick={() => setShowNewTicketForm(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Talep Oluştur
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Toplam</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Açık</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">İşleniyor</p>
                        <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Çözüldü</p>
                        <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        Tümü ({stats.total})
                    </button>
                    <button
                        onClick={() => setFilter('open')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'open' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        Açık ({stats.open})
                    </button>
                    <button
                        onClick={() => setFilter('in_progress')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        İşleniyor ({stats.inProgress})
                    </button>
                    <button
                        onClick={() => setFilter('resolved')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'resolved' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        Çözüldü ({stats.resolved})
                    </button>
                </div>

                {/* Tickets List */}
                <div className="space-y-4">
                    {filteredTickets.length > 0 ? (
                        filteredTickets.map(ticket => (
                            <div
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-mono text-sm font-medium text-blue-600 dark:text-blue-400">
                                                {ticket.ticketNo}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${PRIORITIES[ticket.priority].color}`}>
                                                {PRIORITIES[ticket.priority].icon} {PRIORITIES[ticket.priority].label}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUSES[ticket.status].color}`}>
                                                {STATUSES[ticket.status].label}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{ticket.subject}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{ticket.description}</p>
                                    </div>
                                    <div className="text-3xl">
                                        {CATEGORIES.find(c => c.id === ticket.category)?.icon}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                    <span>{getTimeAgo(ticket.createdAt)}</span>
                                    <span>{ticket.replies.length} yanıt</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                            <svg className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                Henüz destek talebiniz yok
                            </p>
                        </div>
                    )}
                </div>

                {/* New Ticket Modal */}
                {showNewTicketForm && (
                    <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowNewTicketForm(false)} />
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Yeni Destek Talebi
                                    </h2>
                                    <button onClick={() => setShowNewTicketForm(false)} className="text-gray-400 hover:text-gray-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {CATEGORIES.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setNewTicket({ ...newTicket, category: cat.id })}
                                                    className={`p-3 rounded-lg border-2 transition ${newTicket.category === cat.id
                                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="text-2xl mb-1">{cat.icon}</div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{cat.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Öncelik</label>
                                        <select
                                            value={newTicket.priority}
                                            onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="low">🟢 Düşük</option>
                                            <option value="medium">🟡 Orta</option>
                                            <option value="high">🔴 Yüksek</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Konu *</label>
                                        <input
                                            type="text"
                                            value={newTicket.subject}
                                            onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                            placeholder="Örn: Randevu oluşturamıyorum"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Açıklama *</label>
                                        <textarea
                                            value={newTicket.description}
                                            onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                            rows="6"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                            placeholder="Sorununuzu veya önerinizi detaylı bir şekilde açıklayın..."
                                        />
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowNewTicketForm(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        onClick={handleCreateTicket}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Talebi Oluştur
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Ticket Detail Modal */}
                {selectedTicket && (
                    <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSelectedTicket(null)} />
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedTicket.subject}</h2>
                                        <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-mono text-sm text-gray-600 dark:text-gray-400">{selectedTicket.ticketNo}</span>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUSES[selectedTicket.status].color}`}>
                                            {STATUSES[selectedTicket.status].label}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <p className="text-gray-900 dark:text-white">{selectedTicket.description}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            {new Date(selectedTicket.createdAt).toLocaleString('tr-TR')}
                                        </p>
                                    </div>

                                    {selectedTicket.replies.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Yanıtlar</h3>
                                            <div className="space-y-3">
                                                {selectedTicket.replies.map(reply => (
                                                    <div
                                                        key={reply.id}
                                                        className={`p-4 rounded-lg ${reply.role === 'admin'
                                                            ? 'bg-blue-50 dark:bg-blue-900/20'
                                                            : 'bg-gray-50 dark:bg-gray-700'
                                                            }`}
                                                    >
                                                        <div className="flex justify-between mb-2">
                                                            <span className="font-medium text-gray-900 dark:text-white">{reply.author}</span>
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

                                    {selectedTicket.status !== 'closed' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Yanıt Yaz
                                            </label>
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                rows="4"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                                placeholder="Yanıtınızı yazın..."
                                            />
                                            <div className="mt-3 flex justify-end">
                                                <button
                                                    onClick={handleReply}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                >
                                                    Yanıt Gönder
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}
