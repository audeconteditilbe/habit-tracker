<script setup lang="ts">
import { RestClientSingleton } from '@/clients'
import { accessTokenService, refreshTokenService } from '@/lib/auth'
import router from '@/router'
import { onBeforeMount, ref } from 'vue'

const username = ref<string | undefined>()
const password = ref<string | undefined>()

const handleSubmit = async () => {
  if (username.value?.trim() && password.value) {
    try {
      await RestClientSingleton.registerUser(username.value?.trim(), password.value)
      router.push('/login')
    } catch (error) {
      alert(error)
    }
  }
}

onBeforeMount(() => {
  // TODO: punctually remove access & refresh tokens only
  accessTokenService.clearToken()
  refreshTokenService.clearToken()
})

</script>

<template>
  <h3>Register</h3>
  <form @submit.prevent="handleSubmit">
    <label for="username">Username:</label><br>
    <input type="text" id="username" name="username" v-model="username" />
    
    <br/>
    
    <label for="password">Password:</label><br>
    <input type="password" id="password" name="password" v-model="password" />
    
    <br/>

    <button type="submit">Submit</button>
  </form>
</template>