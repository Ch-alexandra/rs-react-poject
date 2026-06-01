import { QueryClient } from '@tanstack/react-query'

const cacheTtl = Number(import.meta.env.VITE_CACHE_TTL ?? 5 * 60 * 1000)

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: cacheTtl,
      gcTime: cacheTtl * 2,
      retry: 1,
    },
  },
})
