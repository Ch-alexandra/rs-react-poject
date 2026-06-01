import { useQuery } from '@tanstack/react-query'
import { fetchCharacterById } from '../api/characterDetailApi'
import type { CharacterDetail } from '../types/character'

export const CHARACTER_DETAIL_QUERY_KEY = (id: number) => ['character', id] as const

export function useCharacterDetailQuery(id: number | undefined) {
  return useQuery<CharacterDetail, Error>({
    queryKey: CHARACTER_DETAIL_QUERY_KEY(id!),
    queryFn: ({ signal }) => fetchCharacterById(id!, signal),
    enabled: id !== undefined,
  })
}
