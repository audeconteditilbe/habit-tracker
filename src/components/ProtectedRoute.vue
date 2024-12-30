<script setup lang="ts">

import { jwtDecode } from 'jwt-decode'
import api, { ACCESS_TOKEN, REFRESH_TOKEN } from '../clients/api'
import { onBeforeMount, ref } from 'vue'

const isAuthorized = ref<boolean | undefined>(undefined)

const auth = async () => {
  const token = localStorage.getItem(ACCESS_TOKEN)
  
  if (!token) {
    isAuthorized.value = false
    return
  }
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
  const refreshToken = localStorage.getItem(REFRESH_TOKEN)
  try {
    const res = await api.post("/api/token/refresh/", { refresh: refreshToken })
    
    if (res.status === 200) {
      localStorage.setItem(ACCESS_TOKEN, res.data.access)
      isAuthorized.value = true
    } else {
      isAuthorized.value = false
    }

  } catch (error) {
    console.log(error)
    isAuthorized.value = false
  }
}

onBeforeMount(() => {
  auth().catch(() => isAuthorized.value = false)
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