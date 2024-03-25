<template>
  <div class="w-full mt-20">
    <div class="w-full flex justify-between">
      <h4 class="text-2xl font-bold">
        <i class="ri-shield-check-fill text-green-500"></i>
        Offical Store
      </h4>
      <h4 class="text-third-100">See All</h4>
    </div>
    <div class="w-full flex max-md:grid max-md:grid-cols-2 gap-5 max-md:gap-3 mt-5 flex-wrap">
      <RouterLink
        v-for="item in brands.data"
        :key="item._id"
        class="h-[220px] shadow-d-30 block bg-white rounded-md w-[183px] max-md:w-full"
        to="/"
      >
        <div class="w-full h-[140px] flex justify-center items-center bg-primary-400">
          <img class="w-[70%] object-contain" :src="item.photo[0]" alt="" />
        </div>
        <div class="flex py-3 flex-col items-center">
          <p class="font-medium">{{ item.name }}</p>
          <p class="font-base text-gray-400"><i class="ri-shield-check-fill text-green-500 mr-1"></i>Official store</p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const brands = ref([])
const loading = ref(true)

async function fetchBrands() {
  if (brands.value.length === 0) {
    try {
      const response = await fetch('/api/brands')
      if (!response.ok) {
        throw new Error('Fetch işlemi başarısız')
      }
      const data = await response.json()
      if (!data || !data.data) throw new Error('Gelen veriler istenilen formatta değil')
      brands.value = data.data
      console.log('response=>', brands.value)
      console.log('foti', brands.value.data[0].photo[0])

      loading.value = false
    } catch (error) {
      console.log('hata:', error.message)
      loading.value = false
    }
  }
}

fetchBrands()
</script>
