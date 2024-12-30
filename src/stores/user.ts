import { defineStore } from 'pinia'
import api from '@/clients/api'

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
        const response = await api.get('/api/whoami/')
        this.currentUser = response.data
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