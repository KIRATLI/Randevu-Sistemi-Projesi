import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      // Login
      login: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
        })
      },

      // Logout
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
        localStorage.removeItem('token')
      },

      // Update user
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }))
      },

      // Check role
      hasRole: (roles) => {
        const { user } = get()
        if (!user) return false
        if (Array.isArray(roles)) {
          return roles.includes(user.role)
        }
        return user.role === roles
      },

      // Set loading
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore


