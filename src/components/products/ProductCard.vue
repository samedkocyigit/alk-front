<script setup>
// props olarak gelen product bilgisini al
import { defineProps, ref, onMounted } from 'vue'
import LazyImg from '../commons/atoms/LazyImg.vue'
// import { addToCart, useMasterStore } from '@/stores/master.store'
import { addToCartApi } from '@/services/cart.service'
import { toast } from 'vue3-toastify'
import store from '@/stores/master.store'
import { AuthStore } from '@/stores/auth.store'
import { updateUserApi } from '@/services/user.service'
const authStore = AuthStore.value

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
const isFavorite = ref(false)
const hovering = ref(false)

// Bileşen yüklendiğinde fotoğraf adını consola yazdır
onMounted(() => {
  photoName.value = props.product.photos[0]
  console.log('Fotoğraf Adı:', props.product.photos[0])
})

const toggleFavorite = async () => {
  const userId = authStore.user._id
  const productId = props.product._id
  isFavorite.value = !isFavorite.value
  if (isFavorite.value) {
    await updateUserApi(userId, {
      $push: { favoriteItems: productId },
    })
  } else {
    await updateUserApi(userId, {
      $pull: { favoriteItems: productId },
    })
  }
}
const addItemToCart = async () => {
  try {
    const res = await addToCartApi(store.state.cart._id, {
      items: [
        {
          product: props.product.id,
          quantity: 1,
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
</script>

<template>
  <div
    class="container"
    :class="`flex flex-col h-[330px] overflow-hidden product-card-shadow bg-white rounded-xl ${width}`"
  >
    <div
      v-if="authStore.isLoggedIn === false"
      class="fav-icon-container"
      @mouseover="hovering = true"
      @mouseleave="hovering = false"
      @click="toggleFavorite"
    >
      <router-link to="/users/login">
        <i
          class="ri-heart-line"
          :class="{ 'ri-heart-fill': isFavorite, 'text-yellow-500': isFavorite }"
          :title="hovering ? 'Favorilere Ekle' : ''"
        ></i>
      </router-link>
    </div>
    <div v-else class="fav-icon-container" @click="toggleFavorite">
      <i
        class="ri-heart-line"
        :class="{ 'ri-heart-fill': isFavorite, 'text-yellow-500': isFavorite }"
        :title="hovering ? 'Favorilere Ekle' : ''"
      ></i>
    </div>
    <RouterLink :to="`/products/${product.id}`">
      <LazyImg class-style="h-[160px] object-cover w-full" :src="`./images/products/${photoName}`" alt="" />
    </RouterLink>
    <div class="product-info">
      <div>
        <p class="product-name">{{ product.name }}</p>
        <p class="product-price" v-if="product.price">{{ product.price }} TL</p>
        <p class="product-price" v-else-if="product?.maxPrice != undefined && product?.minPrice != undefined">
          {{ product?.minPrice }} - ${{ product?.maxPrice }} TL
        </p>
        <div class="product-category">
          <i class="ri-map-pin-2-fill"></i>
          <span class="category-name">{{ product.brand.name }}</span>
        </div>
        <div class="product-ratings">
          <i class="ri-star-fill text-[#ffaa28]"></i>
          <span class="ratings-info">{{ product.ratingsAverage }} | sold {{ product.ratingsQuantity }}</span>
        </div>
      </div>
      <div class="add-to-cart-button">
        <button class="add-to-cart-btn" @click="addItemToCart">Sepete Ekle</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
}

.fav-icon-container {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 1;
}

.fav-icon-container i {
  cursor: pointer;
  font-size: 24px;
  transition: color 0.3s ease;
}

.fav-icon-container i.ri-heart-fill {
  color: #ffcc00;
}
.fav-icon-container:hover {
  color: #ffcc00;
}

.product-info {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 150px;
  flex-grow: 1;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #363636;
  margin-bottom: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.product-price {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
}

.product-category,
.product-ratings {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #718096;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-name {
  margin-left: 4px;
}

.ratings-info {
  margin-left: 4px;
}

.add-to-cart-button {
  margin-top: auto;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: auto;
}

.add-to-cart-btn {
  background-color: #5a4098;
  bottom: 0;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-to-cart-btn:hover {
  background-color: #108de0;
}
</style>
