<script setup lang="ts">
import Button from 'primevue/button'
import { ref } from 'vue';

const isDark = ref<boolean>(document.documentElement.classList.contains('dark-mode'))

const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark-mode')
  isDark.value = !isDark.value
}
</script>

<template>
  <Button
    :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
    @click="toggleDarkMode()"
    severity="secondary"
    :title="isDark ? 'click to brighten my day :)' : 'bro I got eyes though'"
  />
</template>
