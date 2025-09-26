import { create } from 'zustand'

interface FileSearchState {
  searchQuery: string
  setSearchQuery: (query: string) => void
  clearSearch: () => void
}

export const useFileSearchStore = create<FileSearchState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: '' }),
}))