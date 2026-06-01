import type {
  Character,
  CharacterApiItem,
  CharacterApiResponse,
  CharacterListResult,
} from '../types/character'

const BASE_URL =
  import.meta.env.DEV
    ? '/rickandmorty/api/character/'
    : 'https://rickandmortyapi.com/api/character/'

const toCharacter = (item: CharacterApiItem): Character => ({
  id: item.id,
  name: item.name,
  description: `${item.species}, ${item.status}, ${item.gender}`,
  image: item.image,
})

const readErrorMessage = async (response: Response): Promise<string> => {
  const defaultMessage = 'Unable to load items right now. Please try again.'

  try {
    const payload = (await response.json()) as { error?: string }
    return payload.error ?? defaultMessage
  } catch {
    return defaultMessage
  }
}

const fetchWithDelay = async (url: string, signal?: AbortSignal): Promise<Response> => {
  await new Promise<void>((resolve, reject) => {
    const id = setTimeout(() => resolve(), 220)
    signal?.addEventListener('abort', () => {
      clearTimeout(id)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })

  return fetch(url, { signal })
}

export const fetchCharacters = async (
  term: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<CharacterListResult> => {
  const trimmedTerm = term.trim()
  const query = new URLSearchParams({ page: String(page) })

  if (trimmedTerm) {
    query.set('name', trimmedTerm)
  }

  const response = await fetchWithDelay(`${BASE_URL}?${query.toString()}`, signal)

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  const payload = (await response.json()) as CharacterApiResponse
  return {
    results: payload.results.map(toCharacter),
    totalPages: payload.info.pages,
  }
}
