import type { Character, CharacterApiItem } from '../types/character'

const BASE_URL =
  import.meta.env.DEV
    ? '/rickandmorty/api/character/'
    : 'https://rickandmortyapi.com/api/character/'

export const fetchCharacterById = async (
  id: number,
  signal?: AbortSignal,
): Promise<Character> => {
  const response = await fetch(`${BASE_URL}${id}`, { signal })

  if (!response.ok) {
    throw new Error('Character not found.')
  }

  const item = (await response.json()) as CharacterApiItem
  return {
    id: item.id,
    name: item.name,
    description: `${item.species}, ${item.status}, ${item.gender}`,
    image: item.image,
  }
}
