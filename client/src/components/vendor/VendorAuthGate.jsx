import { useState } from 'react'
import { useVendorAuth } from '../../context/VendorAuthContext'
import { useToast } from '../../context/ToastContext'
import PasswordField from '../PasswordField'

export default function VendorAuthGate() {
  const { login, activate } = useVendorAuth()
  const showToast = useToast()
  const [mode, setMode] = useState('login') // 'login' | 'activate'
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', pin: '' })

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await activate(form.email, form.pin, form.password)
        showToast('Boutique activated — you are now signed in')
      }
    } catch (err) {
      showToast(err.message || 'Something went wrong', true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="wrap" style={{ maxWidth: 420, paddingTop: 60 }}>
      <div className="eyebrow">Boutique portal</div>
      <h2 className="serif" style={{ margin: '6px 0 16px' }}>
        {mode === 'login' ? 'Vendor sign in' : 'Activate your boutique'}
      </h2>
      <div className="tabs" style={{ marginBottom: 16 }}>
        <button className={`tab${mode === 'login' ? ' active' : ''}`} onClick={() => setMode('login')}>
          Sign in
        </button>
        <button className={`tab${mode === 'activate' ? ' active' : ''}`} onClick={() => setMode('activate')}>
          Activate with PIN
        </button>
      </div>
      <form className="form" onSubmit={submit}>
        <label>
          Email
          <input className="field" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
        </label>
        {mode === 'activate' && (
          <label>
            Activation PIN
            <input className="field" required value={form.pin} onChange={(e) => update('pin', e.target.value)} placeholder="6-digit PIN from your approval" />
          </label>
        )}
        <label>
          {mode === 'activate' ? 'Choose a password' : 'Password'}
          <PasswordField value={form.password} onChange={(e) => update('password', e.target.value)} required />
        </label>
        <button className="goldbtn" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Activate boutique'}
        </button>
      </form>
      <p className="muted" style={{ fontSize: 11, marginTop: 12 }}>
        Not a partner yet? Apply from the storefront's "Become a Boutique Partner" section.
      </p>
    </section>
  )
}
