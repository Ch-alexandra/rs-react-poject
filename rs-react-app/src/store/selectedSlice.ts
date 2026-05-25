import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Character } from '../types/character'

interface SelectedState {
  items: Character[]
}

const initialState: SelectedState = {
  items: [],
}

const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    toggleItem(state, action: PayloadAction<Character>) {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) {
        state.items.splice(index, 1)
      } else {
        state.items.push(action.payload)
      }
    },
    unselectAll(state) {
      state.items = []
    },
  },
})

export const { toggleItem, unselectAll } = selectedSlice.actions
export default selectedSlice.reducer
