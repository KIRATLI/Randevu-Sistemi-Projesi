// src/utils/api.js

// API Base URL - Environment variable'dan al
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Gerçek API çağrısı yapan fonksiyon
const apiFetch = async (endpoint, data = null, method = 'GET') => {
  // KRİTİK: Django için her endpoint'in sonuna '/' eklediğimizden emin oluyoruz
  const cleanEndpoint = endpoint.endsWith('/') ? endpoint : `${endpoint}/`;
  const url = `${API_BASE_URL}${cleanEndpoint}`

  // Token'ı localStorage'dan al
  const token = localStorage.getItem('token')

  // Request options
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  }

  // Token varsa Authorization header'ı ekle
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`
  }

  // GET dışındaki methodlar için body ekle
  if (data && method !== 'GET') {
    options.body = JSON.stringify(data)
  }

  let finalUrl = url;
  // GET istekleri için query parametreleri ekle
  if (data && method === 'GET') {
    const queryParams = new URLSearchParams(data).toString()
    finalUrl = queryParams ? `${url}?${queryParams}` : url
  }

  try {
    const response = await fetch(finalUrl, options)

    // 401 Unauthorized hatası - token geçersiz
    // if (response.status === 401) {
    //   if (!window.location.pathname.includes('/login')) {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('user');
    //     window.location.href = '/login';
    //   }
    //   return { success: false, error: 'Unauthorized' }
    // }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    return {
      success: false,
      error: 'Bağlantı hatası'
    }
  }
}

// Eski fakeFetch fonksiyonunu kaldırın ve apiFetch kullanın
export const api = {
  // Auth
  login: (data) => apiFetch('/auth/login', data, 'POST'),
  register: (data) => apiFetch('/auth/register', data, 'POST'),

  // Academicians
  getAcademicians: () => apiFetch('/academicians'),
  getAcademician: (id) => apiFetch(`/academicians/${id}`),

  // Appointments
  getAppointments: (filters) => apiFetch('/appointments', filters, 'GET'),
  getAppointment: (id) => apiFetch(`/appointments/${id}`),
  createAppointment: (data) => apiFetch('/appointments', data, 'POST'),
  updateAppointment: (id, data) => apiFetch(`/appointments/${id}`, data, 'PUT'),
  approveAppointment: (id) => apiFetch('/appointments/approve', { id }, 'POST'),
  rejectAppointment: (id, reason) => apiFetch('/appointments/reject', { id, reason }, 'POST'),
  cancelAppointment: (id, reason) => apiFetch('/appointments/cancel', { id, reason }, 'POST'),

  // Messages
  getMessages: (userId) => apiFetch('/messages', { userId }, 'GET'),
  getMessageThread: (threadId) => apiFetch('/messages/thread', { threadId }, 'GET'),
  sendMessage: (data) => apiFetch('/messages', data, 'POST'),
  markMessageAsRead: (messageId) => apiFetch('/messages/mark-read', { messageId }, 'POST'),
  deleteMessage: (messageId) => apiFetch('/messages/delete', { messageId }, 'DELETE'),
  getUnreadCount: (userId) => apiFetch('/messages/unread-count', { userId }, 'GET'),

  // Schedule (for academicians)
  getSchedule: (academicianId) => apiFetch('/schedule', { academicianId }, 'GET'),
  updateSchedule: (data) => apiFetch('/schedule', data, 'POST'),
  getAvailableSlots: (date, academicianId) => apiFetch('/schedule/available-slots', { date, academicianId }, 'GET'),
  getAvailableDates: (academicianId, month, year) => apiFetch('/schedule/available-dates', { academicianId, month, year }, 'GET'),

  // Students (for academicians)
  getStudents: () => apiFetch('/students'),
  getStudentDetail: (studentId) => apiFetch('/students/detail', { studentId }, 'GET'),

  // Admin
  getUsers: () => apiFetch('/users'),
  getUserStats: () => apiFetch('/users/stats'),
  createUser: (data) => apiFetch('/users', data, 'POST'),
  updateUser: (userId, data) => apiFetch('/users/update', { userId, ...data }, 'PUT'),
  deleteUser: (userId) => apiFetch('/users/delete', { userId }, 'DELETE'),
  searchUsers: (query) => apiFetch('/users/search', { query }, 'GET'),
  getReports: () => apiFetch('/reports'),
  getAppointmentStats: () => apiFetch('/reports/appointments'),
  getSystemLogs: () => apiFetch('/reports/logs'),
  getAnnouncements: () => apiFetch('/announcements'),
  createAnnouncement: (data) => apiFetch('/announcements/create', data, 'POST'),
  updateAnnouncement: (id, data) => apiFetch('/announcements/update', { id, ...data }, 'PUT'),
  deleteAnnouncement: (id) => apiFetch('/announcements/delete', { id }, 'DELETE'),
  sendBulkMessage: (data) => apiFetch('/messages/bulk', data, 'POST'),

  // Profile
  getProfile: (userId) => apiFetch('/profile', { userId }, 'GET'),
  updateProfile: (userId, data) => apiFetch('/profile', { userId, ...data }, 'PUT'),
  uploadAvatar: (userId, file) => {
    // File upload için FormData kullan
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)

    const token = localStorage.getItem('token')
    const url = `${API_BASE_URL}/profile/avatar`

    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    }).then(res => res.json())
  },
  changePassword: (userId, oldPassword, newPassword) => apiFetch('/profile/change-password', { userId, oldPassword, newPassword }, 'POST'),

  // Notifications
  getNotifications: (userId) => apiFetch('/notifications', { userId }, 'GET'),
  getNotificationUnreadCount: (userId) => apiFetch('/notifications/unread-count', { userId }, 'GET'),
  markNotificationAsRead: (notificationId) => apiFetch('/notifications/mark-read', { notificationId }, 'POST'),
  markAllNotificationsAsRead: (userId) => apiFetch('/notifications/mark-all-read', { userId }, 'POST'),
  deleteNotification: (notificationId) => apiFetch('/notifications/delete', { notificationId }, 'DELETE'),
  getNotificationSettings: (userId) => apiFetch('/notifications/settings', { userId }, 'GET'),
  updateNotificationSettings: (userId, settings) => apiFetch('/notifications/settings', { userId, ...settings }, 'POST'),
}

export default api