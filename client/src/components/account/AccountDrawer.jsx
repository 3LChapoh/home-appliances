import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AccountDrawer({ onClose }) {
  const { user, login, register, logout } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', businessName: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form)
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (user) {
    return (
      <div className="drawer">
        <div className="drawer-head">
          <h2>Account</h2>
          <button className="close" onClick={onClose}>×</button>
        </div>
        <p>Signed in as <strong>{user.name}</strong> ({user.role})</p>
        {user.role === 'vendor' && (
          <Link className="goldbtn" to="/vendor" onClick={onClose} style={{ display: 'inline-block', marginBottom: 10 }}>
            Boutique dashboard
          </Link>
        )}
        <button className="ghostbtn" onClick={logout}>Log out</button>
      </div>
    )
  }

  return (
    <div className="drawer">
      <div className="drawer-head">
        <h2>{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
        <button className="close" onClick={onClose}>×</button>
      </div>

      <div className="tabs">
        <button className={`tab${mode === 'login' ? ' active' : ''}`} onClick={() => setMode('login')}>
          Sign in
        </button>
        <button className={`tab${mode === 'register' ? ' active' : ''}`} onClick={() => setMode('register')}>
          Register
        </button>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <>
            <label>Name</label>
            <input className="field" value={form.name} onChange={(e) => update('name', e.target.value)} required />

            <label>I am a</label>
            <select className="field" value={form.role} onChange={(e) => update('role', e.target.value)}>
              <option value="customer">Customer</option>
              <option value="vendor">Boutique / Vendor</option>
            </select>

            {form.role === 'vendor' && (
              <>
                <label>Boutique name</label>
                <input
                  className="field"
                  value={form.businessName}
                  onChange={(e) => update('businessName', e.target.value)}
                  required
                />
              </>
            )}
          </>
        )}

        <label>Email</label>
        <input
          className="field"
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          required
        />

        <label>Password</label>
        <input
          className="field"
          type="password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          required
          minLength={6}
        />

        {error && <p className="field-error">{error}</p>}

        <button className="goldbtn" type="submit" disabled={submitting}>
          {submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>
    </div>
  )
}

export default AccountDrawer
