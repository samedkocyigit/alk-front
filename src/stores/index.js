/* eslint-disable no-unused-vars */
import { AuthStore } from './auth.store'
import { useMasterStore } from './master.store'

export const initAuthStore = async () => {
  const authStore = AuthStore
}

export const initMasterStore = async () => {
  const masterStore = useMasterStore()
  try {
    await Promise.all([masterStore.initCategories()])
    if (localStorage.getItem('access_token')) {
      await initAuthMasterStore(masterStore)
    }
  } catch (error) {
    console.log(error)
  }
}

const initAuthMasterStore = async (masterStore) => {
  await Promise.all([masterStore.initCart()])
}
