import apiClient from './client'

export async function createOrder(payload) {
  const { data } = await apiClient.post('/api/orders', payload)
  return data
}

export async function fetchMyOrders() {
  const { data } = await apiClient.get('/api/orders/my-orders')
  return data
}

export async function fetchVendorOrders() {
  const { data } = await apiClient.get('/api/orders/vendor-orders')
  return data
}

export async function updateVendorOrderStatus(orderId, payload) {
  const { data } = await apiClient.patch(`/api/orders/${orderId}/vendor-status`, payload)
  return data
}
