<template>
  <div class="flex w-full px-5 justify-center">
    <div class="flex flex-col gap-3 w-full max-w-[1350px] h-fit rounded-[8px]">
      <!-- Breadcrumb -->
      <div class="w-full mt-10">
        <BreadCrumb :routes="routes" />
      </div>
      <!-- Product Detail -->
      <div class="w-full flex flex-col max-md:flex-col md:flex-row gap-10 border p-5">
        <!-- Thumbnail -->
        <ThumbnailsProduct :current-type="typeSelected" :product="product" />
        <!-- Product Info -->
        <div class="flex-auto">
          <h1 class="text-xl font-bold mb-2">{{ product.data.name }}</h1>
          <div class="text-xl mt-3">
            <span>{{ product.data.price }} TL + KDV</span>
          </div>
          <div class="border-b-[1px] pb-4"></div>
          <div class="mt-4 flex justify-between items-center text-lg">
            <span>Liste Fiyatı: {{ product.data.price }} TL + KDV</span>
          </div>
          <div class="border-b-[1px] pb-4"></div>
          <div class="mt-4 flex justify-between items-center text-lg">
            <span>Havale: {{ product.data.price }} TL + KDV</span>
          </div>
          <div class="border-b-[1px] pb-4"></div>
          <div class="mt-4 flex justify-between items-center text-lg">
            <span>Stok Kodu: {{ product.data.stock_code }}</span>
          </div>
          <div class="border-b-[1px] pb-4"></div>
          <div class="mt-4 flex justify-between items-center text-lg">
            <span>Üretici Kodu: {{ product.data.manufacturerCode }}</span>
          </div>
          <div class="border-b-[1px] pb-4"></div>
          <!-- Add to Cart and Buy Now -->
          <div class="mt-4 flex items-center">
            <ANumberInput v-model="quantity" :max="20" />
            <div
              class="cursor-pointer text-third-100 border-third-100 border-2 px-3 py-3 ml-4 rounded-md"
              @click="addItemToCart"
            >
              <i class="ri-shopping-cart-2-line"></i> Sepete Ekle
            </div>
            <div class="border-b-[1px] pb-4"></div>
            <div
              class="cursor-pointer text-white bg-third-100 border-third-100 border-2 px-3 py-3 ml-4 gap-3 rounded-md"
              @click="buyNow"
            >
              Hızlı Satın Al
            </div>
          </div>
          <!-- Additional Actions -->
          <div class="mt-4 flex items-center tab-buttons">
            <button class="text-third-100 border-third-100 border-2 px-1 py-3 rounded-md">
              <i class="ri-heart-line"></i> Favori ürün
            </button>
            <button class="text-third-100 border-third-100 border-2 px-1 py-3 rounded-md">
              <i class="ri-bar-chart-grouped-line"></i> Karşılaştır
            </button>
            <button class="text-third-100 border-third-100 border-2 px-1 py-3 rounded-md">
              <i class="ri-share-line"></i> Paylaş
            </button>
            <button class="text-third-100 border-third-100 border-2 px-1 py-3 rounded-md">
              <i class="ri-mail-line"></i> Tavisye Et
            </button>
            <button class="text-third-100 border-third-100 border-2 px-1 py-3 rounded-md">
              <i class="ri-chat-3-line"></i> Yorum Yaz
            </button>
            <button class="text-third-100 border-third-100 border-2 px-1 py-3 rounded-md">
              <i class="ri-notification-2-line"></i> Fiyat Alarmı
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews -->
      <div class="w-full">
        <ProductsTab />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
// components
import ANumberInput from '@/components/commons/atoms/ANumberInput.vue'
import BreadCrumb from '@/components/commons/BreadCrumb.vue'
import ThumbnailsProduct from '@/components/products/ThumbnailsProduct.vue'
import ProductsTab from '@/views/product/tabs/ProductsTabs.vue'
// services
import { getProductApi } from '@/services/product.service'
import { addToCartApi } from '@/services/cart.service'
// stores
import store from '@/stores/master.store'
import { usePopupStore } from '@/stores/common.store'
import { getCategoryApi, getSubCategoryApi } from '@/services/category.service'

const popupStore = usePopupStore()
const route = useRoute()
const router = useRouter()
const routes = ref([
  {
    name: 'Anasayfa',
    path: '/',
  },
])

const product = ref({})
const typeSelected = ref(null)
const quantity = ref(1)
const cart = ref({})
cart.value = store.state.cart

const getProduct = async () => {
  try {
    const res = await getProductApi(route.params.id)
    product.value = res.data.data
    const routeCategory = await getCategoryApi(product.value.data.categoryId)
    const categoryPath = `/categories/${routeCategory.data.data.data.slug}`
    const category_name = routeCategory.data.data.data.category_name
    const routeSubCategory = await getSubCategoryApi(product.value.data.categoryId, product.value.data.subCategoryId)
    const subCategoryPath = `/categories/${routeCategory.data.data.data.slug}/sub_category/${routeSubCategory.data.data.subCategory.slug}`
    const subCategory_name = routeSubCategory.data.data.subCategory.sub_category_name
    if (!routes.value.some((route) => route.path === categoryPath)) {
      routes.value.push({
        name: category_name,
        path: categoryPath,
      })
    }
    if (!routes.value.some((route) => route.path === subCategoryPath)) {
      routes.value.push({
        name: subCategory_name,
        path: subCategoryPath,
      })
    }
  } catch (error) {
    console.log(error)
    router.push({ name: 'not-found' })
  }
}

onBeforeMount(async () => {
  try {
    await getProduct()
    photoName.value = product.value.data.photos[0]
  } catch (error) {
    console.log(error)
  }
})

const errValidate = computed(() => {
  if (cart.value.quantity > product.value?.quantity) {
    return {
      cart: 'Quantity must be less than quantity in stock',
    }
  }
  if (!product.value) {
    return {
      cart: 'Please choose type',
    }
  }
  return {
    cart: '',
  }
})

const addItemToCart = async () => {
  try {
    if (!product.value) {
      return
    }
    let res = ref({})
    res = await addToCartApi(cart.value._id, {
      items: [
        {
          product: product.value.data.id,
          quantity: quantity.value,
        },
      ],
    })
    store.dispatch('updateCart', res.data.data.data)
    toast.success('Add to cart success')
  } catch (error) {
    console.log(error)
    toast.error('Add to cart fail')
  }
}

const buyNow = () => {
  try {
    if (!product.value) {
      return
    }
    popupStore.showPopup({
      content: 'Do you want to checkout now?',
      type: 'confirm',
      onConfirm: () => {
        console.log('confirm')
        router.push({ name: 'checkout-direct', query: { typeId: product.value.id, quantity: cart.value.quantity } })
      },
    })
  } catch (error) {
    console.log(error)
    toast.error('You Cant buy now')
  }
}
</script>

<style scoped>
.tab-buttons {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}

.tab-buttons button {
  padding: 10px;
  margin: 0 5px; /* İstenilen boşluğu ayarlayın */
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

.tab-buttons button:hover {
  background-color: #f5f5f5;
}

.tab-buttons button:focus {
  outline: none;
}

.tab-buttons button.active {
  background-color: #e0e0e0;
}
</style>
