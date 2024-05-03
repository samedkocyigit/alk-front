<script setup>
// props olarak gelen product bilgisini al
import { defineProps, ref, onMounted } from 'vue'
import LazyImg from '../commons/atoms/LazyImg.vue'
// import { addToCart, useMasterStore } from '@/stores/master.store'
import { addToCartApi } from '@/services/cart.service'
import { toast } from 'vue3-toastify'
import store from '@/stores/master.store'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  width: {
    type: String,
    default: 'w-[180px]',
  },
})

const photoName = ref('') // Fotoğraf adı için bir referans oluştur

// Bileşen yüklendiğinde fotoğraf adını consola yazdır
onMounted(() => {
  photoName.value = props.product.photos[0]
  console.log('Fotoğraf Adı:', props.product.photos[0])
})

const addItemToCart = async () => {
  try {
    const res = await addToCartApi(store.state.cart._id, {
      items: props.product.id,
    })
    store.dispatch('addToCart', res.data.data.data)
    // addToCart(res.data.items)
    toast.success('Add to cart success')
  } catch (error) {
    console.log(error)
    toast.error('Add to cart fail')
  }
}
</script>

<template>
  <div :class="`flex flex-col h-[330px] overflow-hidden product-card-shadow bg-white rounded-xl ${width}`">
    <!-- <img :src="`./images/products/${photoName}`" alt="" /> -->
    <LazyImg class-style="h-[180px] object-cover w-full" :src="`./images/products/${photoName}`" alt="" />
    <div class="flex-auto p-3">
      <p class="text-sm font-semibold text-[#363636] truncate-2">{{ product.name }}</p>
      <p v-if="product.price" class="mt-1 font-bold text-lg">{{ product.price }} TL</p>
      <p v-if="product?.maxPrice != undefined && product?.minPrice != undefined" class="mt-1 font-bold text-lg">
        {{ product?.minPrice }} - ${{ product?.maxPrice }} TL
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
          <span class="ml-1">sold {{ product.ratingsQuantity }}</span>
        </span>
      </div>
      <div class="mt-2 text-center">
        <div class="inline-block">
          <button
            class="bg-[#5a4098] text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            @click="addItemToCart"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
