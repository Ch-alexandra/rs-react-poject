import type { CharacterApiItem, CharacterDetail } from '../types/character'

const BASE_URL =
  import.meta.env.DEV
    ? '/rickandmorty/api/character/'
    : 'https://rickandmortyapi.com/api/character/'

export const fetchCharacterById = async (
  id: number,
  signal?: AbortSignal,
): Promise<CharacterDetail> => {
  const response = await fetch(`${BASE_URL}${id}`, { signal })

  if (!response.ok) {
    throw new Error('Character not found.')
  }

  const item = (await response.json()) as CharacterApiItem
  return {
    id: item.id,
    name: item.name,
    status: item.status,
    species: item.species,
    type: item.type,
    gender: item.gender,
    origin: item.origin.name,
    location: item.location.name,
    image: item.image,
    episodeCount: item.episode.length,
  }
}
