<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

import { getBrandsApi } from '@/services/brand.service'
import BrandCard from './BrandCard.vue'

const mySwiper = ref(null)
const brands = ref([])
const loading = ref(true)

async function fetchBrands() {
  if (brands.value.length === 0) {
    try {
      const res = await getBrandsApi()
      // const data = res.data
      // if (!data || !data.data) throw new Error('Gelen veriler istenilen formatta değil')
      brands.value = res.data.data
      loading.value = false
    } catch (error) {
      console.log('hata:', error.message)
      loading.value = false
    }
  }
}

const onSwiper = (swiper) => {
  mySwiper.value = swiper
  console.log('Brands Swiper:', swiper)
}

fetchBrands()
</script>

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
      <div
        class="absolute z-10 flex justify-center items-center top-[45%] -right-5 w-[50px] h-[50px] cursor-pointer bg-white gb-shadow rounded-full"
        @click="mySwiper.slideNext()"
      >
        <i class="ri-arrow-right-s-line text-2xl"></i>
      </div>
      <div
        class="absolute z-10 flex justify-center items-center top-[45%] -left-5 w-[50px] h-[50px] cursor-pointer bg-white gb-shadow rounded-full"
        @click="mySwiper.slidePrev()"
      >
        <i class="ri-arrow-left-s-line text-2xl"></i>
      </div>
      <swiper
        style="padding: 0 8px 10px 8px"
        class="w-full pb-2"
        :slides-per-view="'auto'"
        :space-between="10"
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
