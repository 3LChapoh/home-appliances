import { useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/layout/Nav'
import Hero from '../components/home/Hero'
import ProductGrid from '../components/home/ProductGrid'
import Filters from '../components/products/Filters'
import useProducts from '../hooks/useProducts'

function Home() {
  const [filters, setFilters] = useState({ sort: 'featured' })
  const { products, status } = useProducts(filters)
  const preview = products.slice(0, 8)

  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <section id="collection" className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Curated in Nairobi</div>
              <h2>The collection</h2>
            </div>
          </div>
          <Filters filters={filters} onChange={setFilters} />
          <ProductGrid products={preview} status={status} />
          <div className="view-more-wrap">
            <Link className="goldbtn" to="/products">
              View All Products
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}

export default Home
