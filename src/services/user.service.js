import axiosApiInstance from '@/plugins/api'

export const getUsersApi = async () => {
  return await axiosApiInstance.get('/users')
}
export const updateUserApi = async (id, data) => {
  return await axiosApiInstance.patch(`/users/${id}`, data)
}

export const getUserApi = async (id) => {
  return await axiosApiInstance.get(`/identity/users/${id}`)
}

export const getShopDetailApi = async (id) => {}

export const updateMeApi = async (id, data) => {
  return await axiosApiInstance.patch(`/users/${id}`, data)
}

export const addAddressToUserApi = async (id, address) => {
  return axiosApiInstance.patch(`/users/${id}/${address}`)
}
