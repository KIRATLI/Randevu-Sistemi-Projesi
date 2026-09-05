import { create } from 'zustand'

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  // Set notifications
  setNotifications: (notifications) => {
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    })
  },

  // Add notification
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1,
    }))
  },

  // Mark as read
  markAsRead: (notificationId) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      }
    })
  },

  // Mark all as read
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
  },

  // Remove notification
  removeNotification: (notificationId) => {
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== notificationId)
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      }
    })
  },

  // Set loading
  setLoading: (loading) => set({ loading }),
}))

export default useNotificationStore


