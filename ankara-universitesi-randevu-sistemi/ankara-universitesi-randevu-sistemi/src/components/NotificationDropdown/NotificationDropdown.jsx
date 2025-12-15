import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../utils/api'
import NotificationItem from '../NotificationItem/NotificationItem'

export default function NotificationDropdown({ isOpen, onClose, userId = 1 }) {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all' or 'unread'

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen, userId])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const response = await api.getNotifications()
      if (response.success) {
        setNotifications(response.data)
      }
    } catch (error) {
      console.error('Bildirimler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      handleMarkRead(notification.id)
    }

    // Navigate if has action URL
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
      onClose()
    }
  }

  const handleMarkRead = async (notificationId) => {
    try {
      const response = await api.markNotificationAsRead(notificationId)
      if (response.success) {
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ))
      }
    } catch (error) {
      console.error('Bildirim güncellenemedi:', error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      const response = await api.markAllNotificationsAsRead(userId)
      if (response.success) {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
      }
    } catch (error) {
      console.error('Bildirimler güncellenemedi:', error)
    }
  }

  const handleDelete = async (notificationId) => {
    try {
      const response = await api.deleteNotification(notificationId)
      if (response.success) {
        setNotifications(notifications.filter(n => n.id !== notificationId))
      }
    } catch (error) {
      console.error('Bildirim silinemedi:', error)
    }
  }

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isOpen) return null

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2">
            🔔 Bildirimler
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {unreadCount} yeni
              </span>
            )}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 rounded-lg p-1 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Tümü ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 text-xs font-medium rounded transition ${
              filter === 'unread'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Okunmamış ({unreadCount})
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Tümünü okundu işaretle
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 px-4">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'unread' ? 'Okunmamış bildirim yok' : 'Henüz bildirim yok'}
            </p>
          </div>
        ) : (
          <div>
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 text-center">
          <button
            onClick={() => {
              // TODO: Navigate to notifications page if exists
              onClose()
            }}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Tüm bildirimleri görüntüle
          </button>
        </div>
      )}
    </div>
  )
}
