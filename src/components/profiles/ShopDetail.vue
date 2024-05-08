<script setup>
import { onMounted, defineProps, ref } from 'vue'
import LazyImg from '../commons/atoms/LazyImg.vue'
const brandsImg = ref('')

const props = defineProps({
  shop: {
    type: Object,
    required: true,
  },
})

onMounted(() => {
  brandsImg.value = props.shop.photos[0]
})
</script>

<template>
  <div class="w-full py-8 flex items-center">
    <div class="flex gap-4">
      <LazyImg
        class-style="w-[200px] h-[120px] rounded-full"
        :src="`../../../public/images/brands/${brandsImg}`"
        alt=""
      />

      <!-- <div class="flex flex-col justify-center">
        <p class="text-lg font-bold">{{ props.shop.name }}</p>
      </div> -->
    </div>
    <div class="flex ml-5">
      <router-link
        :to="`/shop/${props.shop._id}`"
        class="border-[2px] border-third-100 h-fit text-third-100 py-2 px-3 rounded-md"
      >
        <i class="ri-store-2-fill"></i> View shop
      </router-link>
    </div>
    <div></div>
  </div>
</template>
