import { useQuery } from '@tanstack/react-query'
import { fetchCharacters } from '../api/charactersApi'
import type { CharacterListResult } from '../types/character'

export const CHARACTERS_QUERY_KEY = (term: string, page: number) =>
  ['characters', term, page] as const

export function useCharactersQuery(term: string, page: number) {
  return useQuery<CharacterListResult, Error>({
    queryKey: CHARACTERS_QUERY_KEY(term, page),
    queryFn: ({ signal }) => fetchCharacters(term, page, signal),
  })
}
