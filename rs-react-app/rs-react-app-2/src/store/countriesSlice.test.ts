import { describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import countriesReducer from './countriesSlice'

describe('countriesSlice', () => {
  it('has a non-empty countries list in initial state', () => {
    const store = configureStore({ reducer: { countries: countriesReducer } })
    const list = store.getState().countries.list
    expect(list.length).toBeGreaterThan(10)
  })

  it('includes common countries', () => {
    const store = configureStore({ reducer: { countries: countriesReducer } })
    const list = store.getState().countries.list
    expect(list).toContain('France')
    expect(list).toContain('Canada')
    expect(list).toContain('Ukraine')
  })
})
