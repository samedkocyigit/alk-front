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
import { getCategoriesApi } from '@/services/master.service'

const store = createStore({
  state: {
    categories: [],
    cart: {
      items: [],
      totalPrice: 0,
    },
  },
  actions: {
    async initCategories() {
      try {
        const { data } = await getCategoriesApi()
        this.state.categories = data.data
      } catch (error) {
        console.error('initCategories Hata:', error)
      }
    },
    async addToCart({ commit }, data) {
      // const res = await getCartApi(data)
      this.state.cart = data
    },

    removeFromCart(id) {
      this.state.cart.items = this.state.cart.items.filter((item) => item.id !== id)
    },

    async initCart({ commit }, cart) {
      const { data } = await getCartApi(cart._id)
      this.state.cart = data.data.data
    },
    async cartConvert({ commit }, cart) {
      const { data } = await getCartApi(cart._id)
      console.log('aktarımdan önce ', data.data.data)
      this.state.cart = data.data.data
      console.log('cartConvert fonk içinde cart:', this.state.cart)
    },
  },
})
export default store
