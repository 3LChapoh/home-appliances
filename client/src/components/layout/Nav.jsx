import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import AccountDrawer from '../account/AccountDrawer'

function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user } = useAuth()

  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <a className="logo" href="#home">
            Ruby's <span>Choice</span>
          </a>
          <nav className="navlinks" aria-label="Primary">
            <a href="#collection">Collection</a>
            <a href="#categories">Categories</a>
            <a href="#partner">Partner</a>
            <a href="#orders">Orders</a>
          </nav>
          <div className="nav-actions">
            <button className="iconbtn" aria-label="Toggle light or dark theme">☼</button>
            <button
              className="iconbtn"
              aria-label="Account and sign in"
              onClick={() => setDrawerOpen(true)}
            >
              {user ? '●' : '♙'}
            </button>
            <button className="iconbtn" aria-label="Open shopping bag">
              🛍 <span className="cart-count">0</span>
            </button>
          </div>
        </div>
      </header>

      <div className={`overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)}>
        <div onClick={(e) => e.stopPropagation()}>
          {drawerOpen && <AccountDrawer onClose={() => setDrawerOpen(false)} />}
        </div>
      </div>
    </>
  )
}

export default Nav
