import axiosApiInstance from '@/plugins/api'

export const getCartApi = async (id) => {
  return await axiosApiInstance.get(`/carts/${id}`)
}

export const createEmptyCartApi = async (data) => {
  return await axiosApiInstance.post('/carts', data)
}

export const addToCartApi = async (id, data) => {
  return await axiosApiInstance.post(`/carts/${id}`, data)
}

export const decreaseFromCartApi = async (id, data) => {
  return await axiosApiInstance.patch(`/carts/${id}`, data)
}

export const removeProductFromCartApi = async (id, productid) => {
  return await axiosApiInstance.delete(`/carts/${id}/${productid}`)
}

export const removeCartApi = async (id) => {
  return await axiosApiInstance.delete(`/carts/${id}`)
}
