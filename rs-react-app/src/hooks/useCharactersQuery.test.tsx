import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ReactNode } from 'react'
import { useCharactersQuery } from './useCharactersQuery'
import { fetchCharacters } from '../api/charactersApi'
import { characterListFixture } from '../test/fixtures'

vi.mock('../api/charactersApi', () => ({
  fetchCharacters: vi.fn(),
}))

const fetchMock = vi.mocked(fetchCharacters)

const makeWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 5 * 60 * 1000 } },
  })
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = 'QueryClientWrapper'
  return Wrapper
}

describe('useCharactersQuery', () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it('returns data on successful fetch', async () => {
    fetchMock.mockResolvedValue(characterListFixture())

    const { result } = renderHook(() => useCharactersQuery('', 1), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.results).toHaveLength(2)
    expect(fetchMock).toHaveBeenCalledWith('', 1, expect.any(AbortSignal))
  })

  it('shows loading state while fetching', () => {
    fetchMock.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useCharactersQuery('', 1), { wrapper: makeWrapper() })

    expect(result.current.isFetching).toBe(true)
  })

  it('returns error state when fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('API error'))

    const { result } = renderHook(() => useCharactersQuery('', 1), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error?.message).toBe('API error')
  })

  it('uses cached data and does not refetch for the same query key', async () => {
    fetchMock.mockResolvedValue(characterListFixture())

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: 5 * 60 * 1000 } },
    })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result: r1 } = renderHook(() => useCharactersQuery('', 1), { wrapper })
    await waitFor(() => expect(r1.current.isSuccess).toBe(true))
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const { result: r2 } = renderHook(() => useCharactersQuery('', 1), { wrapper })
    await waitFor(() => expect(r2.current.isSuccess).toBe(true))
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
