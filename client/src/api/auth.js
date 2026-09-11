import apiClient from './client'

export async function registerUser(payload) {
  const { data } = await apiClient.post('/api/auth/register', payload)
  return data
}

export async function loginUser(payload) {
  const { data } = await apiClient.post('/api/auth/login', payload)
  return data
}

export async function fetchMe() {
  const { data } = await apiClient.get('/api/auth/me')
  return data
}
