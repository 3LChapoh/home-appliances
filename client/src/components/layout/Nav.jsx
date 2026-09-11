import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import AccountDrawer from '../account/AccountDrawer'
import CartDrawer from '../cart/CartDrawer'

function Nav() {
  const [openDrawer, setOpenDrawer] = useState(null) // null | 'account' | 'cart'
  const { user } = useAuth()
  const { count } = useCart()

  function close() {
    setOpenDrawer(null)
  }

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
              onClick={() => setOpenDrawer('account')}
            >
              {user ? '●' : '♙'}
            </button>
            <button
              className="iconbtn"
              aria-label="Open shopping bag"
              onClick={() => setOpenDrawer('cart')}
            >
              🛍 <span className="cart-count">{count}</span>
            </button>
          </div>
        </div>
      </header>

      <div className={`overlay${openDrawer ? ' open' : ''}`} onClick={close}>
        <div onClick={(e) => e.stopPropagation()}>
          {openDrawer === 'account' && <AccountDrawer onClose={close} />}
          {openDrawer === 'cart' && (
            <CartDrawer onClose={close} onOpenAccount={() => setOpenDrawer('account')} />
          )}
        </div>
      </div>
    </>
  )
}

export default Nav
