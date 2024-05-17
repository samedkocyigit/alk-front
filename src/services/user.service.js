import axiosApiInstance from '@/plugins/api'
import { BASE_SHOPPING_API } from '@/utils/constant.utils'
export const getUsersApi = async () => {
  return await axiosApiInstance.get('/users')
}
export const updateUserApi = async (id, data) => {
  return await axiosApiInstance.patch(`/users/${id}`, data)
}

export const getUserApi = async (id) => {
  return await axiosApiInstance.get(`/identity/users/${id}`)
}

export const getShopDetailApi = async (id) => {
  return await axiosApiInstance.get(`${BASE_SHOPPING_API}/users/${id}`)
}

export const updateMeApi = async (id, data) => {
  return await axiosApiInstance.patch(`/users/${id}`, data)
}
