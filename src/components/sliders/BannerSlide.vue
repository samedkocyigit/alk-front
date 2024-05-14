<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

import { getSlidersApi } from '@/services/slider.service'
import LazyImg from '../commons/atoms/LazyImg.vue'

const mySwiper = ref(null)
const banners = ref([])
const loading = ref(true)
const filteredImages = ref([])
const selectedSliderType = ref('Kampanyalar')

const filterImagesBySliderType = () => {
  const selectedSlider = banners.value.data.find((slider) => slider.name === selectedSliderType.value)
  filteredImages.value = selectedSlider ? selectedSlider.photos : []
}

async function fetchBanner() {
  try {
    const response = await getSlidersApi()
    if (response.status !== 200) {
      throw new Error('Fetch işlemi başarısız')
    }
    banners.value = response.data.data
    filterImagesBySliderType() // Burada filtreleme fonksiyonunu çağırıyoruz
  } catch (err) {
    console.error('Hata', err.message)
  } finally {
    loading.value = false
  }
}

const onSwiper = (swiper) => {
  mySwiper.value = swiper
}

fetchBanner()

// Butona tıklandığında filtreleme işlevini çağır
const selectSlider = (sliderName) => {
  selectedSliderType.value = sliderName
  filterImagesBySliderType()
}

const showImage = (index) => {
  // Swiper nesnesini kontrol edin
  if (mySwiper.value) {
    // Aktif slaytın index değerini alın
    const currentIndex = mySwiper.value.activeIndex

    // Hedef slaytın index değerini belirleyin
    const targetIndex = index

    // Hedef slayta geçiş yapın
    if (targetIndex > currentIndex) {
      mySwiper.value.slideNext()
    } else if (targetIndex < currentIndex) {
      mySwiper.value.slidePrev()
    }
  } else {
    console.error('Swiper nesnesi henüz yüklenmedi.')
  }
}
</script>

<template>
  <div class="w-full relative z-[1]">
    <!-- Kategorilere göre filtreleme butonları -->
    <div class="absolute top-0 left-0 w-full flex justify-center space-x-4 p-2 z-[3]">
      <button
        class="btn"
        v-for="slider in banners.data"
        :key="slider._id"
        style="width: auto"
        :class="{ selected: selectedSliderType === slider.name }"
        @click="selectSlider(slider.name)"
      >
        {{ slider.name }}
      </button>
    </div>
    <swiper
      ref="mySwiper"
      style="padding: 0 0px 0px 0px"
      class="w-full z-3"
      :slides-per-view="1"
      :space-between="0"
      :loop="true"
      :autoplay="{ delay: 2500 }"
      @swiper="onSwiper"
    >
      <swiper-slide v-for="(image, index) in filteredImages" :key="index" class="w-full">
        <LazyImg :src="`../../../public/images/campaigns/${image}`" alt="Campaign Image" class-style="w-full" />
      </swiper-slide>
    </swiper>
    <div class="absolute bottom-0 left-0 w-full flex justify-center space-x-4 p-2 z-[3]">
      <img
        v-for="(image, index) in filteredImages"
        :key="index"
        :src="`../../../public/images/campaigns/${image}`"
        class="thumb"
        @click="showImage(index)"
      />
    </div>
  </div>
</template>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  background-color: rgb(42, 41, 59, 0.7);
  border: 1px solid transparent;
  border-radius: 9999px; /* Yeterince büyük bir sayı seçerek bir çember oluşturabilirsiniz */
  transition: all 0.3s ease;
  color: white;
}

.btn:hover {
  border-color: #f90; /* Butona hover edildiğinde çizgi rengini değiştirin */
}
.selected {
  background-color: white;
  color: black;
}
.thumb {
  width: 90px;
  height: 50px;
  object-fit: cover;
  border-radius: 0.5rem;
  cursor: pointer;
  border: 2px solid;
  border-color: white;
}
</style>
