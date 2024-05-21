<script setup>
import { ref, onBeforeMount, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

import { getBrandsApi } from '@/services/brand.service'
import BrandCard from './BrandCard.vue'

const mySwiper = ref(null)
const brands = ref([])
const loading = ref(true)

async function fetchBrands() {
  try {
    const res = await getBrandsApi()
    brands.value = res.data.data
    loading.value = false
  } catch (error) {
    console.log('hata:', error.message)
    loading.value = false
  }
}

const onSwiper = (swiper) => {
  mySwiper.value = swiper
  console.log('mySwiper', mySwiper.value)
}

onBeforeMount(async () => {
  await fetchBrands()
  // mySwiper ref'i null olmadığından ve autoplay özelliğine sahip olduğundan emin olun
  nextTick(() => {
    if (mySwiper.value && mySwiper.value.autoplay) {
      mySwiper.value.autoplay.start()
    }
  })
})
</script>

<template>
  <div class="w-full">
    <div class="w-full flex p-4 gap-4 relative">
      <swiper
        style="padding: 0 8px 10px 8px"
        class="w-full pb-2"
        :slides-per-view="'auto'"
        :space-between="10"
        :loop="true"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        @Swiper="onSwiper"
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
