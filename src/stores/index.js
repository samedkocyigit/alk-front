/* eslint-disable no-unused-vars */
import { AuthStore, startAuthStore } from './auth.store'
// import { initCart } from './master.store'
import { createEmptyCartApi } from '../services/cart.service'
import store from './master.store'

export const initMasterStore = async () => {
  try {
    store
      .dispatch('initCategories')
      .then(() => {
        console.log('initCategories action başarıyla çağrıldı')
      })
      .catch((error) => {
        console.error('initCategories action çağrılırken hata oluştu:', error)
      })
    await createEmptyCart()
  } catch (error) {
    console.log(error)
  }
}
export const initAuthStore = async () => {
  await startAuthStore()
}
const initAuthMasterStore = async (cart) => {
  store
    .dispatch('initCart', cart)
    .then(() => {
      console.log('initCart action başarıyla çağrıldı')
    })
    .catch((error) => {
      console.error('initCart action çağrılırken hata oluştu:', error)
    })
}
const createEmptyCart = async () => {
  try {
    const emptyCart = {
      userId: null,
      items: [],
      totalPrice: 0,
    }

    const response = await createEmptyCartApi(emptyCart)
    const cart = response.data.data.data
    initAuthMasterStore(cart)
  } catch (error) {
    console.log('Boş sepet oluşturma hatası', error)
  }
}
