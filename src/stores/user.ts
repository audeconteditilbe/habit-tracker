import { RestClientSingleton } from '@/clients';
import { defineStore } from 'pinia'

export type User = { id: string; username: string; email?: string }

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as null | User,
  }),
  actions: {
    async getUser() {
      if (this.currentUser) {
        return this.currentUser
      }

      try {
        this.currentUser = await RestClientSingleton.whoAmI()
      } catch (error) {
        console.error('Failed to fetch user:', error)
        this.currentUser = null
      }

      return this.currentUser
    },
    clearUser() {
      this.currentUser = null
    },
  },
})