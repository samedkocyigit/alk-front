/* eslint-disable no-unused-vars */
import router from '.'
import { AuthStore, startAuthStore } from '@/stores/auth.store'
export const authMiddleware = () => {
  router.beforeEach((to, from, next) => {
    const authStore = AuthStore
    const isLoggedIn = localStorage.getItem('access_token')
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!isLoggedIn) {
        return next({ name: 'login' })
      } else {
        // handle logged in user permission
        const user = authStore.state.user
        if (!user) {
          // Kullanıcı bilgisi henüz yüklenmediyse, başlatma işlemini bekleyin
          startAuthStore().then(() => {
            const userRole = authStore.state.user.role
            if (to.meta.roles && !to.meta.roles.includes(userRole)) {
              console.log('403')
              return next({ name: 'home' })
            }
            next()
          })
        } else {
          const userRole = user.role
          if (to.meta.roles && !to.meta.roles.includes(userRole)) {
            console.log('403')
            return next({ name: 'home' })
          }
          next()
        }
      }
    } else {
      if (isLoggedIn && to.name == 'login') {
        return next({ name: 'home' })
      }
      next()
    }
  })
}
// export const authMiddleware = () => {
//   router.beforeEach((to, from) => {
//     const authStore = AuthStore()
//     const isLoggedIn = localStorage.getItem('access_token')
//     if (to.matched.some((record) => record.meta.requiresAuth)) {
//       if (!isLoggedIn) {
//         return { name: 'login' }
//       } else {
//         // handle logged in user permission
//         const user = authStore.state.user
//         const userRole = user.role
//         if (to.meta.roles && !to.meta.roles.includes(userRole)) {
//           console.log('403')
//           return { name: 'home' }
//         }
//       }
//     } else {
//       if (isLoggedIn && to.name == 'login') {
//         return { name: 'home' }
//       }
//     }
//     console.log('next')
//   })
// }
