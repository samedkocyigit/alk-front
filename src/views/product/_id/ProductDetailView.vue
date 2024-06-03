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
            <RouterLink
              v-if="authStore.state.isLoggedIn === false"
              to="/users/login"
              @mouseover="hovering = true"
              @mouseleave="hovering = false"
            >
              <button class="tab-button">
                <i class="ri-heart-line" :title="hovering ? 'Favorilere Ekle' : ''"></i>
                <span>Favorile</span>
              </button>
            </RouterLink>
            <button
              v-else
              class="tab-button"
              @mouseover="hovering = true"
              @mouseleave="hovering = false"
              @click="toggleFavorite"
            >
              <i class="ri-heart-line"></i>
              <span>Favorile</span>
            </button>
            <button class="tab-button">
              <i class="ri-bar-chart-grouped-line"></i>
              <span>Karşılaştır</span>
            </button>
            <button class="tab-button">
              <i class="ri-share-line"></i>
              <span>Paylaş</span>
            </button>
            <button class="tab-button">
              <i class="ri-mail-line"></i>
              <span>Tavsiye Et</span>
            </button>
            <button class="tab-button">
              <i class="ri-chat-3-line"></i>
              <span>Yorum Yaz</span>
            </button>
            <button class="tab-button">
              <i class="ri-notification-2-line"></i>
              <span>Fiyat Alarmı</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews -->
      <div class="w-full">
        <ProductsTab :product="product" />
      </div>
      <div>
        <h4 style="font-size: x-large">Benzer Ürünler</h4>
        <div class="border-b-[1px] pb-4"></div>
        <div
          class="w-full flex flex-wrap justify-start p-15 gap-5 mt-8"
          v-if="smilarProduct && smilarProduct.data && smilarProduct.data.length >= 0"
        >
          <div v-for="product in smilarProduct.data.slice(0, 14)" :key="product.id" class="flex justify-center">
            <ProductCardForDetails :product="product" />
          </div>
        </div>
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
import { getProductApi, getProductsApi } from '@/services/product.service'
import { updateCartItemApi } from '@/services/cart.service'
// stores
import store from '@/stores/master.store'
import { usePopupStore } from '@/stores/common.store'
import { getCategoryApi, getSubCategoryApi } from '@/services/category.service'
import ProductCardForDetails from '@/components/products/ProductCardForDetail.vue'
import authStore from '@/stores/auth.store'
import { updateUserApi } from '@/services/user.service'

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
const smilarProduct = ref({})
const typeSelected = ref(null)
const quantity = ref(1)
const cart = ref({})
const hovering = ref(false)
cart.value = store.state.cart

const getProduct = async () => {
  try {
    const res = await getProductApi(route.params.id)
    product.value = res.data.data
    const resForSimilar = await getProductsApi({ subCategoryId: product.value.data.subCategoryId })
    smilarProduct.value = resForSimilar.data.data
    console.log('halla halla', smilarProduct.value)
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
    res = await updateCartItemApi(cart.value._id, {
      items: [
        {
          product: product.value.data.id,
          quantity: quantity.value,
        },
      ],
    })
    store.dispatch('updateCart', res.data.data.data)
    toast.success('Ürün Sepetinize Eklendi')
  } catch (error) {
    console.log(error)
    toast.error('Sepete Ekleme Başarısız')
  }
}

const isFavorite = ref(false)

const toggleFavorite = async () => {
  const userId = authStore.state.user._id
  const productId = product.value._id
  isFavorite.value = !isFavorite.value

  if (isFavorite.value) {
    const res = await updateUserApi(userId, {
      $push: { favoriteItems: productId },
    })
    authStore.state.user.favoriteItems = res.data.data.data.favoriteItems
  } else {
    const res = await updateUserApi(userId, {
      $pull: { favoriteItems: productId },
    })
    authStore.state.user.favoriteItems = res.data.data.data.favoriteItems
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
  gap: 10px;
  flex-wrap: wrap;
}

.tab-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 110px; /* Buton genişliği */
  height: 110px; /* Buton yüksekliği */
  padding: 10px;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
  text-align: center;
}

.tab-button i {
  font-size: 24px; /* İkon boyutu */
  margin-bottom: 5px; /* İkon ile metin arası boşluk */
}

.tab-button span {
  font-size: 14px; /* Metin boyutu */
}

.tab-button:hover {
  background-color: #f5f5f5;
}

.tab-button:focus {
  outline: none;
}

.tab-button.active {
  background-color: #e0e0e0;
}
</style>
