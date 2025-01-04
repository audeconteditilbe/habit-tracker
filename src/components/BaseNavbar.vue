<script setup lang="ts">
import router from '@/router';
import Menubar from 'primevue/menubar'
import type { MenuItem } from 'primevue/menuitem'
import { useUserStore } from '@/stores/userStore'
import { computed, onMounted, ref } from 'vue';

type MenuItemWithPath = MenuItem & { path: string }

const userStore = useUserStore()
const loggedIn = ref<boolean | undefined>()

const command: Exclude<MenuItem['command'], undefined> = ({ item: { path }, originalEvent }) => {
  originalEvent.preventDefault()
  if (typeof path === 'string') {
    router.push(path)
  }
}

const items = computed<MenuItemWithPath[]>(() => {
  if (loggedIn.value) {
    return [
      { key: 'home', label: 'Home', command, path: '/' },
      { key: 'logout', label: 'Logout', command, path: '/logout' }
    ]
  }
  return [
    { key: 'home', label: 'Home', command, path: '/' },
    { key: 'login', label: 'Login', command, path: '/login' }
  ]
})

onMounted(() => {
  loggedIn.value = Boolean(userStore.currentUser)
})
</script>

<template>
  <Menubar :model="items" />
</template>

<style lang="css" scoped>

</style>