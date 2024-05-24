import axiosApiInstance from '@/plugins/api'

export const getCategoriesApi = async () => {
  return await axiosApiInstance.get(`/categories`)
}

export const getCategoryApi = async (id) => {
  return await axiosApiInstance.get(`/categories/${id}`)
}

export const getCategoryForProductsApi = async (id, filters) => {
  return await axiosApiInstance.get(`/categories/for-products/${id}`, {
    params: filters,
  })
}

export const getCategoryBySlugApi = async (slug) => {
  return await axiosApiInstance.get(`/categories/slug/${slug}`)
}

export const getSubCategoryBySlugApi = async (slug) => {
  return await axiosApiInstance.get(`/categories/subcategoryslug/${slug}`)
}

export const getSubCategoryForProductsApi = async (id, subId, filters) => {
  return await axiosApiInstance.get(`/categories/for-products/${id}/sub_category/${subId}`, {
    params: filters,
  })
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
