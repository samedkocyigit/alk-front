<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref } from 'vue'
import 'swiper/css'

import ProductCard from './ProductCard.vue'
import { getProductsApi } from '@/services/product.service'

const products = ref([]) // Ürünler için bir dizi ref oluşturun
const loading = ref(true)
//Backend'den product nesnesini almak için bir işlev veya API çağrısı yapın
async function fetchProduct() {
  if (products.value.length === 0) {
    try {
      // const response = await axios.get('http://127.0.0.1:3000/products')
      const response = await getProductsApi()
      if (response.status !== 200) {
        // HTTP durum kodunu kontrol et
        throw new Error('Fetch işlemi başarısız.')
      }
      products.value = response.data.data
    } catch (error) {
      console.error('Hata:', error.message)
    } finally {
      loading.value = false // İşlem tamamlandığında loading değerini false olarak ayarla
    }
  }
}
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
    <div
      v-if="products && products.data && products.data.length > 0"
      class="w-full flex flex-wrap justify-start p-4 gap-2"
    >
      <RouterLink
        v-for="product in products.data.slice(0, 12)"
        :key="product.id"
        :to="`/products/${product.id}`"
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
