const mongoose = require('mongoose')
const Order = require('../models/Order')
const Product = require('../models/Product')

// POST /api/orders
// body: { items: [{ productId, qty }], customerName, customerEmail, customerPhone, deliveryLocation, paymentMethod }
async function createOrder(req, res) {
  const session = await mongoose.startSession()
  try {
    let created
    await session.withTransaction(async () => {
      const { items, customerName, customerEmail, customerPhone, deliveryLocation, paymentMethod } = req.body

      if (!Array.isArray(items) || items.length === 0) {
        throw Object.assign(new Error('Order must include at least one item'), { status: 400 })
      }
      if (!customerName || !customerEmail || !deliveryLocation || !paymentMethod) {
        throw Object.assign(
          new Error('Customer name, email, delivery location and payment method are required'),
          { status: 400 }
        )
      }

      const orderItems = []
      let total = 0
      const vendorSet = new Set()

      for (const { productId, qty } of items) {
        const quantity = Number(qty) || 0
        if (quantity < 1) continue

        const product = await Product.findById(productId).session(session)
        if (!product) {
          throw Object.assign(new Error(`Product ${productId} not found`), { status: 404 })
        }
        if (product.stock < quantity) {
          throw Object.assign(
            new Error(`Only ${product.stock} left in stock for "${product.name}"`),
            { status: 409 }
          )
        }

        product.stock -= quantity
        await product.save({ session })

        orderItems.push({
          product: product._id,
          name: product.name,
          vendor: product.vendor,
          price: product.price,
          qty: quantity,
        })
        total += product.price * quantity
        vendorSet.add(product.vendor)
      }

      if (orderItems.length === 0) {
        throw Object.assign(new Error('Order must include at least one valid item'), { status: 400 })
      }

      const [order] = await Order.create(
        [
          {
            customer: req.auth?.role === 'customer' ? req.auth.id : undefined,
            customerName,
            customerEmail,
            customerPhone,
            deliveryLocation,
            paymentMethod,
            items: orderItems,
            vendors: [...vendorSet],
            total,
          },
        ],
        { session }
      )
      created = order
    })

    res.status(201).json(created)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Failed to place order' })
  } finally {
    session.endSession()
  }
}

// GET /api/orders/mine  (signed-in customer)
async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ customer: req.auth.id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message })
  }
}

// GET /api/orders/vendor  (signed-in vendor) — orders containing this vendor's boutique
async function getVendorOrders(req, res) {
  try {
    const orders = await Order.find({ vendors: req.vendor.boutiqueName }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message })
  }
}

// GET /api/orders  (admin) — all orders
async function getAllOrders(req, res) {
  try {
    const filter = {}
    if (req.query.status) filter.status = req.query.status
    const orders = await Order.find(filter).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message })
  }
}

// PUT /api/orders/:id/status  (vendor or admin) — body: { status }
async function updateStatus(req, res) {
  try {
    const { status } = req.body
    const allowed = ['Pending', 'Processing', 'Completed', 'Cancelled']
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(', ')}` })
    }

    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    if (req.auth.role === 'vendor' && !order.vendors.includes(req.vendor.boutiqueName)) {
      return res.status(403).json({ message: 'This order does not belong to your boutique' })
    }

    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      await restockOrder(order)
    }

    order.status = status
    await order.save()
    res.json(order)
  } catch (err) {
    res.status(400).json({ message: 'Failed to update order', error: err.message })
  }
}

// PUT /api/orders/:id/cancel  (customer who placed it) — cancels and restocks
async function cancelMyOrder(req, res) {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer: req.auth.id })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (order.status === 'Cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' })
    }
    if (order.status === 'Completed') {
      return res.status(400).json({ message: 'Completed orders cannot be cancelled' })
    }

    await restockOrder(order)
    order.status = 'Cancelled'
    await order.save()
    res.json(order)
  } catch (err) {
    res.status(400).json({ message: 'Failed to cancel order', error: err.message })
  }
}

async function restockOrder(order) {
  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } })
    )
  )
}

module.exports = {
  createOrder,
  getMyOrders,
  getVendorOrders,
  getAllOrders,
  updateStatus,
  cancelMyOrder,
}
