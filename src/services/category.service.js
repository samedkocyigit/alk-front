import axiosApiInstance from '@/plugins/api'
import { data } from 'autoprefixer'

export const getCategoriesApi = async () => {
  return await axiosApiInstance.get(`/categories`)
}

export const getCategoryApi = async (id) => {
  return await axiosApiInstance.get(`/categories/${id}`)
}

export const getSubCategoryApi = async (id, subId) => {
  return await axiosApiInstance.get(`/categories/${id}/sub_category/${subId}`)
}

export const createCategoryApi = async (data) => {
  return await axiosApiInstance.post(`/categories/`, data)
}
export const createSubCategoryApi = async (id, data) => {
  return await axiosApiInstance.post(`/categories/${id}`, data)
}
