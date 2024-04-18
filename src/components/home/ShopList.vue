<template>
  <div class="w-full mt-20">
    <div class="w-full flex justify-between">
      <h4 class="text-2xl font-bold">
        <i class="ri-shield-check-fill text-green-500"></i>
        Offical Store
      </h4>
      <h4 class="text-third-100">See All</h4>
    </div>
    <div class="w-full flex p-4 gap-4 relative">
      <swiper
        ref="mySwiper"
        style="padding: 0 8px 10px 8px"
        class="w-full pb-2"
        :slide-prev-view="'auto'"
        :space-between="10"
        :loop="brands.data.length >= 2"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        @swiper="onSwiper"
      >
        <swiper-slide v-for="brand in brands.data" :key="brand._id" style="width: auto" class="w-fit">
          <RouterLink :key="brand._id" :to="`/brands/${brand._id}`">
            <BrandCard :brand="brand" />
          </RouterLink>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const mySwiper = ref(null)

const onSwiper = (swiper) => {
  mySwiper.value = swiper
  console.log('Brands Swiper:', swiper)
}

const brands = ref([])
const loading = ref(true)

async function fetchBrands() {
  if (brands.value.length === 0) {
    try {
      const res = await getBrandsApi()
      // const data = res.data
      // if (!data || !data.data) throw new Error('Gelen veriler istenilen formatta değil')
      brands.value = res.data.data
      console.log('response=>', brands.value)
      console.log('foti', brands.value.data[0])
      loading.value = false
    } catch (error) {
      console.log('hata:', error.message)
      loading.value = false
    }
  }
}

import BrandCard from './BrandCard.vue'
import { getBrandsApi } from '@/services/brand.service'

fetchBrands()
</script>
