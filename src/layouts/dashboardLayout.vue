<template>
  <div class="flex flex-col w-full justify-center">
    <NavBar />
    <HeaderBottom />
    <div class="flex flex-row w-full justify-center">
      <SideBar />
      <div class="mb-auto overflow-y-auto w-full">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '@/components/layouts/NavBar.vue'
import SideBar from '@/components/layouts/SideBar.vue'
import HeaderBottom from '@/components/layouts/HeaderBottom.vue'
import { onBeforeMount } from 'vue'
onBeforeMount(() => {
  console.log('default')
})
</script>
