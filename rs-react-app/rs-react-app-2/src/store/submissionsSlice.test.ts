import { describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import submissionsReducer, {
  addSubmission,
  clearNewFlag,
} from './submissionsSlice'

function makeStore() {
  return configureStore({ reducer: { submissions: submissionsReducer } })
}

const basePayload = {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com',
  gender: 'female',
  password: 'Pass123!',
  country: 'France',
  imageBase64: 'data:image/png;base64,abc',
}

describe('submissionsSlice', () => {
  it('initial state has empty items array', () => {
    const store = makeStore()
    expect(store.getState().submissions.items).toEqual([])
  })

  it('addSubmission adds item with id, isNew=true and submittedAt', () => {
    const store = makeStore()
    store.dispatch(addSubmission(basePayload))
    const items = store.getState().submissions.items
    expect(items).toHaveLength(1)
    expect(items[0].name).toBe('Alice')
    expect(items[0].isNew).toBe(true)
    expect(items[0].id).toBeTruthy()
    expect(items[0].submittedAt).toBeGreaterThan(0)
  })

  it('addSubmission prepends new item (latest first)', () => {
    const store = makeStore()
    store.dispatch(addSubmission({ ...basePayload, name: 'Alice' }))
    store.dispatch(addSubmission({ ...basePayload, name: 'Bob' }))
    const items = store.getState().submissions.items
    expect(items[0].name).toBe('Bob')
    expect(items[1].name).toBe('Alice')
  })

  it('clearNewFlag sets isNew to false for matching id', () => {
    const store = makeStore()
    store.dispatch(addSubmission(basePayload))
    const id = store.getState().submissions.items[0].id
    store.dispatch(clearNewFlag(id))
    expect(store.getState().submissions.items[0].isNew).toBe(false)
  })

  it('clearNewFlag does nothing for non-existent id', () => {
    const store = makeStore()
    store.dispatch(addSubmission(basePayload))
    store.dispatch(clearNewFlag('nonexistent-id'))
    expect(store.getState().submissions.items[0].isNew).toBe(true)
  })

  it('stores all submissions (history)', () => {
    const store = makeStore()
    store.dispatch(addSubmission(basePayload))
    store.dispatch(addSubmission(basePayload))
    store.dispatch(addSubmission(basePayload))
    expect(store.getState().submissions.items).toHaveLength(3)
  })
})
