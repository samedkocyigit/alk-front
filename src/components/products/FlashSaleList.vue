<script setup>
import { ref, onBeforeMount } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { searchProductsApi } from '@/services/product.service'
import 'swiper/css'
const mySwiper = ref(null)

const onSwiper = (swiper) => {
  mySwiper.value = swiper
  console.log(swiper)
}
onBeforeMount(async () => {
  try {
    const res = await searchProductsApi()
    backendProduct.value = res.data.data
    console.log(res.data)
  } catch (error) {
    console.log(error)
  }
})
import ProductCard from './ProductCard.vue'

const backendProduct = ref(null) // Backend'den gelen product nesnesi için bir referans oluşturun

// Backend'den product nesnesini almak için bir işlev veya API çağrısı yapın
async function fetchProduct() {
  const response = await fetch('backend/api/products/123')
  backendProduct.value = await response.json()
}

// Sayfa yüklendiğinde backend'den product nesnesini almak için fetchProduct işlevini çağırabilirsiniz
fetchProduct()

//   {
//     name: 'Long Product Name 1 You Might Forget the BeginningYou Might Forget the Beginning',
//     cost: 29.99,
//     image:
//       'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1911&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     discount: 5,
//     location: 'Location 1',
//     star: 4.2,
//     sold: 50,
//   },

// render list product have properties: name, cost, image, discount, location, star, sold
</script>
<template>
  <div class="w-full h-fit bg-[#f9f9f9] rounded-md">
    <!-- title flash sale -->
    <div class="w-full flex justify-between p-4">
      <div class="flex">
        <h2 class="text-xl font-bold">Newest product</h2>
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
        <swiper-slide v-for="product in products" :key="product.name" style="width: auto" class="w-fit">
          <RouterLink :to="`/products/${product.id}`">
            <ProductCard :product="product" />
          </RouterLink>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
