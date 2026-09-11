import apiClient from './client'

export async function fetchProducts(params = {}) {
  const { data } = await apiClient.get('/api/products', { params })
  return data
}

export async function fetchProductById(id) {
  const { data } = await apiClient.get(`/api/products/${id}`)
  return data
}
