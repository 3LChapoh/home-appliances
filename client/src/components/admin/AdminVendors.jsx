import { useEffect, useState } from 'react'
import { vendorsApi } from '../../api'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useToast } from '../../context/ToastContext'

const FILTERS = ['pending', 'approved', 'rejected']

// Normalizes common Kenyan phone formats (07XX XXX XXX, +2547XX..., 2547XX...)
// into the 2547XXXXXXXX shape wa.me requires.
function toWhatsappNumber(raw) {
  const digits = (raw || '').replace(/\D/g, '')
  if (digits.startsWith('254')) return digits
  if (digits.startsWith('0')) return '254' + digits.slice(1)
  if (digits.startsWith('7') || digits.startsWith('1')) return '254' + digits
  return digits
}

function waLink(vendor) {
  const number = toWhatsappNumber(vendor.phone)
  const message =
    vendor.status === 'approved' && !vendor.activated && vendor.activationPin
      ? `Hi ${vendor.contactName}, your boutique "${vendor.boutiqueName}" has been approved on Ruby's Choice! Activate your account with PIN: ${vendor.activationPin}`
      : `Hi ${vendor.contactName}, following up on your Ruby's Choice boutique application.`
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export default function AdminVendors() {
  const { token } = useAdminAuth()
  const showToast = useToast()
  const [filter, setFilter] = useState('pending')
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)

  function reload() {
    setLoading(true)
    vendorsApi
      .listAll(token, filter)
      .then(setVendors)
      .catch((err) => showToast(err.message, true))
      .finally(() => setLoading(false))
  }

  useEffect(reload, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  async function approve(id) {
    try {
      await vendorsApi.approve(id, token)
      showToast('Vendor approved')
      reload()
    } catch (err) {
      showToast(err.message || 'Could not approve vendor', true)
    }
  }

  async function reject(id) {
    if (!confirm('Reject this application?')) return
    try {
      await vendorsApi.reject(id, token)
      showToast('Application rejected')
      reload()
    } catch (err) {
      showToast(err.message || 'Could not reject vendor', true)
    }
  }

  return (
    <div>
      <div className="tabs" style={{ marginBottom: 14 }}>
        {FILTERS.map((f) => (
          <button key={f} className={`tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {loading && <div className="notice">Loading applications…</div>}
      {!loading && !vendors.length && <div className="notice">No {filter} applications.</div>}
      <div className="mini-grid">
        {vendors.map((v) => (
          <div className="mini" key={v._id}>
            <strong>{v.boutiqueName}</strong>
            <br />
            <span className="muted">{v.contactName}</span>
            <br />
            <span className="muted">{v.email} · {v.phone}</span>
            {v.description && <p style={{ fontSize: 11, marginTop: 6 }}>{v.description}</p>}
            <div className="muted" style={{ fontSize: 10, marginTop: 6 }}>
              {v.activated ? 'Activated' : v.status === 'approved' ? 'Approved, awaiting activation' : v.status}
            </div>
            {v.activationPin && (
              <div className="notice" style={{ marginTop: 8 }}>
                Activation PIN: <b className="mono">{v.activationPin}</b>
              </div>
            )}
            <div className="actions" style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {filter === 'pending' && (
                <>
                  <button className="tiny ok" onClick={() => approve(v._id)}>
                    Approve
                  </button>
                  <button className="tiny danger" onClick={() => reject(v._id)}>
                    Reject
                  </button>
                </>
              )}
              {(v.status === 'approved' || filter === 'pending') && (
                <a className="tiny" href={waLink(v)} target="_blank" rel="noreferrer">
                  Message on WhatsApp
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
