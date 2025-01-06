import { RestClientSingleton } from '@/clients'
import type { User } from '@api/types';
import { defineStore } from 'pinia'

type UserStore = {
  user: User | null
  isLoading: boolean
  error: string | null
}

type Actions = {
  fetchCurrentUser: () => Promise<void>
  clearUser: () => void
}

export const useUserStore = defineStore<string, UserStore, Record<string, never>, Actions>('user', {
  state: () => ({
    user: null,
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchCurrentUser() {
      this.isLoading = true
      this.error = null
      try {
        this.user = await RestClientSingleton.whoAmI()
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch user data'
      } finally {
        this.isLoading = false
      }
    },
    clearUser() {
      this.user = null
    },
  },
})