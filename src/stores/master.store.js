// // refactor user store
// import { ref } from 'vue'
// import { getCategoriesApi } from '@/services/master.service'
// import { getCartApi } from '@/services/cart.service'

// export const useMasterStore = ref({
//   categories: [],
//   products: [],
//   cart: {
//     items: [],
//     totalPrice: 0,
//   },
// })

// export const inittCategories = async () => {
//   try {
//     const masterStore = useMasterStore.value
//     const { data } = await getCategoriesApi()
//     masterStore.categories = data.data
//   } catch (error) {
//     console.error('initCategories Hata:', error)
//   }
// }

// export const setProducts = (data) => {
//   const masterStore = useMasterStore.value

//   masterStore.products = data
// }

// export const addToCart = async (data) => {
//   const masterStore = useMasterStore.value
//   const res = await getCartApi(data)
//   masterStore.cart.items = res.data.data.data.items
// }

// export const removeFromCart = (id) => {
//   const masterStore = useMasterStore.value

//   masterStore.cart.items = masterStore.cart.items.filter((item) => item.id !== id)
// }

// export const initCart = async (cart) => {
//   const masterStore = useMasterStore.value
//   console.log('neymiş bu cart ', cart, cart._id)
//   const { data } = await getCartApi(cart._id)
//   masterStore.cart = data
//   console.log('master flan filan', masterStore)
// }
// // refactor user store
import { getCartApi } from '@/services/cart.service'
import { createStore } from 'vuex'
import { getCategoriesApi } from '@/services/category.service'
import { getBrandsApi } from '@/services/brand.service'

const store = createStore({
  state: {
    categories: [],
    brands: [],
    cart: {
      items: [], // Her bir öğe için { product: {}, quantity: 0 } şeklinde olacak
      totalPrice: 0,
    },
  },
  mutations: {
    setCategories(state, categories) {
      state.categories = categories
    },
    setBrands(state, brands) {
      state.brands = brands
    },
    setCart(state, cart) {
      state.cart = cart
    },
    setUserCart(state, cart) {
      state.cart = cart
    },
    removeFromCart(state, id) {
      state.cart.items = state.cart.items.filter((item) => item.product._id !== id)
    },
  },
  actions: {
    async initCategories({ commit }) {
      try {
        const { data } = await getCategoriesApi()
        commit('setCategories', data.data)
      } catch (error) {
        console.error('initCategories Hata:', error)
      }
    },
    async initBrands({ commit }) {
      try {
        const { data } = await getBrandsApi()
        commit('setBrands', data.data)
      } catch (err) {
        console.log('setBrands Hatası', err)
      }
    },
    async updateCart({ commit }, cart) {
      commit('setCart', cart)
    },
    async initCart({ commit }, cart) {
      commit('setCart', cart)
    },
    async cartConvert({ commit }, cart) {
      try {
        // const { data } = await getCartApi(cart._id)
        // Her bir ürün için addToCart mutasyonunu kullanarak kartı güncelle
        commit('setUserCart', cart)
      } catch (error) {
        console.error('cartConvert Hata:', error)
      }
    },
  },
})

export default store
