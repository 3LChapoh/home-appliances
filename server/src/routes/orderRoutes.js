const express = require('express')
const router = express.Router()
const { protect, authorize } = require('../middleware/auth')
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getVendorOrders,
  updateVendorOrderStatus,
  getAllOrders,
  cancelOrder,
} = require('../controllers/orderController')

router.post('/', protect, authorize('customer'), createOrder)
router.get('/my-orders', protect, authorize('customer'), getMyOrders)
router.patch('/:id/cancel', protect, authorize('customer'), cancelOrder)

router.get('/vendor-orders', protect, authorize('vendor'), getVendorOrders)
router.patch('/:id/vendor-status', protect, authorize('vendor'), updateVendorOrderStatus)

router.get('/', protect, authorize('admin'), getAllOrders)

router.get('/:id', protect, getOrderById)

module.exports = router
