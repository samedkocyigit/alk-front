<script setup>
import { ref, computed } from 'vue'
import ModalProfile from '@/components/profiles/ModalProfile.vue'
import SearchWrapper from '@/components/search/SearchWrapper.vue'
import CartModal from '../products/CartModal.vue'
import HeaderBottom from './HeaderBottom.vue'
import store from '@/stores/master.store'
import authStore from '@/stores/auth.store'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const modal = ref({
  changeAvatar: false,
  showCart: false,
})

let closeModalTimer = null

const openCartModal = () => {
  clearTimeout(closeModalTimer)
  if (route.path !== '/checkout') {
    modal.value.showCart = true
  }
}

const closeCartModal = () => {
  closeModalTimer = setTimeout(() => {
    modal.value.showCart = false
  }, 200)
}

const goToCheckout = () => {
  router.push('/checkout')
}
const totalQuantity = computed(() => {
  if (!store.state.cart || !store.state.cart.items) {
    return 0
  }

  // Tüm quantity değerlerini topla
  return store.state.cart.items.reduce((total, item) => total + item.quantity, 0)
})
const handleMouseLeave = (event) => {
  const cartIcon = event.currentTarget
  const cartModal = document.querySelector('.cart-modal')

  if (!cartModal.contains(event.relatedTarget) && !cartIcon.contains(event.relatedTarget)) {
    closeCartModal()
  }
}
</script>

<template>
  <div class="nav-bar">
    <div class="header">
      <div class="container">
        <nav>
          <ul class="menu">
            <li>
              <a href="/siparislerim"> Siparişlerim </a>
            </li>
            <li>
              <a href="/kargo-takibi">Kargo Takibi</a>
            </li>
            <li>
              <a href="/hakkimizda">Hakkımızda</a>
            </li>
            <li>
              <a href="/iletisim">İletişim</a>
            </li>
            <li>
              <a href="/iletim-formu">İletişim Formu</a>
            </li>
            <li>
              <a href="/fiyat-listesi">Fiyat Listesi</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/videolar">Videolar</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- bottom line -->
    <div class="py-3 flex justify-between w-full items-center px-10" style="flex: 1 1 auto">
      <!-- flex-auto -->
      <div class="flex items-center">
        <div class="logo-container">
          <img src="../../../public/images/year.png" alt="" class="logo-img" />
        </div>
        <RouterLink to="/" class="font-bold text-lg ml-2">
          <div class="logo-container">
            <img src="../../../public/images/logo.png" alt="" class="logo-img" />
          </div>
        </RouterLink>
      </div>
      <SearchWrapper class="max-md:hidden mr-[250px]" />
      <div class="flex">
        <div v-if="authStore.state.isLoggedIn === false" class="flex gap-3">
          <router-link to="/users/login" class="cursor-pointer mt-1">
            <i class="ri-heart-line text-xl mr-5"></i>
          </router-link>

          <div class="relative right-5 top-1">
            <div
              v-if="store.state.cart && store.state.cart.items && store.state.cart.items.length > 0"
              class="absolute -right-3 -top-2 bg-rose-600 text-white w-5 h-5 rounded-full flex justify-center items-center"
            >
              {{ totalQuantity }}
            </div>

            <i
              class="cursor-pointer ri-shopping-cart-line text-xl"
              @click.stop="goToCheckout"
              @mouseover="openCartModal"
              @mouseleave="closeCartModal"
            ></i>
            <CartModal
              v-show="modal.showCart"
              v-touch-outside="closeCartModal"
              @mouseover="openCartModal"
              @mouseleave="closeCartModal"
              @close="closeCartModal"
              class="cart-modal"
            />
          </div>
          <router-link to="/users/login">
            <button class="border-[#5a4098] border-[1px] h-[30px] px-3 rounded-[4px] font-base text-sm">
              Giriş Yap
            </button>
          </router-link>
          <router-link to="/register">
            <button
              class="bg-[#5a4098] border-[#5a4098] text-white border-[1px] h-[30px] px-3 rounded-[4px] font-base text-sm"
            >
              Üye Ol
            </button>
          </router-link>
        </div>
        <div v-if="authStore.state.isLoggedIn === true" class="ml-3 flex gap-5 items-center">
          <!-- tool left -->
          <router-link
            v-if="authStore.state.user.role === 'admin'"
            to="/dashboard/create-product"
            class="max-md:hidden border-[1px] bg-[#5a4098] text-white cursor-pointer hover:shadow-lg border-[#5a4098] py-1 px-2 rounded-md"
          >
            <i class="ri-add-line"></i>
            <span class="whitespace-nowrap">New post</span>
          </router-link>
          <div class="relative">
            <div
              v-if="store.state.cart && store.state.cart.items && store.state.cart.items.length > 0"
              class="absolute -right-3 -top-2 bg-rose-600 text-white w-5 h-5 rounded-full flex justify-center items-center"
            >
              {{ totalQuantity }}
            </div>
            <i
              class="cursor-pointer ri-shopping-cart-line text-xl"
              @click.stop="goToCheckout"
              @mouseover="openCartModal"
              @mouseleave="closeCartModal"
            ></i>
            <CartModal
              v-show="modal.showCart"
              v-touch-outside="closeCartModal"
              @mouseover="openCartModal"
              @mouseleave="closeCartModal"
              @close="closeCartModal"
              class="cart-modal"
            />
          </div>
          <div class="cursor-pointer">
            <RouterLink to="/dashboard/favorite-items">
              <i class="ri-heart-line text-xl"></i>
            </RouterLink>
          </div>
          <ModalProfile />
          <!-- end tool left -->
        </div>
      </div>
    </div>
    <!-- header bottom  -->
    <div class="flex justify-between w-full items-center" style="flex: 1 1 auto">
      <div class="header-container">
        <HeaderBottom />
      </div>
    </div>
    <!-- end tool -->
  </div>
</template>

<style scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  border-bottom-width: 1px;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 2;
}
/* <!-- <div class="fixed top-0 left-0 z-50 border-b-[1px] w-full bg-white gb-shadow flex flex-col"> --> */
.logo-container {
  display: flex; /* Flexbox'u etkinleştir */
  align-items: center; /* Dikey hizalamayı ortala */
}

.logo-img {
  margin-right: 5px; /* İki resim arasına boşluk ekleyebilirsiniz */
}
.header-container {
  background: #5a4098;
  /* height: 65px; */
  width: 100vw;
  z-index: 3;
}
.header {
  background-color: #fff;
  color: #fff;
  height: 35px;
  padding: 10px 0;
  text-align: center;
}

.container {
  max-width: 960px;
  margin: 0 auto;
}

.menu {
  list-style-type: none;
  padding: 0;
}

.menu li {
  display: inline;
  margin-right: 20px;
}

.menu li:last-child {
  margin-right: 0;
}

.menu li a {
  color: #000;
  text-decoration: none;
  font-size: 14px;
}

.menu li a:hover {
  color: #f90; /* Hover durumunda farklı bir renk kullanabilirsiniz */
}
</style>
