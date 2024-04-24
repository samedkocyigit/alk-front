<template>
  <div class="w-full">
    <swiper
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
      <swiper-slide v-for="(item, index) in banners" :key="item.id" class="w-full">
        <img
          class="w-full h-[550px] object-cover rounded-md"
          :src="`./images/campaigns/${getFirstPhotoUrl(item)}`"
          alt=""
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { getCampaignsApi } from '@/services/campaign.service'

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

const getFirstPhotoUrl = (item) => {
  const itemArray = Array.isArray(item) ? item : Reflect.get(item, '[[Target]]')
  return itemArray && itemArray.length > 0 && itemArray[0].photos && itemArray[0].photos.length > 0
    ? itemArray[0].photos[0]
    : ''
}
</script>

<style scoped>
.swiper {
  width: 100%;
}

.swiper-slide {
  width: 100%;
}
</style>
