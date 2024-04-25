/* eslint-disable no-unused-vars */
import { startAuthStore } from './auth.store'
import { initCategories } from './master.store'

export const initAuthStore = async () => {
  await startAuthStore()
}

export const initMasterStore = async () => {
  try {
    await Promise.all(initCategories())
    if (localStorage.getItem('access_token')) {
      await initAuthMasterStore()
    }
  } catch (error) {
    console.log(error)
  }
}

const initAuthMasterStore = async () => {
  await Promise.all(initCart())
}
