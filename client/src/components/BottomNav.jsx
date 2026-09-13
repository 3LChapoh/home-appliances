import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useFavourites } from '../context/FavouritesContext'

export default function BottomNav({ theme, onToggleTheme, onOpenCart, onOpenAccount, onOpenFavourites }) {
  const { count } = useCart()
  const { ids: favourites } = useFavourites()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`bottom-nav${scrolled ? ' show' : ''}`} aria-label="Mobile">
        <button onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}>🏠</button>
        <button onClick={onToggleTheme}>{theme === 'light' ? '☾' : '☼'}</button>
        <button onClick={onOpenFavourites}>
          ♡ <span className="cart-count">{favourites.length}</span>
        </button>
        <button onClick={onOpenAccount}>👤</button>
        <button onClick={onOpenCart}>
          🛍 <span className="cart-count">{count}</span>
        </button>
      </nav>
      <button
        className={`back-to-top${scrolled ? ' show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </>
  )
}
