import { createSlice } from '@reduxjs/toolkit'

const COUNTRIES = [
  'Armenia',
  'Belarus',
  'Canada',
  'Cyprus',
  'Denmark',
  'France',
  'Georgia',
  'Hungary',
  'Israel',
  'Italy',
  'Kazakhstan',
  'Kyrgyzstan',
  'Lithuania',
  'Moldova',
  'Montenegro',
  'Poland',
  'Russia',
  'Serbia',
  'South Korea',
  'Spain',
  'Sweden',
  'Switzerland',
  'Thailand',
  'Turkey',
  'Ukraine',
  'United Kingdom',
  'United States',
  'Uzbekistan',
]

interface CountriesState {
  list: string[]
}

const initialState: CountriesState = {
  list: COUNTRIES,
}

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
})

export default countriesSlice.reducer
