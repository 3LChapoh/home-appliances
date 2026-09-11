import { useEffect, useState } from 'react'
import { fetchMyOrders } from '../../api/orders'

const STATUS_LABELS = {
  pending: 'Pending',
  partially_fulfilled: 'Partially fulfilled',
  fulfilled: 'Fulfilled',
  cancelled: 'Cancelled',
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function OrdersDrawer({ onClose }) {
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('loading')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetchMyOrders()
      .then((data) => {
        if (cancelled) return
        setOrders(data)
        setStatus('ready')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="drawer">
      <div className="drawer-head">
        <h2>Your orders</h2>
        <button className="close" onClick={onClose}>×</button>
      </div>

      {status === 'loading' && <p className="muted">Loading your orders…</p>}
      {status === 'error' && <p className="muted">Couldn't load orders — try again shortly.</p>}
      {status === 'ready' && orders.length === 0 && (
        <div className="notice">You haven't placed any orders yet.</div>
      )}

      {orders.map((order) => {
        const isOpen = expanded === order._id
        return (
          <div key={order._id} className="mini" style={{ marginBottom: 10 }}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setExpanded(isOpen ? null : order._id)}
            >
              <div>
                <strong>{order.orderNumber}</strong>
                <div className="muted" style={{ fontSize: 10 }}>{formatDate(order.createdAt)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="mono">KES {order.totalAmount.toLocaleString()}</div>
                <div className="muted" style={{ fontSize: 10 }}>
                  {STATUS_LABELS[order.overallStatus] || order.overallStatus}
                </div>
              </div>
            </div>

            {isOpen && (
              <div style={{ marginTop: 10, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
                {order.vendorOrders.map((vo, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div className="vendor">{vo.vendorName}</div>
                    <div className="muted" style={{ fontSize: 10, marginBottom: 4 }}>
                      {STATUS_LABELS[vo.status] || vo.status}
                    </div>
                    {vo.items.map((item, j) => (
                      <div
                        key={j}
                        style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}
                      >
                        <span>{item.name} × {item.quantity}</span>
                        <span className="mono">KES {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="muted" style={{ fontSize: 10 }}>
                  Delivering to {order.deliveryAddress.estate} — {order.deliveryAddress.phone}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default OrdersDrawer
