import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Default to true while checking auth

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
}))

export default useAuthStore
