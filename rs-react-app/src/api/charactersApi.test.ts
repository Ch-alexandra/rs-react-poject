import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchCharacters } from './charactersApi'
import { characterApiItemFixture } from '../test/fixtures'

describe('fetchCharacters', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('requests characters with a trimmed search term and maps the response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          info: { pages: 3 },
          results: [characterApiItemFixture()],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    )

    vi.stubGlobal('fetch', fetchMock)

    const promise = fetchCharacters('  Rick  ')
    await vi.advanceTimersByTimeAsync(220)

    await expect(promise).resolves.toEqual({
      results: [
        {
          id: 1,
          name: 'Rick Sanchez',
          description: 'Human, Alive, Male',
          image: 'https://example.com/rick.png',
        },
      ],
      totalPages: 3,
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/?page=1&name=Rick',
    )
  })

  it('requests the first page without a name filter when the search term is empty', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ info: { pages: 1 }, results: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    const promise = fetchCharacters('   ')
    await vi.advanceTimersByTimeAsync(220)
    await promise

    expect(fetchMock).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/?page=1')
  })

  it('throws the API error message when the request fails with JSON details', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: 'Character not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    const expectation = expect(fetchCharacters('Birdperson')).rejects.toThrow('Character not found')
    await vi.advanceTimersByTimeAsync(220)

    await expectation
  })

  it('falls back to a default error when the error body cannot be parsed', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('not json', {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    const expectation = expect(fetchCharacters('Summer')).rejects.toThrow(
      'Unable to load items right now. Please try again.',
    )
    await vi.advanceTimersByTimeAsync(220)

    await expectation
  })
})