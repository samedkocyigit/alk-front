<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

import { getCampaignsApi } from '@/services/campaign.service'
import BannerCard from './BannerCard.vue'

const mySwiper = ref(null)
const banners = ref([])
const loading = ref(true)

async function fetchBanner() {
  if (banners.value.length === 0) {
    try {
      const response = await getCampaignsApi()
      if (response.status !== 200) {
        throw new Error('Fetch işlemi başarısız')
      }
      banners.value = response.data.data
      console.log('banneeeerrs->', banners.value)
    } catch (err) {
      console.error('Hata', err.message)
    } finally {
      loading.value = false
    }
  }
}

const onSwiper = (swiper) => {
  mySwiper.value = swiper
  console.log('Slider Swiper:', swiper)
}

fetchBanner()
</script>

<template>
  <div class="w-full">
    <swiper
      ref="mySwiper"
      style="padding: 0 8px 10px 8px"
      class="w-full pb-2"
      :slides-per-view="1"
      :space-between="10"
      :loop="true"
      :autoplay="{
        delay: 2500,
      }"
      @swiper="onSwiper"
    >
      <swiper-slide v-for="campaign in banners.data" :key="campaign._id" style="width: auto" class="w-full">
        <RouterLink :key="campaign._id" to="/">
          <BannerCard :campaign="campaign" />
        </RouterLink>
      </swiper-slide>
    </swiper>
  </div>
</template>
