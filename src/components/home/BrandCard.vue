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
    default: 'w-[260px]',
  },
})

const brandsImg = ref('')

onMounted(() => {
  brandsImg.value = props.brand.photo[0]
  console.log('Brand Img Adi:', brandsImg.value)
})
</script>
<template>
  <div :class="`flex flex-col overflow-hidden product-card-shadow bg-white rounded-xl ${width}`" style="height: 100px">
    <!-- <img :src="`./images/brands/${brandsImg}`" alt="" style="max-height: 70px; width: auto" /> -->
    <LazyImg
      class-style="h-[70px] object-cover w-full"
      :src="`./images/brands/${brandsImg}`"
      alt=""
      style="max-height: 70px; max-width: 100%"
    />
    <div class="flex-auto p-3">
      <p class="text-sm font-semibold text-[#363636] truncate-2 text-center">{{ brand.name }}</p>
    </div>
  </div>
</template>
