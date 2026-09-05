import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { showSuccess, showError } from '../utils/toast'

// Generic query hook
export const useApiQuery = (key, queryFn, options = {}) => {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn,
    ...options,
  })
}

// Generic mutation hook
export const useApiMutation = (mutationFn, options = {}) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (options.successMessage) {
        showSuccess(options.successMessage)
      }
      if (options.invalidateKeys) {
        options.invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] })
        })
      }
      options.onSuccess?.(data)
    },
    onError: (error) => {
      const message = error.response?.data?.message || options.errorMessage || 'Bir hata oluştu'
      showError(message)
      options.onError?.(error)
    },
  })
}

// Specific API hooks

// Appointments
export const useAppointments = () => {
  return useApiQuery('appointments', api.getAppointments)
}

export const useCreateAppointment = () => {
  return useApiMutation(api.createAppointment, {
    successMessage: 'Randevu oluşturuldu',
    errorMessage: 'Randevu oluşturulamadı',
    invalidateKeys: ['appointments'],
  })
}

export const useApproveAppointment = () => {
  return useApiMutation(api.approveAppointment, {
    successMessage: 'Randevu onaylandı',
    invalidateKeys: ['appointments'],
  })
}

export const useRejectAppointment = () => {
  return useApiMutation(api.rejectAppointment, {
    successMessage: 'Randevu reddedildi',
    invalidateKeys: ['appointments'],
  })
}

export const useCancelAppointment = () => {
  return useApiMutation(api.cancelAppointment, {
    successMessage: 'Randevu iptal edildi',
    invalidateKeys: ['appointments'],
  })
}

// Messages
export const useMessages = () => {
  return useApiQuery('messages', api.getMessages)
}

export const useSendMessage = () => {
  return useApiMutation(api.sendMessage, {
    successMessage: 'Mesaj gönderildi',
    invalidateKeys: ['messages'],
  })
}

// Notifications
export const useNotifications = (userId) => {
  return useApiQuery(['notifications', userId], () => api.getNotifications(userId))
}

export const useMarkNotificationAsRead = () => {
  return useApiMutation(api.markNotificationAsRead, {
    invalidateKeys: ['notifications'],
  })
}

// Users (Admin)
export const useUsers = () => {
  return useApiQuery('users', api.getUsers)
}

export const useCreateUser = () => {
  return useApiMutation(api.createUser, {
    successMessage: 'Kullanıcı oluşturuldu',
    invalidateKeys: ['users'],
  })
}

export const useUpdateUser = () => {
  return useApiMutation(
    ({ userId, data }) => api.updateUser(userId, data),
    {
      successMessage: 'Kullanıcı güncellendi',
      invalidateKeys: ['users'],
    }
  )
}

export const useDeleteUser = () => {
  return useApiMutation(api.deleteUser, {
    successMessage: 'Kullanıcı silindi',
    invalidateKeys: ['users'],
  })
}

// Profile
export const useProfile = (userId) => {
  return useApiQuery(['profile', userId], () => api.getProfile(userId))
}

export const useUpdateProfile = () => {
  return useApiMutation(api.updateProfile, {
    successMessage: 'Profil güncellendi',
    invalidateKeys: ['profile'],
  })
}

// Academicians
export const useAcademicians = () => {
  return useApiQuery('academicians', api.getAcademicians)
}

// Students
export const useStudents = () => {
  return useApiQuery('students', api.getStudents)
}


