<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref } from 'vue'
import { AuthStore } from '@/stores/auth.store'
import ModalProfile from '@/components/profiles/ModalProfile.vue'
import SearchWrapper from '@/components/search/SearchWrapper.vue'
import CartModal from '../products/CartModal.vue'
import HeaderBottom from './HeaderBottom.vue'
const authStore = AuthStore.value
const sss = localStorage.getItem('access_token')
console.log(authStore, sss)

const modal = ref({
  changeAvatar: false,
  showCart: false,
})
const closeModalCart = () => {
  console.log('closeModalCart')
  modal.value.showCart = false
}
</script>
<template>
  <div class="fixed top-0 left-0 z-50 border-b-[1px] w-full bg-white gb-shadow flex flex-col">
    <!-- top line -->
    <div class="max-md:h-[45px] h-[35px] w-full bg-[#f9f9f9] flex justify-between px-3 items-center">
      <div class="text-center">
        <span style="margin-left: 60ch"></span>
        <strong><a href="/siparislerim">Siparişlerim</a></strong>
        <span style="margin-right: 3ch"></span>
        <strong><a href="/kargo-takibi">Kargo Takibi</a></strong>
        <span style="margin-right: 3ch"></span>
        <strong><a href="/hakkimizda">Hakkımızda</a></strong>
        <span style="margin-right: 3ch"></span>
        <strong><a href="/iletisim">İletişim</a></strong>
        <span style="margin-right: 3ch"></span>
        <strong><a href="/iletim-formu">İletişim Formu</a></strong>
        <span style="margin-right: 3ch"></span>
        <strong><a href="/fiyat-listesi">Fiyat Listesi</a></strong>
        <span style="margin-right: 3ch"></span>
        <strong><a href="/blog">Blog</a></strong>
        <span style="margin-right: 3ch"></span>
        <strong><a href="/videolar">Videolar</a></strong>
        <span style="margin-right: 3ch"></span>
      </div>
    </div>
    <!-- end top line -->

    <!-- bottom line -->
    <div class="py-3 flex justify-between w-full items-center px-10" style="flex: 1 1 auto">
      <!-- flex-auto -->
      <RouterLink to="/" class="font-bold text-lg mr-5"
        >ALKANLAR<span class="underlined underline-mask">STORE</span></RouterLink
      >
      <SearchWrapper class="max-md:hidden" />
      <div class="flex">
        <div v-if="authStore.isLoggedIn === false" class="flex gap-3">
          <router-link to="/users/login">
            <button class="border-[#5a4098] border-[1px] h-[30px] px-3 rounded-[4px] font-base text-sm">Sign in</button>
          </router-link>
          <router-link to="/register">
            <button
              class="bg-[#5a4098] border-[#5a4098] text-white border-[1px] h-[30px] px-3 rounded-[4px] font-base text-sm"
            >
              Sign up
            </button>
          </router-link>
        </div>
        <div v-if="authStore.isLoggedIn === true" class="ml-3 flex gap-5 items-center">
          <!-- tool left -->
          <router-link
            v-if="authStore.user.role === 'admin'"
            to="/dashboard/create-product"
            class="max-md:hidden border-[1px] bg-[#5a4098] text-white cursor-pointer hover:shadow-lg border-[#5a4098] py-1 px-2 rounded-md"
          >
            <i class="ri-add-line"></i>
            <span class="whitespace-nowrap">New post</span>
          </router-link>
          <div class="relative">
            <div
              class="absolute -right-3 -top-2 bg-rose-600 text-white w-5 h-5 rounded-full flex justify-center items-center"
            >
              2
            </div>
            <i class="cursor-pointer ri-shopping-cart-line text-xl" @click.stop="modal.showCart = true"></i>
            <CartModal v-show="modal.showCart" v-touch-outside="closeModalCart" @close="closeModalCart" />
          </div>
          <div class="cursor-pointer">
            <i class="ri-heart-line text-xl"></i>
          </div>
          <ModalProfile />
          <!-- end tool left -->
        </div>
      </div>
    </div>
    <HeaderBottom />
  </div>
</template>
