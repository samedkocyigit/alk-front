import { ref } from 'vue'

export const AuthStore = ref({
  user: null,
  isLoggedIn: false,
})

export const loginAuthStore = async (userData) => {
  const authStore = AuthStore.value
  authStore.user = userData
  authStore.isLoggedIn = true
}
export const logoutAuthStore = async () => {
  const authStore = AuthStore.value
  localStorage.removeItem('access_token')
  authStore.user = null
  authStore.isLoggedIn = false
}

export const startAuthStore = async () => {
  const authStore = AuthStore.value
  if (localStorage.getItem('access_token')) {
    // Eğer access_token varsa, kullanıcı oturumu açıktır
    try {
      // localStorage'den kullanıcı bilgilerini al
      const userData = localStorage.getItem('user')
      if (userData !== null) {
        authStore.user = JSON.parse(userData)
        authStore.isLoggedIn = true
      } else {
        // Kullanıcı bilgileri localStorage'da bulunamadı
        console.warn('User data not found in localStorage')
        // Gerekli işlemleri yap
        authStore.user = null
        authStore.isLoggedIn = false
        // window.location.reload() gibi bir işlem de yapılabilir
      }
    } catch (error) {
      console.error('Error fetching user information:', error)
      // Hata durumunda gerekli işlemleri yap
      localStorage.removeItem('access_token')
      authStore.user = null
      authStore.isLoggedIn = false
      window.location.reload()
    }
  } else {
    // Eğer access_token yoksa, kullanıcı oturumu kapalıdır
    authStore.user = null
    authStore.isLoggedIn = false
  }
}
