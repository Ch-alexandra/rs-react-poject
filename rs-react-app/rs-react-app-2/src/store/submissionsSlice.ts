import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface FormSubmission {
  id: string
  name: string
  age: number
  email: string
  gender: string
  password: string
  country: string
  imageBase64: string
  isNew: boolean
  submittedAt: number
}

interface SubmissionsState {
  items: FormSubmission[]
}

const initialState: SubmissionsState = {
  items: [],
}

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    addSubmission(state, action: PayloadAction<Omit<FormSubmission, 'id' | 'isNew' | 'submittedAt'>>) {
      state.items.unshift({
        ...action.payload,
        id: crypto.randomUUID(),
        isNew: true,
        submittedAt: Date.now(),
      })
    },
    clearNewFlag(state, action: PayloadAction<string>) {
      const item = state.items.find((s) => s.id === action.payload)
      if (item) item.isNew = false
    },
  },
})

export const { addSubmission, clearNewFlag } = submissionsSlice.actions
export default submissionsSlice.reducer
