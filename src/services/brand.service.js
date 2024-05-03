import axiosApiInstance from '@/plugins/api'

export const getBrandsApi = async () => {
  return await axiosApiInstance.get('/brands')
}
export const getBrandApi = async (id) => {
  return await axiosApiInstance.get(`/brands/${id}`, id)
}
export const createBrandApi = async (data) => {
  return await axiosApiInstance.post('/brands', data)
}
