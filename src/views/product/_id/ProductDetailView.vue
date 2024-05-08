<template>
  <div class="flex w-full px-5 pt-7 justify-center gap-5">
    <div class="flex w-full flex-col gap-5 max-w-[1200px] max-[1254px]:w-full h-fit rounded-[8px] justify-center py-5">
      <div class="w-full mt-10">
        <BreadCrumb :routes="routes" />
      </div>
      <!-- detail -->
      <div class="max-md:flex-col w-full flex gap-10">
        <!-- thumbnail -->
        <ThumbnailsProduct :current-type="typeSelected" :product="product" />
        <div class="flex-auto">
          <h1 class="text-xl font-bold mb-2">{{ product.data.name }}</h1>
          <span class="text-primary-200">
            <i class="ri-star-fill text-[#ffaa28]"></i>
            <span class="ml-2 mr-1">{{ product.data.ratingsAverage }}</span>
            <span>|</span>
            <span class="ml-1">sold {{ product.data.ratingsQuantity }}</span>
          </span>
          <div class="text-xl font-semibold mt-3">
            <span>{{ product.data.price + ' TL' }} </span>
          </div>
          <!-- <div class="border-b-[1px] pb-4"></div> -->
          <div class="mt-4">
            <!-- <p class="text-lg text-gray-800 font-medium">
              Kategori: <span class="text-base font-light">{{ product.data.category_name }}</span>
            </p> -->
            <div class="flex gap-2 mt-2">
              <!-- <div
                v-for="productType in product.types"
                :key="productType.id"
                :class="{ 'bg-primary-300': typeSelected === productType }"
                class="flex px-4 py-1 border-[1px] rounded-md cursor-pointer hover:bg-primary-300"
                @click="chooseType(productType)"
              >
                {{ productType.name }}
              </div> -->
            </div>
          </div>
          <!-- detail -->
          <div class="border-b-[1px] pb-4"></div>
          <p class="text-lg text-gray-800 font-medium mt-4">Details:</p>
          <div v-html="product.data.summary"></div>
        </div>
        <!-- add to card -->
        <div class="max-md:w-full min-w-[300px] w-[300px] h-fit p-5 border-[1px] rounded-lg">
          <div class="border-b-[1px] pb-4"></div>
          <div class="mt-4 flex justify-between items-center">
            <span>{{ 'Stok Kodu: ' + product.data.stock_code }}</span>
          </div>
          <div class="mt-4 flex justify-between items-center">
            <span>{{ 'Üretici: ' + product.data.brand.name }}</span>
          </div>
          <div class="mt-4 flex justify-between items-center">
            <p>Adet</p>
            <ANumberInput v-model="quantity" :max="20" />
          </div>
          <div class="mt-4 flex justify-between items-center">
            <p>Sub total</p>
            <p class="font-bold text-lg">{{ product.data.price * quantity }} TL</p>
          </div>
          <p class="text-rose-500">{{ errValidate?.cart }}</p>
          <div
            class="cursor-pointer text-third-100 border-third-100 border-[2px] py-2 flex gap-3 justify-center rounded-md mt-5"
            @click="addItemToCart"
          >
            <i class="ri-shopping-cart-2-line"></i> Add to cart
          </div>
          <div
            class="cursor-pointer text-white bg-third-100 py-3 flex gap-3 justify-center rounded-md mt-4"
            @click="buyNow"
          >
            Buy now
          </div>
          <div class="flex justify-center mt-4 items-center gap-5 font-medium">
            <p><i class="ri-heart-line"></i> Wish list</p>
            <div class="w-[1px] h-7 bg-slate-200"></div>
            <p><i class="ri-share-line"></i> Share</p>
          </div>
        </div>
      </div>
      <!-- end detail -->
      <!-- detail shop -->
      <div class="w-full">
        <div class="border-b-[1px] pb-4"></div>
        <ShopDetail :shop="shopDetail" />
        <div class="border-b-[1px] pb-4"></div>
      </div>
      <!-- reviews -->
      <div class="w-full">
        <ReviewContainer />
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
import ShopDetail from '@/components/profiles/ShopDetail.vue'
import ReviewContainer from '@/components/reviews/index.vue'
// services
import { getProductApi } from '@/services/product.service'
import { addToCartApi } from '@/services/cart.service'
// stores
// import { addToCart, useMasterStore } from '@/stores/master.store'
import store from '@/stores/master.store'
import { usePopupStore } from '@/stores/common.store'
const popupStore = usePopupStore()
import { getBrandApi } from '@/services/brand.service'
import { getCategoryApi, getSubCategoryApi } from '@/services/master.service'
const route = useRoute()
const router = useRouter()
// breadcrumb
const routes = ref([
  {
    name: 'Home',
    path: '/',
  },
])

const product = ref({})
const shopDetail = ref({})
const typeSelected = ref(null)
const photoName = ref('')
const quantity = ref(1)
const cart = ref({})
cart.value = store.state.cart
// const priceComputed = computed(() => {
//   return typeSelected.value
//     ? {
//         price: typeSelected.value.price,
//       }
//     : {
//         min: product.value.types[0]?.price,
//         max: product.value.types[product.value.types.length - 1]?.price,
//       }
// })

const getProduct = async () => {
  try {
    const res = await getProductApi(route.params.id)
    product.value = res.data.data
    console.log('product brand', product.value.data.brand)
    shopDetail.value = product.value.data.brand

    // // Kategori ve alt kategori bilgilerini bulma
    const routeCategory = await getCategoryApi(product.value.data.categoryId)
    const categoryPath = `/category/${routeCategory.data.data.data.slug}`
    const category_name = routeCategory.data.data.data.category_name
    const routeSubCategory = await getSubCategoryApi(product.value.data.categoryId, product.value.data.subCategoryId)
    const subCategoryPath = `/category/${routeCategory.data.data.data.slug}/sub_category/${routeSubCategory.data.data.subCategory.slug}`
    const subCategory_name = routeSubCategory.data.data.subCategory.sub_category_name

    // Routes'a kategori, alt kategori ve ürün bilgilerini ekleme
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

// const chooseType = (type) => {
//   if (typeSelected.value === type) {
//     typeSelected.value = null
//     return
//   }
//   typeSelected.value = type
// }
onBeforeMount(async () => {
  try {
    await getProduct()
    photoName.value = product.value.data.photos[0]
  } catch (error) {
    console.log(error)
  }
})
// const getUser = async () => {
//   const res = await userStore.getUser(product.value.userId)
//   shopDetail.value = res
// }

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
    store.dispatch('addToCart', res.data.data.data)
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
