import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

process.on('unhandledRejection', (reason) => {
  if (reason instanceof TypeError && reason.message.includes('AbortSignal')) return
  throw reason
})