import { useState } from 'react'
import { vendorsApi } from '../api'
import { useToast } from '../context/ToastContext'

export default function PartnerSection() {
  const showToast = useToast()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ boutiqueName: '', contactName: '', email: '', phone: '', description: '' })

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    try {
      await vendorsApi.apply(form)
      showToast('Application submitted — we will be in touch')
      setForm({ boutiqueName: '', contactName: '', email: '', phone: '', description: '' })
      setOpen(false)
    } catch (err) {
      showToast(err.message || 'Could not submit application', true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section id="partner" className="wrap reveal in">
      <div style={{ border: '1px solid var(--line)', borderRadius: 14, padding: 25, background: 'linear-gradient(135deg,#c9a24b0d,#1f6f540d)' }}>
        <div className="eyebrow">For independent boutiques</div>
        <h2 className="serif" style={{ fontSize: 38, margin: '6px 0 10px' }}>
          Open your house on Ruby's Choice.
        </h2>
        <p className="muted" style={{ maxWidth: 650, fontSize: 13 }}>
          Bring your catalogue to discerning customers across Nairobi. Apply once, wait for approval,
          then activate your boutique with a one-time PIN.
        </p>
        {!open ? (
          <button className="goldbtn" onClick={() => setOpen(true)}>
            Apply to become a boutique
          </button>
        ) : (
          <form className="form" onSubmit={submit} style={{ maxWidth: 420, marginTop: 16 }}>
            <label>
              Boutique name
              <input className="field" required value={form.boutiqueName} onChange={(e) => update('boutiqueName', e.target.value)} />
            </label>
            <label>
              Contact name
              <input className="field" required value={form.contactName} onChange={(e) => update('contactName', e.target.value)} />
            </label>
            <label>
              Email
              <input className="field" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
            </label>
            <label>
              Phone
              <input className="field" required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="07XX XXX XXX" />
            </label>
            <label>
              About your boutique
              <textarea className="field" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Speciality, story, notes…" />
            </label>
            <button className="goldbtn" disabled={busy}>
              {busy ? 'Submitting…' : 'Submit application'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
