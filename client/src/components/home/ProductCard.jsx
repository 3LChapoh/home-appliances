const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function imageUrl(path) {
  if (!path) return ''
  return path.startsWith('http') ? path : `${API_URL}${path}`
}

function ProductCard({ product }) {
  const mainImage = product.images?.[0]
  const altImage = product.images?.[1]

  return (
    <div className="product">
      <div className={`p-img${!mainImage ? ' img-fallback' : ''}`}>
        {mainImage && <img src={imageUrl(mainImage)} alt={product.name} />}
        {altImage && <img className="alt" src={imageUrl(altImage)} alt="" />}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="stock">Only {product.stock} left</span>
        )}
      </div>
      <div className="p-body">
        <div className="vendor">{product.vendor}</div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="price mono">KES {product.price.toLocaleString()}</div>
        <button className="add" disabled={product.stock === 0}>
          {product.stock === 0 ? 'Out of stock' : 'Add to bag'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
