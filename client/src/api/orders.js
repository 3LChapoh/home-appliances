import apiClient from './client'

export async function createOrder(payload) {
  const { data } = await apiClient.post('/api/orders', payload)
  return data
}

export async function fetchMyOrders() {
  const { data } = await apiClient.get('/api/orders/my-orders')
  return data
}
