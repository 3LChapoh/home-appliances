import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/layout/Nav'
import Filters from '../components/products/Filters'
import ProductGrid from '../components/home/ProductGrid'
import Pagination from '../components/products/Pagination'
import useProducts from '../hooks/useProducts'

const PAGE_SIZES = [8, 16, 24, 32]

function AllProducts() {
  const [filters, setFilters] = useState({ sort: 'featured' })
  const [pageSize, setPageSize] = useState(8)
  const [page, setPage] = useState(1)

  const { products, status } = useProducts(filters)

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize))
  const pageProducts = useMemo(() => {
    const start = (page - 1) * pageSize
    return products.slice(start, start + pageSize)
  }, [products, page, pageSize])

  function handleFiltersChange(next) {
    setFilters(next)
    setPage(1)
  }

  function handlePageSizeChange(size) {
    setPageSize(size)
    setPage(1)
  }

  return (
    <>
      <Nav />
      <main id="main">
        <section className="wrap all-products-page">
          <Link className="ghostbtn" to="/" style={{ display: 'inline-block', marginBottom: 20 }}>
            ← Home
          </Link>
          <div className="section-head">
            <div>
              <div className="eyebrow">The complete edit</div>
              <h2>All products</h2>
              <p className="muted" style={{ fontSize: 12, margin: '5px 0 0' }}>
                Explore the full Ruby's Choice catalogue.
              </p>
            </div>
            <span className="muted" style={{ fontSize: 11 }}>
              {products.length} result{products.length === 1 ? '' : 's'}
            </span>
          </div>

          <Filters
            filters={filters}
            onChange={handleFiltersChange}
            searchPlaceholder="Search the full collection…"
          />

          <div className="page-size-row">
            <span className="muted">Products per page</span>
            <div className="page-sizes">
              {PAGE_SIZES.map((size) => (
                <button
                  key={size}
                  className={`page-size${size === pageSize ? ' active' : ''}`}
                  onClick={() => handlePageSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <ProductGrid products={pageProducts} status={status} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </section>
      </main>
    </>
  )
}

export default AllProducts
