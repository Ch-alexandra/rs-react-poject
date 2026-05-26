export interface Character {
  id: number
  name: string
  description: string
  image: string
}

export interface CharacterDetail {
  id: number
  name: string
  status: string
  species: string
  type: string
  gender: string
  origin: string
  location: string
  image: string
  episodeCount: number
}

export interface CharacterApiItem {
  id: number
  name: string
  status: string
  species: string
  type: string
  gender: string
  origin: { name: string }
  location: { name: string }
  image: string
  episode: string[]
}

export interface CharacterApiResponse {
  info: { pages: number }
  results: CharacterApiItem[]
}

export interface CharacterListResult {
  results: Character[]
  totalPages: number
}
