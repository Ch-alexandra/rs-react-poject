import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ReactNode } from 'react'
import { useCharacterDetailQuery } from './useCharacterDetailQuery'
import { fetchCharacterById } from '../api/characterDetailApi'
import { characterDetailFixture } from '../test/fixtures'

vi.mock('../api/characterDetailApi', () => ({
  fetchCharacterById: vi.fn(),
}))

const fetchMock = vi.mocked(fetchCharacterById)

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

describe('useCharacterDetailQuery', () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it('returns data on successful fetch', async () => {
    fetchMock.mockResolvedValue(characterDetailFixture())

    const { result } = renderHook(() => useCharacterDetailQuery(1), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.name).toBe('Rick Sanchez')
    expect(fetchMock).toHaveBeenCalledWith(1, expect.any(AbortSignal))
  })

  it('shows loading state while fetching', () => {
    fetchMock.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useCharacterDetailQuery(1), { wrapper: makeWrapper() })

    expect(result.current.isFetching).toBe(true)
  })

  it('returns error state when fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('Character not found.'))

    const { result } = renderHook(() => useCharacterDetailQuery(999), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error?.message).toBe('Character not found.')
  })

  it('does not fetch when id is undefined', () => {
    const { result } = renderHook(() => useCharacterDetailQuery(undefined), {
      wrapper: makeWrapper(),
    })

    expect(result.current.isFetching).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('caches data and does not refetch for the same id', async () => {
    fetchMock.mockResolvedValue(characterDetailFixture())

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: 5 * 60 * 1000 } },
    })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result: r1 } = renderHook(() => useCharacterDetailQuery(1), { wrapper })
    await waitFor(() => expect(r1.current.isSuccess).toBe(true))
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const { result: r2 } = renderHook(() => useCharacterDetailQuery(1), { wrapper })
    await waitFor(() => expect(r2.current.isSuccess).toBe(true))
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
