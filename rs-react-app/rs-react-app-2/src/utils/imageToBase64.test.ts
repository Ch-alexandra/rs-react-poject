import { describe, it, expect, vi, afterEach } from 'vitest'
import { imageToBase64 } from './imageToBase64'

describe('imageToBase64', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('resolves with base64 data URL from FileReader', async () => {
    const mockResult = 'data:image/png;base64,abc123'
    const mockReadAsDataURL = vi.fn()

    class MockFileReader {
      result = mockResult
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      readAsDataURL = mockReadAsDataURL.mockImplementation(() => {
        setTimeout(() => this.onload?.(), 0)
      })
    }

    vi.stubGlobal('FileReader', MockFileReader)

    const file = new File(['content'], 'test.png', { type: 'image/png' })
    const result = await imageToBase64(file)
    expect(result).toBe(mockResult)
  })

  it('rejects when FileReader errors', async () => {
    const mockReadAsDataURL = vi.fn()

    class MockFileReader {
      result = null
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      readAsDataURL = mockReadAsDataURL.mockImplementation(() => {
        setTimeout(() => this.onerror?.(), 0)
      })
    }

    vi.stubGlobal('FileReader', MockFileReader)

    const file = new File(['content'], 'test.png', { type: 'image/png' })
    await expect(imageToBase64(file)).rejects.toThrow('Failed to read file')
  })
})
