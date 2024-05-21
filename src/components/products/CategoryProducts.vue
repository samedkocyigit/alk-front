<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import 'swiper/css'

import ProductCardCatrgory from './ProductCard.vue'
import { getCategoryBySlugApi, getCategoryForProductsApi } from '@/services/category.service'

const products = ref([]) // Ürünler için bir dizi ref oluşturun
const loading = ref(true)
const filters = ref({})
const route = useRoute()

//Backend'den product nesnesini almak için bir işlev veya API çağrısı yapın
async function fetchProducts() {
  try {
    loading.value = true
    const slug = route.params.id // Urlden slug değerini al
    console.log('slug', slug)

    const categoryRes = await getCategoryBySlugApi(slug)
    console.log('categoryRes', categoryRes.data.data)
    if (categoryRes.status !== 200) {
      throw new Error('Kategori fetch işlemi başarısız.')
    }

    const categoryId = categoryRes.data.data.category[0]._id // Kategorinin id değerini al
    console.log('categoryId', categoryId)

    const response = await getCategoryForProductsApi(categoryId, filters.value)
    console.log('response', response.data.data)
    if (response.status !== 200) {
      throw new Error('Fetch işlemi başarısız.')
    }
    products.value = response.data.data
    console.log('products', products.value)
  } catch (error) {
    console.error('Hata:', error.message)
  } finally {
    loading.value = false // İşlem tamamlandığında loading değerini false olarak ayarla
  }
}

onMounted(() => {
  fetchProducts()
})

// URL'deki slug değişikliklerini izleyerek fetchProducts'ı yeniden çağır
watch(
  () => route.params.id,
  () => {
    fetchProducts()
  }
)
watch(
  filters,
  () => {
    fetchProducts()
  },
  { deep: true }
)
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
    <!-- Filtre Seçenekleri -->
    <div class="filters">
      <form @submit.prevent="fetchProducts">
        <!-- Fiyat Aralığı -->
        <div>
          <label>Min Price:</label>
          <input v-model="filters.minPrice" type="number" placeholder="Min Price" />
        </div>
        <div>
          <label>Max Price:</label>
          <input v-model="filters.maxPrice" type="number" placeholder="Max Price" />
        </div>
        <!-- Diğer Filtreler Buraya Eklenecek -->
        <button type="submit">Apply Filters</button>
      </form>
    </div>
    <!-- list product -->
    <div
      v-if="products && products.data && products.data.length > 0"
      class="w-full flex flex-wrap justify-start p-15 gap-7"
    >
      <div v-for="product in products.data.slice(0, 14)" :key="product.id" class="w-[200px] flex justify-center">
        <ProductCardCatrgory :product="product" />
      </div>
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
