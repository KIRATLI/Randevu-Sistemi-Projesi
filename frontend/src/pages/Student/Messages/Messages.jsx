import { useState, useEffect } from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import MessageList from '../../../components/MessageList/MessageList'
import MessageThread from '../../../components/MessageThread/MessageThread'
import ComposeMessage from '../../../components/ComposeMessage/ComposeMessage'
import { api } from '../../../utils/api'

export default function StudentMessages() {
  const currentUser = JSON.parse(localStorage.getItem('user'))
  const currentUserId = currentUser?.id
  const currentUserRole = currentUser?.role

  const [messages, setMessages] = useState([])
  const [selectedThread, setSelectedThread] = useState(null)
  const [threadMessages, setThreadMessages] = useState([])
  const [showCompose, setShowCompose] = useState(false)
  const [academicians, setAcademicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadMessages()
    loadAcademicians()
  }, [])

  const loadMessages = async () => {
    try {
      const response = await api.getMessages(currentUserId)
      if (response.success) {
        setMessages(response.data)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAcademicians = async () => {
    try {
      const response = await api.getAcademicians()
      if (response.success) {
        setAcademicians(response.data)
      }
    } catch (error) {
      console.error('Error loading academicians:', error)
    }
  }

  const handleMessageClick = async (message) => {
    setSelectedThread(message.threadId)
    try {
      const response = await api.getMessageThread(message.threadId)
      if (response.success) {
        setThreadMessages(response.data)
        // Mark as read
        await api.markMessageAsRead(message.id)
        loadMessages()
      }
    } catch (error) {
      console.error('Error loading thread:', error)
    }
  }

  const handleSendReply = async (replyText) => {
    const firstMessage = threadMessages[0]
    const receiverId = firstMessage.senderId === currentUserId 
      ? firstMessage.receiverId 
      : firstMessage.senderId
    const receiverName = firstMessage.senderId === currentUserId 
      ? firstMessage.receiverName 
      : firstMessage.senderName

    const messageData = {
      senderId: currentUserId,
      senderName: 'Ahmet Yılmaz',
      senderRole: currentUserRole,
      receiverId,
      receiverName,
      receiverRole: 'academician',
      subject: `Re: ${firstMessage.subject}`,
      content: replyText,
      threadId: selectedThread,
      replyTo: threadMessages[threadMessages.length - 1].id
    }

    try {
      const response = await api.sendMessage(messageData)
      if (response.success) {
        // Reload thread
        const threadResponse = await api.getMessageThread(selectedThread)
        if (threadResponse.success) {
          setThreadMessages(threadResponse.data)
        }
        loadMessages()
      }
    } catch (error) {
      console.error('Error sending reply:', error)
    }
  }

  const handleSendNewMessage = async (formData) => {
    const receiver = academicians.find(a => a.id === formData.receiverId)
    
    const messageData = {
      senderId: currentUserId,
      senderName: 'Ahmet Yılmaz',
      senderRole: currentUserRole,
      receiverId: formData.receiverId,
      receiverName: receiver.name,
      receiverRole: 'academician',
      subject: formData.subject,
      content: formData.content,
    }

    try {
      const response = await api.sendMessage(messageData)
      if (response.success) {
        setShowCompose(false)
        loadMessages()
        alert('✓ Mesaj gönderildi')
      }
    } catch (error) {
      alert('✗ Bir hata oluştu')
    }
  }

  const filteredMessages = messages.filter(msg => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      msg.subject.toLowerCase().includes(query) ||
      msg.content.toLowerCase().includes(query) ||
      msg.senderName.toLowerCase().includes(query) ||
      msg.receiverName.toLowerCase().includes(query)
    )
  })

  const unreadCount = messages.filter(msg => !msg.read && msg.receiverId === currentUserId).length

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
        {selectedThread ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow min-h-[600px] flex flex-col">
            <MessageThread
              messages={threadMessages}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              onSendReply={handleSendReply}
              onBack={() => setSelectedThread(null)}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  💬 Mesajlar
                </h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {unreadCount} okunmamış mesaj
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowCompose(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md hover:shadow-lg font-medium"
              >
                ✉️ Yeni Mesaj
              </button>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mesajlarda ara..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Message List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <MessageList
                messages={filteredMessages}
                onMessageClick={handleMessageClick}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
              />
            </div>
          </>
        )}

        {/* Compose Modal */}
        {showCompose && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCompose(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <ComposeMessage
                onSend={handleSendNewMessage}
                onCancel={() => setShowCompose(false)}
                recipients={academicians}
                currentUserRole={currentUserRole}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

