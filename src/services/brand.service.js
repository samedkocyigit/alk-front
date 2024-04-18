import axiosApiInstance from '@/plugins/api'

export const getBrandsApi = async () => {
  return await axiosApiInstance.get('/brands')
}
