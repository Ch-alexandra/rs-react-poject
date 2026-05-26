import type { Character, CharacterApiItem, CharacterDetail, CharacterListResult } from '../types/character'

export const characterFixture = (overrides: Partial<Character> = {}): Character => ({
  id: 1,
  name: 'Rick Sanchez',
  description: 'Human, Alive, Male',
  image: 'https://example.com/rick.png',
  ...overrides,
})

export const characterDetailFixture = (overrides: Partial<CharacterDetail> = {}): CharacterDetail => ({
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: 'Earth (C-137)',
  location: 'Citadel of Ricks',
  image: 'https://example.com/rick.png',
  episodeCount: 51,
  ...overrides,
})

export const characterApiItemFixture = (
  overrides: Partial<CharacterApiItem> = {},
): CharacterApiItem => ({
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)' },
  location: { name: 'Citadel of Ricks' },
  image: 'https://example.com/rick.png',
  episode: [],
  ...overrides,
})

export const characterListFixture = (): CharacterListResult => ({
  results: [
    characterFixture(),
    characterFixture({
      id: 2,
      name: 'Morty Smith',
      description: 'Human, Alive, Male',
      image: 'https://example.com/morty.png',
    }),
  ],
  totalPages: 1,
})