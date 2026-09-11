import { useEffect, useState } from 'react'
import {
  fetchMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../api/products'
import ProductForm from './ProductForm'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function imageUrl(path) {
  if (!path) return ''
  return path.startsWith('http') ? path : `${API_URL}${path}`
}

function VendorProductsTab() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [mode, setMode] = useState('list') // list | create | edit
  const [editingProduct, setEditingProduct] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function load() {
    setStatus('loading')
    fetchMyProducts()
      .then((data) => {
        setProducts(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(load, [])

  async function handleCreate(fields, imageFiles) {
    setSubmitting(true)
    try {
      await createProduct(fields, imageFiles)
      setMode('list')
      load()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(fields, imageFiles, replaceImages) {
    setSubmitting(true)
    try {
      await updateProduct(editingProduct._id, fields, imageFiles, replaceImages)
      setMode('list')
      setEditingProduct(null)
      load()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    await deleteProduct(product._id)
    load()
  }

  if (mode === 'create') {
    return <ProductForm onSubmit={handleCreate} onCancel={() => setMode('list')} submitting={submitting} />
  }

  if (mode === 'edit' && editingProduct) {
    return (
      <ProductForm
        initial={editingProduct}
        onSubmit={handleUpdate}
        onCancel={() => {
          setMode('list')
          setEditingProduct(null)
        }}
        submitting={submitting}
      />
    )
  }

  return (
    <div className="dash">
      <button className="goldbtn" onClick={() => setMode('create')}>
        + Add product
      </button>

      {status === 'loading' && <p className="muted">Loading your products…</p>}
      {status === 'error' && <p className="muted">Couldn't load products.</p>}
      {status === 'ready' && products.length === 0 && (
        <div className="notice">You haven't listed any products yet.</div>
      )}

      {products.map((p) => (
        <div key={p._id} className="mini-grid" style={{ gridTemplateColumns: '60px 1fr auto', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 60, height: 65, borderRadius: 6, overflow: 'hidden', background: 'var(--panel2)' }}>
            {p.images?.[0] && (
              <img src={imageUrl(p.images[0])} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
          <div>
            <strong>{p.name}</strong>
            <div className="muted mono" style={{ fontSize: 11 }}>
              KES {p.price.toLocaleString()} · stock {p.stock}
            </div>
          </div>
          <div className="actions">
            <button
              className="tiny"
              onClick={() => {
                setEditingProduct(p)
                setMode('edit')
              }}
            >
              Edit
            </button>
            <button className="tiny danger" onClick={() => handleDelete(p)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default VendorProductsTab
