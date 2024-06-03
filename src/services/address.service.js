import axiosApiInstance from '@/plugins/api'

export const createAddressApi = async (data) => {
  return await axiosApiInstance.post('/address', data)
}
