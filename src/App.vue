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