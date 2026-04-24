import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on auth errors — the axios interceptor handles token refresh
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false
        }
        // Retry other errors up to 2 times
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false, // Never auto-retry mutations
    },
  },
})
