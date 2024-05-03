<!-- <template>
  <div class="flex flex-col w-full items-center">
    <NavBar />

    <div class="mb-auto flex w-full">
      <div class="w-1/6 mt-20">
        <SideBar />
      </div>

      <div ref="mainElement" class="flex flex-col items-center h-[calc(100vh-90px)] overflow-y-auto w-5/6 mt-40">
        <slot></slot>
      </div>
    </div>

    <BottomFooter />
  </div>
</template> -->

<!-- <script setup>
import NavBar from '@/components/layouts/NavBar.vue'
import BottomFooter from '@/components/layouts/BottomFooter.vue'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import SideBar from '@/components/layouts/SideBar.vue'
const route = useRoute()
const mainElement = ref(null)

// route değişikliğini izle ve sayfanın başına kaydır
watch(
  () => route.fullPath,
  () => {
    mainElement.value.scrollTo(0, 0)
  }
)
</script>  -->

<template>
  <div class="flex w-full justify-center">
    <NavBar />

    <div class="mb-auto flex h-[calc(100vh-90px)] justify-center overflow-y-auto w-full mt-[180px]">
      <SideBar />
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import NavBar from '@/components/layouts/NavBar.vue'
import SideBar from '@/components/layouts/SideBar.vue'
import { onBeforeMount } from 'vue'
onBeforeMount(() => {
  console.log('default')
})
</script>
