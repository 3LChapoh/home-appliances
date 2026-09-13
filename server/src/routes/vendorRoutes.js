const express = require('express')
const router = express.Router()
const { protect, requireRole, attachVendor } = require('../middleware/auth')
const {
  apply,
  listVendors,
  approveVendor,
  rejectVendor,
  activate,
  login,
  getMe,
} = require('../controllers/vendorController')

router.post('/apply', apply)
router.post('/activate', activate)
router.post('/login', login)

router.get('/me', protect, requireRole('vendor'), attachVendor, getMe)

// admin-only application management
router.get('/', protect, requireRole('admin'), listVendors)
router.put('/:id/approve', protect, requireRole('admin'), approveVendor)
router.put('/:id/reject', protect, requireRole('admin'), rejectVendor)

module.exports = router
