<script setup lang="ts">
import router from '@/router';
import Menubar from 'primevue/menubar'
import type { MenuItem } from 'primevue/menuitem'
import { useUserStore } from '@/stores/userStore'
import { computed, onMounted, ref } from 'vue';
import DarkModeButton from './DarkModeButton.vue';

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
  <Menubar :model="items">
    <template #start>
      <img alt="Logo" class="logo" src="@/assets/logo-small.svg" width="32" height="32" />
    </template>
    <template #end>
      <DarkModeButton />
    </template>
  </Menubar>
</template>
