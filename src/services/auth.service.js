import axios from 'axios'
import axiosApiInstance from '@/plugins/api'

axios.defaults.baseURL = 'http://127.0.0.1:3000/'
// const BASE_ENDPOINT = '/identity'

export const refreshAccessToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token')
  const data = {
    refreshToken: refresh_token,
  }
  return await axios.post(`/auth/refresh-token`, data)
}
export const loginApi = async (data) => {
  return await axiosApiInstance.post(`/auth/login`, data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'no-cors',
  })
}

// export const getInfo = async () => {
//   return await axiosApiInstance.get(`/users/me`)
// }
