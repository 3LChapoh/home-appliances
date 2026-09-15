import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Header({
  theme,
  onToggleTheme,
  onOpenCart,
  onOpenAccount,
}) {
  const { user } = useAuth()
  const { count } = useCart()

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let ticking = false

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40)
          ticking = false
        })

        ticking = true
      }
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <a className="logo" href="#home" aria-label="Ruby's Choice home">
          Ruby's <span>Choice</span>
        </a>

        <nav className="navlinks" aria-label="Primary">
          <a href="#collection">Collection</a>
          <a href="#categories">Categories</a>
          <a href="#partner">Partner</a>
          <a href="#orders">Orders</a>
        </nav>

        <div className="nav-actions">
          <button
            className="iconbtn"
            onClick={onToggleTheme}
            title="Toggle theme"
            aria-label="Toggle light or dark theme"
          >
            {theme === 'light' ? '☾' : '☼'}
          </button>

          <button
            className="iconbtn"
            onClick={onOpenAccount}
            aria-label="Account and sign in"
          >
            {user ? '👤' : '♙'}
          </button>

          <button
            className="iconbtn"
            onClick={onOpenCart}
            aria-label="Open shopping bag"
          >
            🛍{' '}
            <span className="cart-count" aria-live="polite">
              {count}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

