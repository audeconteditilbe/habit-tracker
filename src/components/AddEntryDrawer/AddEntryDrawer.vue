<script setup lang="ts">
import Drawer from 'primevue/drawer';
import EntryForm from './EntryForm.vue';
import type { Props } from './types';

defineProps<Props>()

</script>

<template>
  <Drawer
    :visible="visible"
    @update:visible="onUpdateVisible"
    header="New entry"
    position="right"
  >
    <EntryForm :initialValues="initialValues" :habitId="habitId" @submit="onSubmit"/>
  </Drawer>
</template>
