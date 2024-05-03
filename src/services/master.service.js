import axiosApiInstance from '@/plugins/api'
import { data } from 'autoprefixer'

export const getCategoriesApi = async () => {
  return await axiosApiInstance.get(`/category`)
}

export const getCategoryApi = async (id) => {
  return await axiosApiInstance.get(`/category/${id}`)
}

export const getSubCategoryApi = async (id, subId) => {
  return await axiosApiInstance.get(`/category/${id}/sub_category/${subId}`)
}
