// refactor user store
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCategoriesApi } from '@/services/master.service'
import { getCartApi } from '@/services/cart.service'

export const useMasterStore = ref({
  categories: [],
  products: [],
  cart: {
    items: [],
    totalPrice: 0,
  },
})

export const initCategories = async () => {
  try {
    const masterStore = useMasterStore.value
    const { data } = await getCategoriesApi()
    console.log('data:', data)
    masterStore.categories = data.data
    console.log('Mastercığım', masterStore.categories)
  } catch (error) {
    console.error('Beklediğim initCategories Hata:', error)
  }
}

export const setProducts = (data) => {
  const masterStore = useMasterStore.value

  masterStore.products = data
}

export const addToCart = (data) => {
  const masterStore = useMasterStore.value

  masterStore.cart.items = data
}

export const removeFromCart = (id) => {
  const masterStore = useMasterStore.value

  masterStore.cart.items = masterStore.cart.items.filter((item) => item.id !== id)
}

export const initCart = async () => {
  const masterStore = useMasterStore.value
  const { data } = await getCartApi()
  console.log('initCart', data)
  masterStore.state.cart = data
}
// refactor user store
// import { defineStore } from 'pinia'
// import { ref } from 'vue'
// import { getCategoriesApi } from '@/services/master.service'
// import { getCartApi } from '@/services/cart.service'

// export const useMasterStore = defineStore('master', () => {
//   const state = ref({
//     categories: [],
//     products: [],
//     cart: {
//       items: [],
//       totalPrice: 0,
//     },
//   })

//   const initCategories = async () => {
//     const { data } = await getCategoriesApi()
//     state.value.categories = data
//   }

//   const setProducts = (data) => {
//     state.value.products = data
//   }

//   const addToCart = (data) => {
//     state.value.cart.items = data
//   }

//   const removeFromCart = (id) => {
//     state.value.cart = state.value.cart.items.filter((item) => item.id !== id)
//   }

//   const initCart = async () => {
//     const { data } = await getCartApi()
//     console.log('initCart', data)
//     state.value.cart = data
//   }

//   return {
//     state,
//     initCategories,
//     setProducts,
//     addToCart,
//     removeFromCart,
//     initCart,
//   }
// })
