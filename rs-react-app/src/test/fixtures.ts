import type { Character, CharacterApiItem } from '../types/character'

export const characterFixture = (overrides: Partial<Character> = {}): Character => ({
  id: 1,
  name: 'Rick Sanchez',
  description: 'Human • Alive • Male',
  image: 'https://example.com/rick.png',
  ...overrides,
})

export const characterApiItemFixture = (
  overrides: Partial<CharacterApiItem> = {},
): CharacterApiItem => ({
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://example.com/rick.png',
  ...overrides,
})

export const characterListFixture = (): Character[] => [
  characterFixture(),
  characterFixture({
    id: 2,
    name: 'Morty Smith',
    description: 'Human • Alive • Male',
    image: 'https://example.com/morty.png',
  }),
]