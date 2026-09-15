const Vendor = require('../models/Vendor')
const generateToken = require('../utils/generateToken')

function toPublic(vendor, includePin = false) {
  const pub = {
    _id: vendor._id,
    boutiqueName: vendor.boutiqueName,
    contactName: vendor.contactName,
    email: vendor.email,
    phone: vendor.phone,
    description: vendor.description,
    status: vendor.status,
    activated: vendor.activated,
  }
  if (includePin && vendor.status === 'approved' && !vendor.activated && vendor.activationPin) {
    pub.activationPin = vendor.activationPin
  }
  return pub
}

function generatePin() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

// POST /api/vendors/apply
async function apply(req, res) {
  try {
    const { boutiqueName, contactName, email, phone, description } = req.body

    if (!boutiqueName || !contactName || !email || !phone) {
      return res.status(400).json({ message: 'Boutique name, contact name, email and phone are required' })
    }

    const existing = await Vendor.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(400).json({ message: 'An application with that email already exists' })
    }

    const nameTaken = await Vendor.findOne({
      boutiqueName: new RegExp(`^${boutiqueName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
    })
    if (nameTaken) {
      return res.status(400).json({ message: 'That boutique name is already taken' })
    }

    const vendor = await Vendor.create({ boutiqueName, contactName, email, phone, description })
    res.status(201).json(toPublic(vendor))
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'That boutique name is already taken' })
    }
    res.status(400).json({ message: 'Application failed', error: err.message })
  }
}

// GET /api/vendors  (admin) — list all vendors/applications, optional ?status=pending
// Includes the activation PIN for approved-but-not-yet-activated vendors, so admins
// can view/resend it any time, not just the moment of approval.
async function listVendors(req, res) {
  try {
    const filter = {}
    if (req.query.status) filter.status = req.query.status
    const vendors = await Vendor.find(filter).select('+activationPin').sort({ createdAt: -1 })
    res.json(vendors.map((v) => toPublic(v, true)))
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vendors', error: err.message })
  }
}

// PUT /api/vendors/:id/approve  (admin) — approves and issues a one-time activation PIN
async function approveVendor(req, res) {
  try {
    const vendor = await Vendor.findById(req.params.id)
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' })

    const pin = generatePin()
    vendor.status = 'approved'
    vendor.activationPin = pin
    vendor.activated = false
    await vendor.save()

    res.json(toPublic(vendor, true))
  } catch (err) {
    res.status(400).json({ message: 'Approval failed', error: err.message })
  }
}

// PUT /api/vendors/:id/reject  (admin)
async function rejectVendor(req, res) {
  try {
    const vendor = await Vendor.findById(req.params.id)
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' })

    vendor.status = 'rejected'
    await vendor.save()
    res.json(toPublic(vendor))
  } catch (err) {
    res.status(400).json({ message: 'Rejection failed', error: err.message })
  }
}

// POST /api/vendors/activate — vendor sets a password using the admin-issued PIN
async function activate(req, res) {
  try {
    const { email, pin, password } = req.body
    if (!email || !pin || !password) {
      return res.status(400).json({ message: 'Email, PIN and password are required' })
    }

    const vendor = await Vendor.findOne({ email: email.toLowerCase().trim() }).select('+activationPin')
    if (!vendor || vendor.status !== 'approved') {
      return res.status(400).json({ message: 'No approved application found for that email' })
    }
    if (vendor.activated) {
      return res.status(400).json({ message: 'This boutique has already been activated' })
    }
    if (vendor.activationPin !== pin) {
      return res.status(400).json({ message: 'Incorrect activation PIN' })
    }

    vendor.password = password
    vendor.activated = true
    vendor.activationPin = undefined
    await vendor.save()

    const token = generateToken({ id: vendor._id, role: 'vendor' })
    res.json({ token, vendor: toPublic(vendor) })
  } catch (err) {
    res.status(400).json({ message: 'Activation failed', error: err.message })
  }
}

// POST /api/vendors/login
async function login(req, res) {
  try {
    const { email, password } = req.body
    const vendor = await Vendor.findOne({ email: (email || '').toLowerCase().trim() }).select('+password')

    if (!vendor || !vendor.activated || !(await vendor.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken({ id: vendor._id, role: 'vendor' })
    res.json({ token, vendor: toPublic(vendor) })
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message })
  }
}

// GET /api/vendors/me  (vendor)
async function getMe(req, res) {
  res.json(toPublic(req.vendor))
}

module.exports = { apply, listVendors, approveVendor, rejectVendor, activate, login, getMe }
