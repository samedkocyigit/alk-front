<script setup>
import { ref } from 'vue'

// Props tanımlama gerekli değil, çünkü bu bileşen dışarıdan bir ürün nesnesi almayacak, zaten backend'den alınmış bir ürün listesini kullanacak.

const width = 'w-[200px]' // width prop'u için varsayılan değeri tanımlayın

const products = ref([]) // Ürünler için bir dizi ref oluşturun

// Backend'den product nesnesini almak için bir işlev veya API çağrısı yapın
async function fetchProduct() {
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
    console.log(products.value.data[0].name)
  } catch (error) {
    console.error('Hata:', error.message)
  }
}

// Sayfa yüklendiğinde backend'den ürünleri almak için fetchProducts işlevini çağırabilirsiniz
fetchProduct()
</script>

<template>
  <div>
    <swiper v-if="products.data && products.data.length > 0">
      <swiper-slide v-for="product in products.data" :key="product._id">
        <div :class="`flex flex-col h-[330px] overflow-hidden product-card-shadow bg-white rounded-xl ${width}`">
          <LazyImg class-style="h-[180px] object-cover w-full" :src="product.photos[0]" alt="" />
          <div class="flex-auto p-3">
            <p class="text-sm font-semibold text-[#363636] truncate-2">{{ product.name }}</p>
            <p v-if="product.cost" class="mt-1 font-bold text-lg">${{ product.price }}</p>
            <p v-if="product?.maxPrice != undefined && product?.minPrice != undefined" class="mt-1 font-bold text-lg">
              ${{ product?.minPrice }} - ${{ product?.maxPrice }}
            </p>
            <div>
              <i class="ri-map-pin-2-fill text-primary-200"></i>
              <span class="ml-2 text-xs text-primary-200">{{ product.category_name }}</span>
            </div>
            <div class="text-primary-200 text-xs">
              <span>
                <i class="ri-star-fill text-[#ffaa28]"></i>
                <span class="ml-2 mr-1">{{ product.ratingsAverage }}</span>
                <span>|</span>
                <span class="ml-1">sold {{ product.ratingsAverage }}</span>
              </span>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
