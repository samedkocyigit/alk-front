import axiosApiInstance from '@/plugins/api'

export const loginApi = async (data) => {
  return await axiosApiInstance.post(`/users/login`, data)
}
export const logoutApi = async () => {
  return await axiosApiInstance.get(`/users/logout`)
}
export const signUpApi = async (data) => {
  return await axiosApiInstance.post(`/users/signup`, data)
}
