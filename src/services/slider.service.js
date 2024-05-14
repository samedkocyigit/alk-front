import axiosApiInstance from '@/plugins/api'

export const createSliderApi = async (data) => {
  return await axiosApiInstance.post('/sliders', data)
}

export const getSlidersApi = async () => {
  return await axiosApiInstance.get('/sliders')
}
