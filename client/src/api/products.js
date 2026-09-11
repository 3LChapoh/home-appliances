import apiClient from './client'

export async function fetchProducts(params = {}) {
  const { data } = await apiClient.get('/api/products', { params })
  return data
}

export async function fetchProductById(id) {
  const { data } = await apiClient.get(`/api/products/${id}`)
  return data
}

export async function fetchMyProducts() {
  const { data } = await apiClient.get('/api/products/mine')
  return data
}

function toFormData(fields, imageFiles) {
  const form = new FormData()
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, value)
  })
  ;(imageFiles || []).forEach((file) => form.append('images', file))
  return form
}

export async function createProduct(fields, imageFiles) {
  const form = toFormData(fields, imageFiles)
  const { data } = await apiClient.post('/api/products', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateProduct(id, fields, imageFiles, replaceImages) {
  const form = toFormData({ ...fields, replaceImages: replaceImages ? 'true' : undefined }, imageFiles)
  const { data } = await apiClient.put(`/api/products/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteProduct(id) {
  const { data } = await apiClient.delete(`/api/products/${id}`)
  return data
}
