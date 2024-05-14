<script setup>
import { defineProps, ref, onMounted } from 'vue'
import LazyImg from '../commons/atoms/LazyImg.vue'

const props = defineProps({
  brand: {
    type: Object,
    required: true,
  },
  width: {
    type: String,
    default: 'w-[200px]',
  },
})

const brandsImg = ref('')

onMounted(() => {
  brandsImg.value = props.brand.photos[0]
  console.log('Brand Img Adi:', brandsImg.value)
})
</script>
<template>
  <div
    :class="`flex flex-col overflow-hidden product-card-shadow bg-white rounded-xl border ${width}`"
    style="height: 80px"
  >
    <!-- <img :src="`./images/brands/${brandsImg}`" alt="" style="max-height: 70px; width: auto" /> -->
    <LazyImg
      class-style="h-[100px] object-cover w-full"
      :src="`./images/brands/${brandsImg}`"
      alt=""
      style="max-height: 100px; max-width: 100%"
    />
  </div>
</template>
