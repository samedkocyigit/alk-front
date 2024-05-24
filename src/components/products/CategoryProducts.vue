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
    <div class="flex items-start">
      <!--Filtre Seçenekleri -->
      <div class="w-1/4 p-4">
        <h3 class="text-lg font-bold">Filtreler</h3>
        <div class="border-b-[1px] mt-2 mb-2"></div>
        <div v-for="filtre in filtreler" :key="filtre._id">
          <h4 class="text-lg font-semibold">{{ filtre.name }}</h4>
          <ul>
            <li v-for="value in filtre.values" :key="value.name">
              <input
                type="checkbox"
                :value="value.slug"
                :checked="isChecked(filtre.slug, value.slug)"
                @change="updateFilters(filtre.slug, value.slug, $event)"
              />
              <label v-if="filtre.name === 'Price'"> {{ ' ' + value.name + ' TL' }}</label>
              <label v-else> {{ ' ' + value.name }}</label>
            </li>
            <div class="border-b-[1px] mt-2 mb-2"></div>
          </ul>
        </div>
      </div>
      <!-- <div class="w-1/4 p-4">
        <h3 class="text-lg font-bold">Filtreler</h3>
        <div class="border-b-[1px] mt-2 mb-2"></div>
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
          </div> -->
      <!-- Diğer fiyat aralığı seçenekleri buraya eklenmeli -->
      <!-- </div> -->
      <!-- </div> -->
      <!-- list product -->
      <div
        v-if="products && products.data && products.data.length >= 0"
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
import {
  getCategoryBySlugApi,
  getCategoryForProductsApi,
  getSubCategoryForProductsApi,
  getSubCategoryBySlugApi,
} from '@/services/category.service'
import store from '@/stores/master.store'

const products = ref([]) // Ürünler için bir dizi ref oluşturun
const loading = ref(true)

const selectedFilters = ref({})
const filtreler = ref(store.state.categories.data[0].filter)
const route = useRoute()
const router = useRouter()

const isChecked = (filterSlug, valueSlug) => {
  return selectedFilters.value[filterSlug]?.includes(valueSlug) || false
}

const updateFilters = (filterSlug, valueSlug, event) => {
  if (!selectedFilters.value[filterSlug]) {
    selectedFilters.value[filterSlug] = []
  }
  if (event.target.checked) {
    if (!selectedFilters.value[filterSlug].includes(valueSlug)) {
      selectedFilters.value[filterSlug].push(valueSlug)
    }
  } else {
    const index = selectedFilters.value[filterSlug].indexOf(valueSlug)
    if (index > -1) {
      selectedFilters.value[filterSlug].splice(index, 1)
    }
    if (selectedFilters.value[filterSlug].length === 0) {
      delete selectedFilters.value[filterSlug]
    }
  }
  updateUrl()
}

const updateUrl = () => {
  const params = new URLSearchParams(route.query)

  const filterStrings = []
  Object.keys(selectedFilters.value).forEach((filterSlug) => {
    selectedFilters.value[filterSlug].forEach((valueSlug) => {
      filterStrings.push(`${filterSlug}:${valueSlug}`)
    })
  })

  if (filterStrings.length > 0) {
    params.set('filtreler', filterStrings.join(','))
  } else {
    params.delete('filtreler')
  }

  router.replace({ path: route.path, query: Object.fromEntries(params) })
  fetchProducts()
}

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

    if (route.params.subId) {
      const subSlug = route.params.subId

      const subCategoryRes = await getSubCategoryBySlugApi(subSlug)

      if (subCategoryRes.status !== 200) {
        throw new Error('Alt Kategori fetch işlemi başarısız')
      }
      const subCategoryId = subCategoryRes.data.data.sub_category._id

      const params = new URLSearchParams()

      const response = await getSubCategoryForProductsApi(categoryId, subCategoryId, params)
      if (response.status !== 200) {
        throw new Error('Fetch işlemi başarısız')
      }
      products.value = response.data.data
      console.log('response ', products.value)
    } else {
      const params = new URLSearchParams()

      const response = await getCategoryForProductsApi(categoryId, params)
      // console.log('response', response.data.data)
      if (response.status !== 200) {
        throw new Error('Fetch işlemi başarısız.')
      }
      products.value = response.data.data
      console.log('products', products.value)
    }
  } catch (error) {
    console.error('Hata:', error.message)
  } finally {
    loading.value = false // İşlem tamamlandığında loading değerini false olarak ayarla
  }
}

const setSelectedFiltersFromQuery = () => {
  const query = route.query
  const filters = query.filtreler
  selectedFilters.value = {}
  if (filters) {
    const filterArray = Array.isArray(filters) ? filters : [filters]
    filterArray.forEach((filter) => {
      const [filterSlug, valueSlug] = filter.split(':')
      if (!selectedFilters.value[filterSlug]) {
        selectedFilters.value[filterSlug] = []
      }
      if (!selectedFilters.value[filterSlug].includes(valueSlug)) {
        selectedFilters.value[filterSlug].push(valueSlug)
      }
    })
  }
}

onMounted(() => {
  setSelectedFiltersFromQuery()
  fetchProducts()
})

// URL'deki slug değişikliklerini izleyerek fetchProducts'ı yeniden çağır
watch(
  () => [route.params.id, route.params.subId],
  () => {
    setSelectedFiltersFromQuery()
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
