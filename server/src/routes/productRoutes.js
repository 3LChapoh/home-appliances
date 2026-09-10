const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController')

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', upload.array('images', 5), createProduct)
router.put('/:id', upload.array('images', 5), updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router
