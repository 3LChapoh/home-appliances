import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { createOrder } from '../../api/orders'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function imageUrl(path) {
  if (!path) return ''
  return path.startsWith('http') ? path : `${API_URL}${path}`
}

function CartDrawer({ onClose, onOpenAccount }) {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart()
  const { user } = useAuth()
  const [checkingOut, setCheckingOut] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const [address, setAddress] = useState({
    recipientName: '',
    phone: '',
    estate: '',
    landmark: '',
    notes: '',
  })

  function updateAddress(key, value) {
    setAddress((a) => ({ ...a, [key]: value }))
  }

  async function handlePlaceOrder(e) {
    e.preventDefault()
    setError('')
    setPlacing(true)
    try {
      const payload = {
        items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        deliveryAddress: address,
        paymentMethod: 'pay_on_delivery',
      }
      const order = await createOrder(payload)
      setConfirmedOrder(order)
      clearCart()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order')
    } finally {
      setPlacing(false)
    }
  }

  if (confirmedOrder) {
    return (
      <div className="drawer">
        <div className="drawer-head">
          <h2>Order placed</h2>
          <button className="close" onClick={onClose}>×</button>
        </div>
        <div className="notice">
          Order <strong>{confirmedOrder.orderNumber}</strong> confirmed — total KES{' '}
          {confirmedOrder.totalAmount.toLocaleString()}. We'll be in touch to arrange delivery.
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="drawer">
        <div className="drawer-head">
          <h2>Your bag</h2>
          <button className="close" onClick={onClose}>×</button>
        </div>
        <div className="notice">Sign in to view your bag and check out.</div>
        <button
          className="goldbtn"
          style={{ marginTop: 12 }}
          onClick={() => {
            onClose()
            onOpenAccount()
          }}
        >
          Sign in
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="drawer">
        <div className="drawer-head">
          <h2>Your bag</h2>
          <button className="close" onClick={onClose}>×</button>
        </div>
        <div className="notice">Your bag is empty.</div>
      </div>
    )
  }

  if (checkingOut) {
    return (
      <div className="drawer">
        <div className="drawer-head">
          <h2>Delivery details</h2>
          <button className="close" onClick={onClose}>×</button>
        </div>
        <form className="form" onSubmit={handlePlaceOrder}>
          <label>Recipient name</label>
          <input
            className="field"
            value={address.recipientName}
            onChange={(e) => updateAddress('recipientName', e.target.value)}
            required
          />
          <label>Phone</label>
          <input
            className="field"
            value={address.phone}
            onChange={(e) => updateAddress('phone', e.target.value)}
            required
          />
          <label>Estate / area</label>
          <input
            className="field"
            value={address.estate}
            onChange={(e) => updateAddress('estate', e.target.value)}
            required
          />
          <label>Landmark (optional)</label>
          <input
            className="field"
            value={address.landmark}
            onChange={(e) => updateAddress('landmark', e.target.value)}
          />
          <label>Notes (optional)</label>
          <textarea
            className="field"
            value={address.notes}
            onChange={(e) => updateAddress('notes', e.target.value)}
          />

          <div className="total">
            <span>Total</span>
            <span>KES {total.toLocaleString()}</span>
          </div>

          {error && <p className="field-error">{error}</p>}

          <button className="goldbtn" type="submit" disabled={placing}>
            {placing ? 'Placing order…' : 'Place order (Pay on delivery)'}
          </button>
          <button
            className="ghostbtn"
            type="button"
            onClick={() => setCheckingOut(false)}
            style={{ marginTop: 8 }}
          >
            Back to bag
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="drawer">
      <div className="drawer-head">
        <h2>Your bag</h2>
        <button className="close" onClick={onClose}>×</button>
      </div>

      {items.map((item) => (
        <div className="cart-row" key={item.product}>
          {item.image && <img src={imageUrl(item.image)} alt={item.name} />}
          <div>
            <div>{item.name}</div>
            <div className="mono muted" style={{ fontSize: 11 }}>
              KES {item.price.toLocaleString()}
            </div>
            <div className="qty">
              <button type="button" onClick={() => updateQuantity(item.product, item.quantity - 1)}>
                −
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.product, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
              >
                +
              </button>
            </div>
          </div>
          <button className="tiny danger" onClick={() => removeItem(item.product)}>
            Remove
          </button>
        </div>
      ))}

      <div className="total">
        <span>Total</span>
        <span>KES {total.toLocaleString()}</span>
      </div>

      <button className="goldbtn" onClick={() => setCheckingOut(true)}>
        Checkout
      </button>
    </div>
  )
}

export default CartDrawer
