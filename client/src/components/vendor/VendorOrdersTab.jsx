import { useEffect, useState } from 'react'
import { fetchVendorOrders, updateVendorOrderStatus } from '../../api/orders'

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function VendorOrdersTab() {
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('loading')
  const [updating, setUpdating] = useState(null)

  function load() {
    setStatus('loading')
    fetchVendorOrders()
      .then((data) => {
        setOrders(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(load, [])

  async function handleStatusChange(orderId, newStatus) {
    setUpdating(orderId)
    try {
      await updateVendorOrderStatus(orderId, { status: newStatus })
      load()
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="dash">
      {status === 'loading' && <p className="muted">Loading your orders…</p>}
      {status === 'error' && <p className="muted">Couldn't load orders.</p>}
      {status === 'ready' && orders.length === 0 && (
        <div className="notice">No orders containing your products yet.</div>
      )}

      {orders.map((order) => (
        <div key={order._id} className="mini" style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{order.orderNumber}</strong>
            <span className="muted" style={{ fontSize: 10 }}>{formatDate(order.createdAt)}</span>
          </div>

          {order.vendorOrder.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
              <span>{item.name} × {item.quantity}</span>
              <span className="mono">KES {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}

          <div className="muted" style={{ fontSize: 10, marginTop: 6 }}>
            Deliver to {order.deliveryAddress.estate} — {order.deliveryAddress.phone}
          </div>

          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <select
              className="field"
              style={{ padding: '6px 8px', fontSize: 11 }}
              value={order.vendorOrder.status}
              disabled={updating === order._id}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}

export default VendorOrdersTab
