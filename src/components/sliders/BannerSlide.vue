<template>
  <div class="w-full relative z-[1]">
    <div class="absolute top-0 left-0 w-full flex justify-center space-x-4 p-2 z-[3]">
      <button
        class="btn"
        v-for="slider in banners.data"
        :key="slider._id"
        :class="{ selected: selectedSliderType === slider.name }"
        @click="selectSlider(slider.name)"
      >
        {{ slider.name }}
      </button>
    </div>
    <Swiper
      ref="mySwiper"
      style="padding: 0 0px 0px 0px"
      class="w-full z-3"
      :slides-per-view="1"
      :space-between="0"
      :loop="true"
      :autoplay="{ delay: 2500 }"
      @swiper="onSwiper"
    >
      <SwiperSlide v-for="(image, index) in filteredImages" :key="index" class="w-full">
        <img :src="`/images/campaigns/${image.url}`" alt="Campaign Image" class="w-full" />
      </SwiperSlide>
    </Swiper>
    <div
      v-if="filteredImages.length > 1"
      class="absolute bottom-0 left-0 w-full flex justify-center items-center space-x-4 p-2 z-[3]"
    >
      <div class="arrow-left" @click="slideToPrev">
        <i class="ri-arrow-left-s-line" style="font-size: 40px; color: white"></i>
      </div>
      <img
        v-for="(image, index) in filteredImages"
        :key="index"
        :src="`/images/campaigns/${image.thumbNail}`"
        :class="{ thumb: true, selected: index === selectedIndex }"
        @mouseover="showImage(index)"
      />
      <div class="arrow-right" @click="slideToNext">
        <i class="ri-arrow-right-s-line" style="font-size: 40px; color: white"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { getSlidersApi } from '@/services/slider.service'

export default {
  name: 'BannerSlider',
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      mySwiper: null,
      banners: [],
      loading: true,
      filteredImages: [],
      selectedSliderType: 'Kampanyalar',
      selectedIndex: 0,
      ignoreNextSlideChange: false, // Swiper olayını tetiklememek için bayrak
    }
  },
  methods: {
    async fetchBanner() {
      try {
        const response = await getSlidersApi()
        if (response.status !== 200) {
          throw new Error('Fetch işlemi başarısız')
        }
        this.banners = response.data.data
        this.filterImagesBySliderType()
      } catch (err) {
        console.error('Hata', err.message)
      } finally {
        this.loading = false
      }
    },
    filterImagesBySliderType() {
      const selectedSlider = this.banners.data.find((slider) => slider.name === this.selectedSliderType)
      this.filteredImages = selectedSlider ? selectedSlider.photos : []
      this.selectedIndex = 0
      if (this.mySwiper) {
        this.mySwiper.slideToLoop(0)
      }
    },
    onSwiper(swiper) {
      this.mySwiper = swiper
      swiper.on('slideChange', () => {
        if (!this.ignoreNextSlideChange) {
          this.selectedIndex = swiper.realIndex
        }
        this.ignoreNextSlideChange = false
      })
    },
    selectSlider(sliderName) {
      this.selectedSliderType = sliderName
      this.filterImagesBySliderType()
    },
    slideToPrev() {
      if (this.mySwiper) {
        this.ignoreNextSlideChange = true
        this.mySwiper.slidePrev()
        this.updateSelectedIndex(this.mySwiper.realIndex)
      }
    },
    slideToNext() {
      if (this.mySwiper) {
        this.ignoreNextSlideChange = true
        this.mySwiper.slideNext()
        this.updateSelectedIndex(this.mySwiper.realIndex)
      }
    },
    showImage(index) {
      if (this.mySwiper) {
        this.ignoreNextSlideChange = true
        this.mySwiper.slideToLoop(index)
        this.updateSelectedIndex(index)
      }
    },
    updateSelectedIndex(index) {
      this.selectedIndex = index
    },
  },
  mounted() {
    this.fetchBanner()
  },
}
</script>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  background-color: rgb(42, 41, 59, 0.7);
  border: 1px solid transparent;
  border-radius: 20px;
  transition: all 0.3s ease;
  color: white;
}

.btn:hover {
  border-color: #f90;
}

.selected {
  background-color: white;
  color: black;
}

.arrow {
  cursor: pointer;
}

.arrow-right,
.arrow-left {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.thumb {
  width: 70px;
  height: 40px;
  object-fit: cover;
  border-radius: 0.5rem;
  cursor: pointer;
  border: 2px solid white;
}

.thumb:hover,
.thumb.selected {
  border-color: #f90;
}
</style>
