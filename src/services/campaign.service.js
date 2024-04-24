import axiosApiInstance from '@/plugins/api'

export const createCampaignApi = async (data) => {
  return await axiosApiInstance.post('/campaigns', data)
}

export const getCampaignsApi = async () => {
  return await axiosApiInstance.get('/campaigns')
}
