import { create } from 'zustand'
import type { Character } from '../types/character'

interface SelectionState {
  selectedItems: Character[]
  toggleItem: (item: Character) => void
  unselectAll: () => void
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedItems: [],

  toggleItem: (item: Character) => {
    const { selectedItems } = get()
    const exists = selectedItems.some((s) => s.id === item.id)
    set({
      selectedItems: exists
        ? selectedItems.filter((s) => s.id !== item.id)
        : [...selectedItems, item],
    })
  },

  unselectAll: () => set({ selectedItems: [] }),
}))
