<script setup lang="ts">
import { RouterView } from 'vue-router'
import BaseNavbar from '@/components/BaseNavbar.vue'
</script>

<template>
  <header>
    <BaseNavbar />
  </header>

  <RouterView />
</template>

<style lang="css" scoped>
header {
  margin-bottom: var(--p-margin-l);
}
</style>