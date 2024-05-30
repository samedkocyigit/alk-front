<template>
  <div class="w-full h-fit bg-[#f9f9f9] rounded-md">
    <!-- Başlık ve Daha Fazla Butonu -->
    <div class="w-full flex justify-between p-4">
      <div class="flex">
        <h2 class="text-xl font-bold">Yeni Ürünler</h2>
      </div>
      <div class="text-[#5a4098]">Daha Fazla Gör</div>
    </div>
    <!-- Filtre Seçenekleri ve Ürün Listesi -->
    <div class="flex items-start">
      <!-- Filtre Seçenekleri -->
      <div class="w-1/4 p-4">
        <h3 class="text-lg font-bold">Filtreler</h3>
        <div class="border-b-[1px] mt-2 mb-2"></div>
        <!-- Filtrelerin Listesi -->
        <div v-for="filtre in filtreler" :key="filtre._id">
          <h4 class="text-lg font-semibold">{{ filtre.name }}</h4>
          <ul>
            <!-- Filtre Değerlerinin Listesi -->
            <li v-for="value in filtre.values" :key="value.slug">
              <input
                type="checkbox"
                :value="value.slug"
                :checked="isChecked(filtre.slug, value.slug)"
                @change="updateFilters(filtre.slug, value.slug, $event)"
                :name="`${filtre.slug}-${value.slug}`"
              />
              <label v-if="filtre.name === 'Price'"> {{ ' ' + value.name + ' TL' }}</label>
              <label v-else> {{ ' ' + value.name }}</label>
            </li>
          </ul>
          <div class="border-b-[1px] mt-2 mb-2"></div>
        </div>
      </div>
      <!-- Ürün Listesi -->
      <div
        class="w-full flex flex-wrap justify-start p-15 gap-5"
        v-if="products && products.data && products.data.length >= 0"
      >
        <div v-for="product in products.data.slice(0, 14)" :key="product.id" class="w-[220px] flex justify-center">
          <ProductCardCategory :product="product" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import 'swiper/css'

import ProductCardCategory from './ProductCardCategory.vue'
import {
  getCategoryBySlugApi,
  getCategoryForProductsApi,
  getSubCategoryForProductsApi,
  getSubCategoryBySlugApi,
} from '@/services/category.service'

const products = ref([]) // Ürünler için bir dizi ref oluşturun
const loading = ref(true)

const selectedFilters = ref({})
const filtreler = ref([]) // Filtreler dinamik olarak atanacak
const route = useRoute()
const router = useRouter()

const isChecked = (filterSlug, valueSlug) => {
  return selectedFilters.value[filterSlug]?.includes(valueSlug) || false
}

const updateFilters = (filterSlug, valueSlug, event) => {
  // Seçilen filtreleri kopyalayalım
  let newSelectedFilters = JSON.parse(JSON.stringify(selectedFilters.value))

  // Eğer bu filtreye ait bir seçim yapılmamışsa, yeni bir dizi oluştur
  if (!newSelectedFilters[filterSlug]) {
    newSelectedFilters[filterSlug] = []
  }

  // Eğer checkbox işaretliyse, değeri seçilmiş filtreler listesine ekleyelim
  if (event.target.checked) {
    newSelectedFilters[filterSlug].push(valueSlug)
  } else {
    // Eğer checkbox işaretli değilse, değeri seçilmiş filtreler listesinden çıkaralım
    newSelectedFilters[filterSlug] = newSelectedFilters[filterSlug].filter((item) => item !== valueSlug)
  }

  // Güncellenmiş filtreleri atayalım
  selectedFilters.value = newSelectedFilters
  console.log('selected', selectedFilters.value)

  // URL'yi ve ürünleri güncelleyelim
  updateUrl()
}

const updateUrl = () => {
  const params = new URLSearchParams()

  // Tüm seçili filtreleri 'ozellikler' parametresi formatında birleştirin
  Object.keys(selectedFilters.value).forEach((filterSlug) => {
    selectedFilters.value[filterSlug].forEach((valueSlug) => {
      params.append('ozellikler.name', filterSlug)
      params.append('ozellikler.value', valueSlug)
    })
  })

  // Seçilen filtreleri URL'ye ekleyin
  router.replace({ path: route.path, query: Object.fromEntries(params) })

  // API isteğini yapmadan önce URL'yi güncelle
  fetchProducts()
}

// Backend'den product nesnesini almak için bir işlev veya API çağrısı yapın
async function fetchProducts(customParams = null) {
  try {
    loading.value = true
    const slug = route.params.id
    const categoryRes = await getCategoryBySlugApi(slug)

    if (categoryRes.status !== 200) {
      throw new Error('Kategori fetch işlemi başarısız.')
    }

    const categoryId = categoryRes.data.data.category[0]._id
    filtreler.value = categoryRes.data.data.category[0].filter

    const params = customParams || new URLSearchParams(route.query)
    let response

    if (route.params.subId) {
      const subSlug = route.params.subId
      const subCategoryRes = await getSubCategoryBySlugApi(subSlug)

      if (subCategoryRes.status !== 200) {
        throw new Error('Alt Kategori fetch işlemi başarısız')
      }

      const subCategoryId = subCategoryRes.data.data.sub_category._id
      response = await getSubCategoryForProductsApi(categoryId, subCategoryId, params)
    } else {
      response = await getCategoryForProductsApi(categoryId, params)
    }

    if (response.status !== 200) {
      throw new Error('Fetch işlemi başarısız.')
    }

    products.value = response.data.data
  } catch (error) {
    console.error('Hata:', error.message)
  } finally {
    loading.value = false
  }
}

const setSelectedFiltersFromQuery = () => {
  const query = route.query
  const filterNames = query['ozellikler.name']
  const filterValues = query['ozellikler.value']
  selectedFilters.value = {}
  if (filterNames && filterValues) {
    const nameArray = Array.isArray(filterNames) ? filterNames : [filterNames]
    const valueArray = Array.isArray(filterValues) ? filterValues : [filterValues]
    nameArray.forEach((filterName, index) => {
      const filterValue = valueArray[index]
      if (!selectedFilters.value[filterName]) {
        selectedFilters.value[filterName] = []
      }
      if (!selectedFilters.value[filterName].includes(filterValue)) {
        selectedFilters.value[filterName].push(filterValue)
      }
    })
  }
}

onMounted(() => {
  setSelectedFiltersFromQuery()
  fetchProducts()
})

// URL'deki slug değişikliklerini izleyerek fetchProducts'ı yeniden çağır
// URL'deki slug ve query değişikliklerini izleyerek fetchProducts'ı yeniden çağır
watch(
  () => [route.params.id, route.params.subId, route.query],
  (newVal, oldVal) => {
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
