import ProductCard from './ProductCard'

function ProductGrid({ products, status }) {
  if (status === 'loading') {
    return <p className="muted">Loading the collection…</p>
  }

  if (status === 'error') {
    return <p className="muted">Couldn't load products — is the server running?</p>
  }

  if (products.length === 0) {
    return <p className="muted">No products match your search.</p>
  }

  return (
    <div className="products" id="products">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
