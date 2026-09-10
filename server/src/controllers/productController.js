const fs = require('fs')
const path = require('path')
const Product = require('../models/Product')

const uploadDir = path.join(__dirname, '..', '..', 'uploads')

function deleteImageFiles(imagePaths = []) {
  imagePaths.forEach((imgPath) => {
    const filename = path.basename(imgPath)
    const fullPath = path.join(uploadDir, filename)
    fs.unlink(fullPath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Failed to delete image:', fullPath, err.message)
      }
    })
  })
}

// GET /api/products
async function getProducts(req, res) {
  try {
    const { category, vendor, search, sort } = req.query

    const filter = {}
    if (category) filter.category = category
    if (vendor) filter.vendor = vendor
    if (search) filter.name = { $regex: search, $options: 'i' }

    let query = Product.find(filter)

    if (sort === 'low') query = query.sort({ price: 1 })
    else if (sort === 'high') query = query.sort({ price: -1 })
    else if (sort === 'name') query = query.sort({ name: 1 })
    else query = query.sort({ createdAt: -1 })

    const products = await query
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message })
  }
}

// GET /api/products/:id
async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product', error: err.message })
  }
}

// POST /api/products
async function createProduct(req, res) {
  try {
    const { name, vendor, price, category, description, stock } = req.body

    const images = (req.files || []).map((f) => `/uploads/${f.filename}`)

    const product = await Product.create({
      name,
      vendor,
      price,
      category,
      description,
      stock,
      images,
    })

    res.status(201).json(product)
  } catch (err) {
    // clean up any uploaded files if creation failed
    if (req.files?.length) {
      deleteImageFiles(req.files.map((f) => `/uploads/${f.filename}`))
    }
    res.status(400).json({ message: 'Failed to create product', error: err.message })
  }
}

// PUT /api/products/:id
async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    const { name, vendor, price, category, description, stock, replaceImages } = req.body

    if (name !== undefined) product.name = name
    if (vendor !== undefined) product.vendor = vendor
    if (price !== undefined) product.price = price
    if (category !== undefined) product.category = category
    if (description !== undefined) product.description = description
    if (stock !== undefined) product.stock = stock

    if (req.files?.length) {
      const newImages = req.files.map((f) => `/uploads/${f.filename}`)

      if (replaceImages === 'true') {
        // swap entirely: delete old files, use only new ones
        deleteImageFiles(product.images)
        product.images = newImages
      } else {
        // append to existing images
        product.images = [...product.images, ...newImages]
      }
    }

    await product.save()
    res.json(product)
  } catch (err) {
    if (req.files?.length) {
      deleteImageFiles(req.files.map((f) => `/uploads/${f.filename}`))
    }
    res.status(400).json({ message: 'Failed to update product', error: err.message })
  }
}

// DELETE /api/products/:id
async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    deleteImageFiles(product.images)
    await product.deleteOne()

    res.json({ message: 'Product deleted', id: req.params.id })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message })
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
