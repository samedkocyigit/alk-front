import axiosApiInstance from '@/plugins/api'

export const getBrandsApi = async () => {
  return await axiosApiInstance.get('/brands')
}
export const createBrandApi = async (data) => {
  return await axiosApiInstance.post('/brands', data)
}
