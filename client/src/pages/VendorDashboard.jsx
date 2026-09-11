import { useState } from 'react'
import Nav from '../components/layout/Nav'
import VendorProductsTab from '../components/vendor/VendorProductsTab'
import VendorOrdersTab from '../components/vendor/VendorOrdersTab'
import { useAuth } from '../context/AuthContext'

function VendorDashboard() {
  const { user, status } = useAuth()
  const [tab, setTab] = useState('products')

  if (status === 'loading') {
    return (
      <>
        <Nav />
        <main id="main">
          <section className="wrap" style={{ paddingTop: 120 }}>
            <p className="muted">Loading…</p>
          </section>
        </main>
      </>
    )
  }

  if (!user || user.role !== 'vendor') {
    return (
      <>
        <Nav />
        <main id="main">
          <section className="wrap" style={{ paddingTop: 120 }}>
            <div className="notice">This page is only available to boutique vendor accounts.</div>
          </section>
        </main>
      </>
    )
  }

  return (
    <>
      <Nav />
      <main id="main">
        <section className="wrap" style={{ paddingTop: 120 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow">{user.businessName}</div>
              <h2>Boutique dashboard</h2>
            </div>
          </div>

          <div className="tabs">
            <button className={`tab${tab === 'products' ? ' active' : ''}`} onClick={() => setTab('products')}>
              Products
            </button>
            <button className={`tab${tab === 'orders' ? ' active' : ''}`} onClick={() => setTab('orders')}>
              Orders
            </button>
          </div>

          {tab === 'products' && <VendorProductsTab />}
          {tab === 'orders' && <VendorOrdersTab />}
        </section>
      </main>
    </>
  )
}

export default VendorDashboard
