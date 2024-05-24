import { createStore } from 'vuex'
import { getCategoriesApi } from '@/services/category.service'
import { getBrandsApi } from '@/services/brand.service'
import { getSlidersApi } from '@/services/slider.service'

const store = createStore({
  state: {
    categories: [],
    brands: [],
    sliders: [],
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
    setSliders(state, sliders) {
      state.sliders = sliders
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
    async initSliders({ commit }) {
      try {
        const { data } = await getSlidersApi()
        commit('setSliders', data.data)
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
        commit('setUserCart', cart)
      } catch (error) {
        console.error('cartConvert Hata:', error)
      }
    },
  },
})

export default store
