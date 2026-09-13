import { useEffect, useState } from 'react'
import { ordersApi } from '../api'
import { money } from '../data/categories'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import PasswordField from './PasswordField'

export default function AccountDrawer({ onClose, refreshKey }) {
  const { user, token, login, register, logout } = useAuth()
  const showToast = useToast()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' })
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  useEffect(() => {
    if (!user) return
    setOrdersLoading(true)
    ordersApi
      .mine(token)
      .then(setOrders)
      .catch((err) => showToast(err.message, true))
      .finally(() => setOrdersLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshKey])

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form)
      }
      showToast(mode === 'login' ? 'Welcome back' : 'Account created')
    } catch (err) {
      showToast(err.message || 'Something went wrong', true)
    } finally {
      setBusy(false)
    }
  }

  async function cancelOrder(id) {
    try {
      await ordersApi.cancel(id, token)
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status: 'Cancelled' } : o)))
      showToast('Order cancelled')
    } catch (err) {
      showToast(err.message || 'Could not cancel order', true)
    }
  }

  if (!user) {
    return (
      <>
        <div className="drawer-head">
          <h2>{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
          <button className="close" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="form" onSubmit={submit}>
          {mode === 'register' && (
            <label>
              Name
              <input className="field" required value={form.name} onChange={(e) => update('name', e.target.value)} />
            </label>
          )}
          <label>
            Email
            <input className="field" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
          </label>
          <label>
            Password
            <PasswordField value={form.password} onChange={(e) => update('password', e.target.value)} required />
          </label>
          {mode === 'register' && (
            <>
              <label>
                Phone
                <input className="field" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="07XX XXX XXX" />
              </label>
              <label>
                Delivery address
                <input className="field" value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Westlands, Nairobi" />
              </label>
            </>
          )}
          <button className="goldbtn" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <button className="ghostbtn" style={{ marginTop: 12, width: '100%' }} onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </>
    )
  }

  return (
    <>
      <div className="drawer-head">
        <h2>Your account</h2>
        <button className="close" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="notice">
        Signed in as <b>{user.name}</b> ({user.email})
      </div>
      <h3 style={{ fontSize: 13, margin: '16px 0 8px' }}>Orders</h3>
      {ordersLoading && <div className="notice">Loading your orders…</div>}
      {!ordersLoading && !orders.length && <div className="notice">No orders yet.</div>}
      {orders.map((o) => (
        <div className="mini" key={o._id}>
          <strong>{o._id.slice(-7).toUpperCase()}</strong>
          <span className="muted">
            {new Date(o.createdAt).toLocaleDateString()} · {o.status}
          </span>
          <br />
          <b className="mono">{money(o.total)}</b>
          <br />
          <small>
            {o.deliveryLocation} · {o.paymentMethod}
          </small>
          {o.status === 'Pending' && (
            <div className="actions" style={{ marginTop: 6 }}>
              <button className="tiny danger" onClick={() => cancelOrder(o._id)}>
                Cancel order
              </button>
            </div>
          )}
        </div>
      ))}
      <button className="ghostbtn" style={{ marginTop: 16, width: '100%' }} onClick={logout}>
        Sign out
      </button>
    </>
  )
}
