<script setup lang="ts">
import router from '@/router';
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const onClick = () => {
  localStorage.clear()
  userStore.clearUser()
  router.push('/login')
}

</script>

<template>
  <button @click.prevent="onClick">Logout</button>
</template>