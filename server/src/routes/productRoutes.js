const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const { protect, authorize } = require('../middleware/auth')
const {
  getProducts,
  getMyProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController')

router.get('/', getProducts)
router.get('/mine', protect, authorize('vendor'), getMyProducts)
router.get('/:id', getProductById)
router.post('/', protect, authorize('vendor', 'admin'), upload.array('images', 5), createProduct)
router.put('/:id', protect, authorize('vendor', 'admin'), upload.array('images', 5), updateProduct)
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteProduct)

module.exports = router
