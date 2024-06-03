// import { ref } from 'vue'

// export const AuthStore = ref({
//   user: null,
//   isLoggedIn: false,
// })

// export const loginAuthStore = async (userData) => {
//   const authStore = AuthStore.value
//   authStore.user = userData
//   authStore.isLoggedIn = true
// }
// export const logoutAuthStore = async () => {
//   const authStore = AuthStore.value
//   localStorage.removeItem('access_token')
//   authStore.user = null
//   authStore.isLoggedIn = false
// }

// export const startAuthStore = async () => {
//   const authStore = AuthStore.value
//   if (localStorage.getItem('access_token')) {
//     // Eğer access_token varsa, kullanıcı oturumu açıktır
//     try {
//       // localStorage'den kullanıcı bilgilerini al
//       const userData = localStorage.getItem('user')
//       if (userData !== null) {
//         authStore.user = JSON.parse(userData)
//         authStore.isLoggedIn = true
//       } else {
//         // Kullanıcı bilgileri localStorage'da bulunamadı
//         console.warn('User data not found in localStorage')
//         // Gerekli işlemleri yap
//         authStore.user = null
//         authStore.isLoggedIn = false
//         // window.location.reload() gibi bir işlem de yapılabilir
//       }
//     } catch (error) {
//       console.error('Error fetching user information:', error)
//       // Hata durumunda gerekli işlemleri yap
//       localStorage.removeItem('access_token')
//       authStore.user = null
//       authStore.isLoggedIn = false
//       window.location.reload()
//     }
//   } else {
//     // Eğer access_token yoksa, kullanıcı oturumu kapalıdır
//     authStore.user = null
//     authStore.isLoggedIn = false
//   }
// }

// store.js
import { createStore } from 'vuex'

const authStore = createStore({
  state: {
    user: null,
    isLoggedIn: false,
  },
  mutations: {
    SET_USER(state, userData) {
      console.log('userData', userData)
      state.user = userData
      console.log('userData2', state.user)
    },
    SET_IS_LOGGED_IN(state, status) {
      console.log('status', status)
      state.isLoggedIn = status
      console.log('status2', state.isLoggedIn)
    },
    LOGOUT(state) {
      state.user = null
      state.isLoggedIn = false
    },
  },
  actions: {
    async loginAuthStore({ commit }, userData) {
      console.log('userData', userData)
      commit('SET_USER', userData)
      commit('SET_IS_LOGGED_IN', true)
    },
    async logoutAuthStore({ commit }) {
      localStorage.removeItem('access_token')
      commit('LOGOUT')
    },
    async startAuthStore({ commit }) {
      if (localStorage.getItem('access_token')) {
        try {
          const userData = localStorage.getItem('user')
          if (userData !== null) {
            commit('SET_USER', JSON.parse(userData))
            commit('SET_IS_LOGGED_IN', true)
          } else {
            console.warn('User data not found in localStorage')
            commit('LOGOUT')
          }
        } catch (error) {
          console.error('Error fetching user information:', error)
          localStorage.removeItem('access_token')
          commit('LOGOUT')
          window.location.reload()
        }
      } else {
        commit('LOGOUT')
      }
    },
  },
})

export default authStore
