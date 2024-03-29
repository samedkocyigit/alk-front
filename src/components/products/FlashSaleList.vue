<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onBeforeMount } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { getProductsApi, searchProductsApi } from '@/services/product.service'
import 'swiper/css'
const mySwiper = ref(null)

const onSwiper = (swiper) => {
  mySwiper.value = swiper
  console.log(swiper)
}
onBeforeMount(async () => {
  try {
    const res = await searchProductsApi()
    products.value = res.data.data
    console.log(res.data)
  } catch (error) {
    console.log(error)
  }
})

const products = ref([]) // Ürünler için bir dizi ref oluşturun
const loading = ref(true)
//Backend'den product nesnesini almak için bir işlev veya API çağrısı yapın
async function fetchProduct() {
  if (products.value.length === 0) {
    try {
      const response = await fetch('/products')
      if (!response.ok) {
        throw new Error('Fetch işlemi başarısız.')
      }
      const data = await response.json()
      if (!data || !data.data) {
        throw new Error('Gelen veriler istenilen formatta değil.')
      }
      products.value = data.data
      console.log('response=>', products.value)
      loading.value = false
    } catch (error) {
      console.error('Hata:', error.message)
      loading.value = false
    }
  }
}

import ProductCard from './ProductCard.vue'
// Sayfa yüklendiğinde backend'den product nesnesini almak için fetchProduct işlevini çağırabilirsiniz
fetchProduct()

// render list product have properties: name, cost, image, discount, location, star, sold
</script>
<template>
  <div class="w-full h-fit bg-[#f9f9f9] rounded-md">
    <!-- title flash sale -->
    <div class="w-full flex justify-between p-4">
      <div class="flex">
        <h2 class="text-xl font-bold">New Products</h2>
      </div>
      <div class="text-[#5a4098]">See more</div>
    </div>
    <!-- end title header -->
    <!-- list product -->
    <div class="w-full flex flex-wrap justify-start p-4 gap-2">
      <RouterLink
        v-for="product in products.data.slice(0, 12)"
        :key="product.id"
        :to="`/brands/${product.id}`"
        class="w-[180px] flex justify-center"
      >
        <ProductCard :product="product" />
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.RouterLink {
  display: flex;
  justify-content: center;
}

.RouterLink > * {
  margin: 0 auto; /* Dikeyde ortalama */
}
</style>
