import { createApp } from 'vue'
import router from '@/router'
import App from './App.vue'
import '../public/css/tailwind.css'
import '../public/css/global.css'
import { createPinia } from 'pinia'
import { initMasterStore } from '@/stores'
import { initAuthStore } from '@/stores'
import { authMiddleware } from '@/router/router.middleware'
// components
import LazyImg from './components/commons/atoms/LazyImg.vue'
import defaultLayout from '@/layouts/defaultLayout.vue'
import dashboardLayout from '@/layouts/dashboardLayout.vue'
import emptyLayout from '@/layouts/emptyLayout.vue'
import touchOutSide from '@/plugins/handleClick'
import 'remixicon/fonts/remixicon.css'
import ACustomPopup from '@/components/commons/atoms/ACustomPopup.vue'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
// import { startAuthStore } from './stores/auth.store'

const initApp = async () => {
  const pinia = createPinia()
  const app = createApp(App)
  app.use(pinia)
  await initMasterStore()
  await initAuthStore()
  app.use(router)
  authMiddleware()
  app.use(touchOutSide)
  app.component('DefaultLayout', defaultLayout)
  app.component('EmptyLayout', emptyLayout)
  app.component('DashboardLayout', dashboardLayout)
  app.component('ACustomPopup', ACustomPopup)
  app.component('LazyImg', LazyImg)
  app.use(Vue3Toastify, {
    position: 'top-center',
    duration: 3000,
  })

  await router.isReady()

  console.log('Router ready')
  app.mount('#app', true)
}
initApp()
