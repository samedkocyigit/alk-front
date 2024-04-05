<template>
  <div v-if="!authStore.isLoggedIn">
    <slot></slot>
  </div>
</template>
<script setup>
import { AuthStore } from '@/stores/auth.store'
const authStore = AuthStore.value
</script>
