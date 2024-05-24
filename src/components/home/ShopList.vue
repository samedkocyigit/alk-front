<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

// install Swiper modules

import { getBrandsApi } from '@/services/brand.service'

export default {
  name: 'BrandSlider',
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      mySwiper: null,
      brands: [],
      loading: true,
    }
  },
  methods: {
    async fetchBrands() {
      try {
        const res = await getBrandsApi()
        this.brands = res.data.data
        this.loading = false
      } catch (error) {
        console.log('hata:', error.message)
        this.loading = false
      }
    },
    onSwiper(swiper) {
      this.mySwiper = swiper
    },
  },
  mounted() {
    this.fetchBrands()
  },
}
</script>

<template>
  <div class="w-full">
    <div class="w-full flex p-4 gap-4 relative">
      <Swiper
        style="padding: 0 8px 10px 8px"
        class="w-full pb-2"
        :slides-per-view="'auto'"
        :space-between="10"
        :loop="true"
        :autoplay="{ delay: 3000 }"
        @swiper="onSwiper"
      >
        <SwiperSlide v-for="brand in brands.data" :key="brand._id" style="width: auto" class="w-fit">
          <RouterLink :to="`/brands/${brand._id}`">
            <div class="rounded-xl border-2">
              <img
                v-if="brand.photos && brand.photos.length > 0"
                class="h-[70px] object-cover w-full"
                :src="`/images/brands/${brand.photos[0]}`"
                alt=""
                style="max-height: 100px; max-width: 100%"
              />
            </div>
          </RouterLink>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>
