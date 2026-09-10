const express = require('express')
const router = express.Router()

const upload = require('../middleware/upload')
const requireAdmin = require('../middleware/auth')

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController')

// Public catalogue routes
router.get('/', getProducts)
router.get('/:id', getProductById)

// Admin-only product management
router.post('/', requireAdmin, upload.array('images', 5), createProduct)
router.put('/:id', requireAdmin, upload.array('images', 5), updateProduct)
router.delete('/:id', requireAdmin, deleteProduct)

module.exports = router

