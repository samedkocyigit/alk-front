import axiosApiInstance from '@/plugins/api'

export const createSliderApi = async (data) => {
  return await axiosApiInstance.post('/sliders', data)
}

export const getSlidersApi = async () => {
  return await axiosApiInstance.get('/sliders')
}

export const updateSliderApi = async (id, data) => {
  return await axiosApiInstance.patch(`/sliders/${id}`, data)
}
