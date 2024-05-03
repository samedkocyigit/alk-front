import axiosApiInstance from '@/plugins/api'

export const addToCartApi = async (id, data) => {
  return await axiosApiInstance.post(`/carts/${id}`, data)
}

export const getCartApi = async (id) => {
  return await axiosApiInstance.get(`/carts/${id}`)
}

export const createEmptyCartApi = async (data) => {
  return await axiosApiInstance.post('/carts', data)
}

export const removeCartApi = async (id) => {
  return await axiosApiInstance.delete(`/carts/${id}`)
}
