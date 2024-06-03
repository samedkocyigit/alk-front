<script setup>
import { ref } from 'vue'
import authStore from '@/stores/auth.store'
import ModalInfo from './ModalInfo.vue'
import ModalChangePassword from './ModalChangePassword.vue'
import { logoutApi } from '@/services/auth.service'

const modal = ref({
  isShowSettings: false,
  isShowProfile: false,
  isShowChangePassword: false,
})

const closeModal = (type) => {
  modal.value[type] = false
  console.log('close')
}
const closeSettings = () => {
  modal.value.isShowSettings = false
}

// const logout = async () => {
//   localStorage.removeItem('access_token')
//   localStorage.removeItem('refresh_token')
//   authStore.isLoggedIn = false
//   authStore.user = null
//   window.location.href = '/'
// }
const logout = async () => {
  try {
    await logoutApi()
    localStorage.removeItem('access_token')
    authStore.dispatch('logoutAuthStore')
    window.location.href = '/'
  } catch (err) {
    console.log(err)
  }
}
</script>
<template>
  <ModalInfo v-if="modal.isShowProfile" @close="closeModal('isShowProfile')" />
  <ModalChangePassword v-if="modal.isShowChangePassword" @close="closeModal('isShowChangePassword')" />
  <div class="relative">
    <div class="flex items-center gap-2">
      <p>{{ authStore.state.user.name }}</p>
      <img
        src="@@/images/avatar-default.jpg"
        class="w-8 h-8 rounded-full object-cover cursor-pointer"
        alt=""
        @click.stop="modal.isShowSettings = !modal.isShowSettings"
      />
    </div>

    <!-- popup profiles -->
    <div
      v-show="modal.isShowSettings"
      v-touch-outside="closeSettings"
      class="absolute top-full right-2 w-[270px] bg-white gb-shadow rounded-xl z-[4]"
    >
      <div class="flex flex-col h-full p-4 px-2 pb-3">
        <!-- header -->
        <div class="flex gap-4 items-center border-b-[1px] pb-2 px-2">
          <img src="@@/images/avatar-default.jpg" class="w-8 h-8 rounded-full object-cover" alt="" />
          <div class="flex flex-col">
            <p class="">{{ authStore.state.user.name }}</p>
            <p class="text-xs">{{ authStore.state.user.email }}</p>
          </div>
        </div>
        <!-- end header -->

        <!-- body -->
        <div class="pb-2 border-b-[1px]">
          <RouterLink
            to="/dashboard/profile-settings"
            class="flex gap-2 py-2 px-2 mt-2 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <i class="ri-user-line"></i>
            <p>Hesabım</p>
          </RouterLink>
          <RouterLink
            to="/dashboard/manage-product"
            class="flex gap-2 py-2 px-2 mt-2 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <i class="ri-pass-pending-line"></i>
            <p>Siparişlerim</p>
          </RouterLink>
          <!-- <div class="flex gap-2 py-2 px-2 mt-2 hover:bg-slate-100 rounded-lg cursor-pointer">
            <i class="ri-qr-scan-2-line"></i>
            <p>Get shop QR link</p>
          </div>
          <div
            class="flex gap-2 py-2 px-2 mt-2 hover:bg-slate-100 rounded-lg cursor-pointer"
            @click="modal.isShowChangePassword = true"
          >
            <i class="ri-lock-line"></i>
            <p>Change password</p>
          </div> -->
        </div>
        <div class="flex gap-2 py-2 px-2 mt-2 hover:bg-slate-100 rounded-lg cursor-pointer" @click="logout">
          <i class="ri-login-box-line"></i>
          <p>Çıkış Yap</p>
        </div>
      </div>
    </div>
  </div>
</template>
