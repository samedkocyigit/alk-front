<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import LazyImg from '../commons/atoms/LazyImg.vue'
import 'swiper/css'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  currentType: {
    type: Object,
    default: null,
  },
})

const listImages = computed(() => {
  // const baseUrl = './images/products/' // Resimlerin temel URL'si
  const imagesList = props.product.data.photos.map((photo) => ({
    url: `${photo}`, // Tam URL oluşturma
  }))
  return imagesList[0]
})

watch(
  () => props.currentType,
  () => {
    if (props.currentType) {
      currentImageSelected.value = props.currentType
    }
  }
)

const currentImageSelected = ref(null)
onMounted(() => {
  currentImageSelected.value = listImages.value[0]
  // currentImageSelected.value = listImages.value

  // View an image.
})

const hoverOnChange = (index) => {
  currentImageSelected.value = listImages.value[index]
}

const viewerInstance = ref(null)
const openImage = () => {
  // if (viewerInstance.value) {
  //   viewerInstance.value.destroy()
  // }
  console.log('openImage')
  viewerInstance.value = new Viewer(document.getElementById('images'), {
    inline: false,
    viewed() {},
  })
}
</script>
<template>
  <div class="max-md:w-full max-md:min-w-[unset] w-[550] min-w-[550px] h-[600px]">
    <div id="images" class="w-full bg-slate-300 h-[500px] overflow-hidden rounded-md mb-2">
      <div
        v-for="(thumb, index) in listImages"
        v-show="(!currentImageSelected && index === 0) || currentImageSelected?.id === thumb.id"
        :key="thumb.id"
        class="w-full h-full object-cover cursor-zoom-in"
        @click="openImage"
      >
        <LazyImg
          class-style="w-full h-full object-cover cursor-zoom-in"
          :src="`../../../public/images/products/${thumb}`"
          alt=""
        />
      </div>
    </div>

    <swiper style="padding: 0 0px 10px 0px" class="w-full" :slides-per-view="'auto'" :space-between="5">
      <swiper-slide v-for="(thumb, index) in listImages" :key="thumb.id" style="width: auto" class="w-fit">
        <div
          class="hover:border-gray-700 border-[2px] border-transparent overflow-hidden cursor-zoom-in w-[80px] h-[80px] rounded-md"
          @mouseover="hoverOnChange(index)"
        >
          <LazyImg class-style="w-full h-full object-cover" :src="`../../../public/images/products/${thumb}`" alt="" />
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
