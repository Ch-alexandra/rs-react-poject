export interface Character {
  id: number
  name: string
  description: string
  image: string
}

export interface CharacterApiItem {
  id: number
  name: string
  status: string
  species: string
  gender: string
  image: string
}

export interface CharacterApiResponse {
  results: CharacterApiItem[]
}
