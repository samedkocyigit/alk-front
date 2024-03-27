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
      const response = await fetch('/api/products')
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
    <div class="w-full flex p-4 gap-4 relative">
      <div
        class="absolute z-10 flex justify-center items-center top-[45%] -right-5 w-[50px] h-[50px] cursor-pointer bg-white gb-shadow rounded-full"
        @click="mySwiper.slideNext()"
      >
        <i class="ri-arrow-right-s-line text-2xl"></i>
      </div>
      <div
        class="absolute z-10 flex justify-center items-center top-[45%] -left-5 w-[50px] h-[50px] cursor-pointer bg-white gb-shadow rounded-full"
        @click="mySwiper.slidePrev()"
      >
        <i class="ri-arrow-left-s-line text-2xl"></i>
      </div>
      <swiper
        style="padding: 0 8px 10px 8px"
        class="w-full pb-2"
        :slides-per-view="'auto'"
        :space-between="10"
        @swiper="onSwiper"
      >
        <swiper-slide v-for="product in products.data" :key="product.id" style="width: auto" class="w-fit">
          <RouterLink :to="`/brands/${product.id}`">
            <ProductCard :product="product" />
          </RouterLink>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
