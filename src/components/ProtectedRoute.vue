<script setup lang="ts">
import {RestClientSingleton} from '@/clients'
import { accessTokenService, refreshTokenService } from '@/lib/auth'
import { useUserStore } from '@/stores/userStore'
import { jwtDecode } from 'jwt-decode'
import { onBeforeMount, ref } from 'vue'

const userStore = useUserStore()

const isAuthorized = ref<boolean | undefined>(undefined)

const auth = async () => {
  const token = accessTokenService.getToken()
  
  if (!token) {
    isAuthorized.value = false
    return
  }
  
  // TODO set timeout to refresh token automatically after expiration
  const decoded = jwtDecode(token)
  const tokenExpiration = decoded.exp
  const now = Date.now() / 1000

  if (!tokenExpiration || tokenExpiration < now) {
    await refreshToken()
  } else {
    isAuthorized.value = true
  }
}

const refreshToken = async () => {
  const refreshToken = refreshTokenService.getToken()
  if (!refreshToken) {
    console.warn('unable to find refresh token in local storage')
    isAuthorized.value = false
    return
  }
  try {
    const res = await RestClientSingleton.refreshToken(refreshToken)
    accessTokenService.setToken(res.access)
    isAuthorized.value = true
  } catch (error) {
    console.error('Error refreshing token', error)
    isAuthorized.value = false
  }
}

onBeforeMount(() => {
  auth()
  .catch(() => isAuthorized.value = false)
  .finally(async () => {
    if (isAuthorized.value) {
      // fetch user info if the user is authorized
      await userStore.fetchCurrentUser()
    }
  })
})

</script>

<template>
  <div v-if="isAuthorized === undefined">Loading...</div>
  <slot v-else-if="isAuthorized"></slot>
  <div v-else>
    <router-link :to="'/login'" replace>Login</router-link>
    or
    <router-link :to="'/register'" replace>Register</router-link>
  </div>
</template>