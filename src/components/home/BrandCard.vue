<script setup>
import LazyImg from '../commons/atoms/LazyImg.vue'

defineProps({
  brand: {
    type: Object,
    required: true,
  },
  width: {
    type: String,
    default: 'w-[260px]',
  },
})
</script>

<template>
  <div :class="`flex flex-col h-[100px] overflow-hidden product-card-shadow bg-white rounded-xl ${width}`">
    <LazyImg
      class-style="h-[70px] object-cover w-full"
      :src="`frontend/src/assets/images/brands/${brand.photo[0]}`"
      alt=""
    />
    <div class="flex-auto p-3">
      <p class="text-sm font-semibold text-[#363636] truncate-2 text-center">{{ brand.name }}</p>
    </div>
  </div>
</template>
