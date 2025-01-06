<script setup lang="ts">
import { accessTokenService, refreshTokenService } from '@/lib/auth';
import router from '@/router';
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const onClick = () => {
  accessTokenService.clearToken()
  refreshTokenService.clearToken()
  userStore.clearUser()
  router.push('/login')
}

</script>

<template>
  <button @click.prevent="onClick">Logout</button>
</template>