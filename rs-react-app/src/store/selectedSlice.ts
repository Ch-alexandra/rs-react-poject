import { create } from 'zustand'
import type { Character } from '../types/character'

interface SelectedState {
  items: Character[]
  toggleItem: (item: Character) => void
  unselectAll: () => void
}

export const useSelectedStore = create<SelectedState>((set) => ({
  items: [],
  toggleItem: (item) =>
    set((state) => {
      const exists = state.items.some((i) => i.id === item.id)
      return {
        items: exists ? state.items.filter((i) => i.id !== item.id) : [...state.items, item],
      }
    }),
  unselectAll: () => set({ items: [] }),
}))
