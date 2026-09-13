import { useEffect, useState } from 'react'
import { vendorsApi } from '../../api'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useToast } from '../../context/ToastContext'

const FILTERS = ['pending', 'approved', 'rejected']

export default function AdminVendors() {
  const { token } = useAdminAuth()
  const showToast = useToast()
  const [filter, setFilter] = useState('pending')
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [issuedPin, setIssuedPin] = useState(null) // { vendorId, pin }

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
      const result = await vendorsApi.approve(id, token)
      setIssuedPin({ vendorId: id, pin: result.activationPin })
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
            {issuedPin?.vendorId === v._id && (
              <div className="notice" style={{ marginTop: 8 }}>
                Activation PIN: <b className="mono">{issuedPin.pin}</b> — share this with the vendor.
              </div>
            )}
            {filter === 'pending' && (
              <div className="actions" style={{ marginTop: 8 }}>
                <button className="tiny ok" onClick={() => approve(v._id)}>
                  Approve
                </button>
                <button className="tiny danger" onClick={() => reject(v._id)}>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
