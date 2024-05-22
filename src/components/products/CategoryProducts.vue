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
    <div class="flex items-start">
      <!-- Filtre Seçenekleri -->
      <div class="w-1/4 p-4">
        <h3 class="text-lg font-bold">Filtreler</h3>
        <div class="border-b-[1px] mt-2 mb-2"></div>
        <!-- En Az ve En Çok Fiyat Giriş Kutuları -->
        <label style="font-weight: 800" for="priceRange">Fiyat Aralığı</label>
        <div class="flex items-center space-x-4">
          <input
            type="text"
            placeholder="en az"
            v-model.number="filters.minPrice"
            class="w-16 h-8 border border-gray-300 rounded-md px-2"
            style="font-size: 0.8rem"
            inputmode="numeric"
            pattern="\d"
            @input="validateNumericInput('minPrice', $event)"
          />
          <input
            type="text"
            placeholder="en çok"
            v-model.number="filters.maxPrice"
            class="w-16 h-8 border border-gray-300 rounded-md px-2"
            style="font-size: 0.8rem"
            inputmode="numeric"
            pattern="\d"
            @input="validateNumericInput('maxPrice', $event)"
          />
          <button @click="filterProducts" class="text-white px-3 py-1 rounded-md" style="background-color: #5a4098">
            Ara
          </button>
        </div>
        <div class="mt-4">
          <div>
            <input
              type="radio"
              id="priceRange1"
              value="0-150"
              v-model="selectedPriceRange"
              @click="updatePriceFilter('0-150')"
            />
            <label class="ml-1" for="priceRange1">0 - 150 TL</label>
          </div>
          <div>
            <input
              type="radio"
              id="priceRange2"
              value="151-350"
              v-model="selectedPriceRange"
              @click="updatePriceFilter('151-350')"
            />
            <label class="ml-1" for="priceRange2">151 - 350 TL</label>
          </div>
          <div>
            <input
              type="radio"
              id="priceRange3"
              value="351-650"
              v-model="selectedPriceRange"
              @click="updatePriceFilter('351-650')"
            />
            <label class="ml-1" for="priceRange3">351 - 650 TL</label>
          </div>
          <!-- Diğer fiyat aralığı seçenekleri buraya eklenmeli -->
        </div>
      </div>
      <!-- list product -->
      <div
        v-if="products && products.data && products.data.length > 0"
        class="w-full flex flex-wrap justify-start p-15 gap-5"
      >
        <div v-for="product in products.data.slice(0, 14)" :key="product.id" class="w-[220px] flex justify-center">
          <ProductCardCatrgory :product="product" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import 'swiper/css'

import ProductCardCatrgory from './ProductCardCategory.vue'
import { getCategoryBySlugApi, getCategoryForProductsApi } from '@/services/category.service'

const products = ref([]) // Ürünler için bir dizi ref oluşturun
const loading = ref(true)
const filters = ref({
  minPrice: null,
  maxPrice: null,
})
const selectedPriceRange = ref(null) // Seçili fiyat aralığı için bir ref oluşturun

const route = useRoute()
const router = useRouter()

// Backend'den product nesnesini almak için bir işlev veya API çağrısı yapın
async function fetchProducts() {
  try {
    loading.value = true
    const slug = route.params.id // Urlden slug değerini al

    const categoryRes = await getCategoryBySlugApi(slug)
    if (categoryRes.status !== 200) {
      throw new Error('Kategori fetch işlemi başarısız.')
    }

    const categoryId = categoryRes.data.data.category[0]._id // Kategorinin id değerini al

    const params = new URLSearchParams()

    if (filters.value.minPrice) {
      params.append('price[gte]', filters.value.minPrice)
    }
    if (filters.value.maxPrice) {
      params.append('price[lte]', filters.value.maxPrice)
    }

    const response = await getCategoryForProductsApi(categoryId, params)
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

function filterProducts() {
  const params = new URLSearchParams()

  if (filters.value.minPrice) {
    params.set('fiyat:min', filters.value.minPrice)
  }
  if (filters.value.maxPrice) {
    params.set('fiyat:max', filters.value.maxPrice)
  }

  router.push({ query: Object.fromEntries(params) })
  fetchProducts()
}

function updatePriceFilter(priceRange) {
  if (selectedPriceRange.value === priceRange) {
    // Zaten seçiliyse seçimi kaldır
    selectedPriceRange.value = null
    filters.value.minPrice = null
    filters.value.maxPrice = null
  } else {
    // Seçili fiyat aralığını belirle ve filtreleri güncelle
    selectedPriceRange.value = priceRange
    if (priceRange === '0-150') {
      filters.value.minPrice = 0
      filters.value.maxPrice = 150
    } else if (priceRange === '151-350') {
      filters.value.minPrice = 151
      filters.value.maxPrice = 350
    } else if (priceRange === '351-650') {
      filters.value.minPrice = 351
      filters.value.maxPrice = 650
    }
  }
  fetchProducts()
}

function validateNumericInput(field, event) {
  const value = event.target.value.replace(/\D/g, '')
  filters.value[field] = value
  event.target.value = value
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
</script>

<style scoped>
.RouterLink {
  display: flex;
  justify-content: center;
}

.RouterLink > * {
  margin: 0 auto; /* Dikeyde ortalama */
}

.filter-option {
  margin-bottom: 10px;
}

.filter-option input {
  margin-right: 5px;
}
</style>
