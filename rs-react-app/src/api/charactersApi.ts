import type {
  Character,
  CharacterApiItem,
  CharacterApiResponse,
} from '../types/character'

const BASE_URL = 'https://rickandmortyapi.com/api/character/'

const toCharacter = (item: CharacterApiItem): Character => ({
  id: item.id,
  name: item.name,
  description: `${item.species} • ${item.status} • ${item.gender}`,
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

const fetchWithDelay = async (url: string): Promise<Response> => {
  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 220)
  })

  return fetch(url)
}

export const fetchCharacters = async (term: string): Promise<Character[]> => {
  const trimmedTerm = term.trim()
  const query = new URLSearchParams({ page: '1' })

  if (trimmedTerm) {
    query.set('name', trimmedTerm)
  }

  const response = await fetchWithDelay(`${BASE_URL}?${query.toString()}`)

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  const payload = (await response.json()) as CharacterApiResponse
  return payload.results.map(toCharacter)
}
