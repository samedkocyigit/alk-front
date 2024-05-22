<template>
  <div class="max-lg:hidden w-[270px] min-w-[270px]">
    <div class="fixed flex flex-col left-0 top-40 h-[calc(100vh-90px)] w-[270px] bg-white border-r-2 z-[1]">
      <!-- header info -->
      <div class="flex p-4 border-b-[1px] mt-10">
        <img class="w-[40px] h-[40px] rounded-full" src="@@/images/avatar-default.jpg" alt="" />
        <div class="flex flex-col ml-3">
          <span class="text-base font-bold">{{ authStore.user.name }}</span>
          <span class="text-xs text-primary-200">
            <span class="ml-1">{{ authStore.user.email }}</span>
          </span>
        </div>
      </div>
      <!-- end header info -->
      <!-- menu -->
      <div v-if="authStore.user.role === 'admin'" class="flex flex-col justify-between flex-auto gap-3 px-5 py-5 pb-1">
        <!-- <span class="font-semibold text-lg text-[#5a4098]"><i class="ri-home-line"></i> Dashboard</span> -->
        <div class="flex flex-col gap-2 text-base text-primary-200">
          <!-- Create New Product -->
          <div class="cursor-pointer flex items-center" @click="toggleProductMenu">
            <i class="ri-shopping-bag-3-fill text-2xl ml-2"></i> Create New Items
          </div>
          <!-- Product Menu -->
          <div v-if="showProductMenu" class="mt-3">
            <RouterLink
              v-for="(item, index) in productMenuItems"
              :key="index"
              :to="item.route"
              :class="{ 'bg-secondary-100  text-white': tabRoute[0] === item.route.name }"
              class="px-2 py-1 rounded-md flex items-center ml-5"
            >
              <i :class="item.iconClass + ' text-2xl mr-3'"></i>{{ item.label }}
            </RouterLink>
          </div>

          <!-- Manage Products -->
          <RouterLink
            to="/dashboard/manage-product"
            :class="{ 'bg-secondary-100  text-white': tabRoute[1] === route.name }"
            class="px-2 py-1 rounded-md flex items-center"
          >
            <i class="ri-handbag-fill text-2xl mr-3"></i>Manage Products
          </RouterLink>

          <!-- My Profile -->
          <RouterLink
            to="/dashboard/profile-settings"
            :class="{ 'bg-secondary-100  text-white': tabRoute[2] === route.name }"
            class="px-2 py-1 rounded-md flex items-center"
          >
            <i class="ri-user-fill text-2xl mr-3"></i>Your Profile
          </RouterLink>

          <!-- Setting Account -->
          <span class="px-2 py-1 rounded-md flex items-center"
            ><i class="ri-settings-2-fill text-2xl mr-3"></i>Setting Account</span
          >
          <button
            class="flex items-center py-2 rounded-md hover:bg-[#f1f1f1] px-2 font-semibold text-base text-primary-200"
            @click="logout"
          >
            Logout <i class="ri-logout-box-r-line"></i>
          </button>
        </div>
      </div>
      <div v-else class="flex flex-col justify-between flex-auto gap-3 px-5 py-5 pb-1">
        <div class="flex flex-col gap-2 text-base text-primary-200">
          <!-- My Profile -->
          <RouterLink
            to="/dashboard/profile-settings"
            :class="{ 'bg-secondary-100  text-white': tabRoute[2] === route.name }"
            class="px-2 py-1 rounded-md flex items-center"
          >
            <i class="ri-user-fill text-2xl mr-3"></i>Üye Bilgilerim
          </RouterLink>

          <!-- Setting Account -->
          <span class="px-2 py-1 rounded-md flex items-center"
            ><i class="ri-handbag-fill text-2xl mr-3"></i>Siparişlerim</span
          >
          <RouterLink to="/checkout" class="px-2 py-1 rounded-md flex items-start">
            <i class="ri-shopping-cart-line text-2xl mr-3"></i>Sepetim
          </RouterLink>
          <RouterLink to="/dashboard/favorite-items" class="px-2 py-1 rounded-md flex items-center">
            <i class="ri-heart-line text-2xl mr-3"></i>Favori Ürünlerim
          </RouterLink>
          <span class="flex gap-2 py-2 px-2 mt-2 hover:bg-slate-100 rounded-lg cursor-pointer" @click="logout"
            >Logout <i class="ri-logout-box-r-line"></i
          ></span>
        </div>
      </div>

      <!-- end menu -->
    </div>
  </div>
</template>
<script setup>
// eslint-disable-next-line no-unused-vars
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
import { AuthStore } from '@/stores/auth.store'
import { logoutApi } from '@/services/auth.service'
const authStore = AuthStore.value
const tabRoute = ref(['create-product', 'manage-product', 'profile-settings'])

const productMenuItems = [
  { label: 'Create new product', route: '/dashboard/create-product', iconClass: 'ri-add-line' },
  { label: 'Create new brand', route: '/dashboard/create-brand', iconClass: 'ri-add-line' },
  { label: 'Create new campaign', route: '/dashboard/create-campaign', iconClass: 'ri-add-line' },
  { label: 'Update campaign', route: '/dashboard/update-campaign', iconClass: 'ri-add-line' },
  { label: 'Create new category', route: '/dashboard/create-category', iconClass: 'ri-add-line' },
]

const showProductMenu = ref(false)

const toggleProductMenu = () => {
  showProductMenu.value = !showProductMenu.value
}

const logout = async () => {
  await logoutApi()
  localStorage.removeItem('access_token')
  authStore.isLoggedIn = false
  authStore.user = null
  window.location.href = '/'
}
</script>
