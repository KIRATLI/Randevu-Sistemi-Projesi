import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAppStore = create(
  persist(
    (set) => ({
      // Theme
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setDarkMode: (darkMode) => set({ darkMode }),

      // Sidebar
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Loading
      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      // Modal states
      modals: {},
      openModal: (modalName) =>
        set((state) => ({
          modals: { ...state.modals, [modalName]: true },
        })),
      closeModal: (modalName) =>
        set((state) => ({
          modals: { ...state.modals, [modalName]: false },
        })),

      // Filters (for lists)
      filters: {},
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      clearFilter: (key) =>
        set((state) => {
          const { [key]: _, ...rest } = state.filters
          return { filters: rest }
        }),
      clearAllFilters: () => set({ filters: {} }),

      // Pagination
      pagination: {},
      setPagination: (key, page) =>
        set((state) => ({
          pagination: { ...state.pagination, [key]: page },
        })),

      // Search queries
      searchQueries: {},
      setSearchQuery: (key, query) =>
        set((state) => ({
          searchQueries: { ...state.searchQueries, [key]: query },
        })),
      clearSearchQuery: (key) =>
        set((state) => {
          const { [key]: _, ...rest } = state.searchQueries
          return { searchQueries: rest }
        }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        sidebarOpen: state.sidebarOpen,
        filters: state.filters,
        pagination: state.pagination,
      }),
    }
  )
)

export default useAppStore


