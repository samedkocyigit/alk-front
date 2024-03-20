<script setup>
import { ref } from 'vue'

// Props tanımlama gerekli değil, çünkü bu bileşen dışarıdan bir ürün nesnesi almayacak, zaten backend'den alınmış bir ürün listesini kullanacak.

const width = 'w-[200px]' // width prop'u için varsayılan değeri tanımlayın

const products = ref([]) // Ürünler için bir dizi ref oluşturun

// Backend'den ürünleri almak için bir işlev veya API çağrısı yapın
async function fetchProducts() {
  try {
    const response = await fetch('/shopping/products')
    if (response.ok) {
      const data = await response.json()
      products.value = data // Ürünleri diziye atayın
    } else {
      console.error('Failed to fetch product data')
    }
  } catch (error) {
    console.error('Error fetching product data:', error)
  }
}

// Sayfa yüklendiğinde backend'den ürünleri almak için fetchProducts işlevini çağırabilirsiniz
fetchProducts()
</script>

<template>
  <div>
    <div v-for="product in products" :key="product.id">
      <div :class="`flex flex-col h-[330px] overflow-hidden product-card-shadow bg-white rounded-xl ${width}`">
        <LazyImg class-style="h-[180px] object-cover w-full" :src="product.photos" alt="" />
        <div class="flex-auto p-3">
          <p class="text-sm font-semibold text-[#363636] truncate-2">{{ product.name }}</p>
          <p v-if="product.cost" class="mt-1 font-bold text-lg">${{ product.price }}</p>
          <p v-if="product?.maxPrice != undefined && product?.minPrice != undefined" class="mt-1 font-bold text-lg">
            ${{ product?.minPrice }} - ${{ product?.maxPrice }}
          </p>
          <!-- <span class="bg-[#fff1f1] text-[#ff5353] text-xs font-bold px-1 py-1">{{ product.discount }}%</span>
          <span class="text-primary-200 text-xs px-1 py-1">$100.00</span> -->
          <div>
            <i class="ri-map-pin-2-fill text-primary-200"></i>
            <span class="ml-2 text-xs text-primary-200">{{ product.location }}</span>
          </div>
          <div class="text-primary-200 text-xs">
            <span>
              <i class="ri-star-fill text-[#ffaa28]"></i>
              <span class="ml-2 mr-1">{{ product.averageRatings }}</span>
              <span>|</span>
              <span class="ml-1">sold {{ product.sold }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
