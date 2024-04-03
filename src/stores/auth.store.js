/* eslint-disable no-unused-vars */
import { defineStore } from 'pinia'

export const AuthStore = defineStore('auth', () => {
  const state = {
    user: null,
    isLoggedIn: false,
  }

  const setUser = (userData) => {
    state.user = userData
  }

  return {
    state,
    actions: {
      setUser,
    },
  }
})
export const startAuthStore = async (res) => {
  if (localStorage.getItem('access_token')) {
    try {
      const data = res
      AuthStore.setUser(data)
      AuthStore.state.isLoggedIn = true
      console.log('initAuthStore', AuthStore.state)
    } catch (error) {
      console.error('Error fetching user information:', error)
      localStorage.removeItem('access_token')
      AuthStore.state.user = null
      AuthStore.state.isLoggedIn = false
      window.location.reload()
    }
  } else {
    AuthStore.state.user = null
    AuthStore.state.isLoggedIn = false
    return // Oturum kapalı olduğunda fonksiyonu sonlandır
  }
}

// refactor user store

// export const useAuthStore = defineStore('auth', () => {
//   const state = ref({
//     user: null,
//     isLoggedIn: false,
//   })

//   const setAuthStore = (data) => {
//     state.value = data
//   }
//   return {
//     state,
//     setAuthStore,
//   }
// })
