const Order = require('../models/Order')
const Product = require('../models/Product')

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6)
  return `RC-${stamp}`
}

// POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }
    if (!deliveryAddress || !deliveryAddress.recipientName || !deliveryAddress.phone || !deliveryAddress.estate) {
      return res.status(400).json({ message: 'Delivery address is incomplete' })
    }

    const productIds = items.map((i) => i.product)
    const products = await Product.find({ _id: { $in: productIds } })
    const productMap = new Map(products.map((p) => [p._id.toString(), p]))

    const vendorGroups = new Map()

    for (const requested of items) {
      const product = productMap.get(requested.product)
      if (!product) {
        return res.status(404).json({ message: `Product ${requested.product} not found` })
      }
      if (!requested.quantity || requested.quantity < 1) {
        return res.status(400).json({ message: `Invalid quantity for ${product.name}` })
      }
      if (typeof product.stock === 'number' && product.stock < requested.quantity) {
        return res.status(400).json({ message: `${product.name} is out of stock` })
      }

      const vendorId = product.vendorRef.toString()
      if (!vendorGroups.has(vendorId)) {
        vendorGroups.set(vendorId, {
          vendor: product.vendorRef,
          vendorName: product.vendor,
          items: [],
          subtotal: 0,
        })
      }

      const group = vendorGroups.get(vendorId)
      group.items.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        quantity: requested.quantity,
      })
      group.subtotal += product.price * requested.quantity
    }

    const vendorOrders = Array.from(vendorGroups.values())
    const totalAmount = vendorOrders.reduce((sum, g) => sum + g.subtotal, 0)

    const order = await Order.create({
      customer: req.user._id,
      orderNumber: generateOrderNumber(),
      vendorOrders,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || 'pay_on_delivery',
    })

    await Promise.all(
      items.map((i) => Product.findByIdAndUpdate(i.product, { $inc: { stock: -i.quantity } }))
    )

    res.status(201).json(order)
  } catch (err) {
    next(err)
  }
}

// GET /api/orders/my-orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    next(err)
  }
}

// GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    const isOwner = order.customer.toString() === req.user._id.toString()
    const isInvolvedVendor = order.vendorOrders.some(
      (vo) => vo.vendor.toString() === req.user._id.toString()
    )
    const isAdmin = req.user.role === 'admin'

    if (!isOwner && !isInvolvedVendor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' })
    }

    res.json(order)
  } catch (err) {
    next(err)
  }
}

// GET /api/orders/vendor-orders
exports.getVendorOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'vendorOrders.vendor': req.user._id }).sort({ createdAt: -1 })

    const scoped = orders.map((order) => {
      const mine = order.vendorOrders.find((vo) => vo.vendor.toString() === req.user._id.toString())
      return {
        _id: order._id,
        orderNumber: order.orderNumber,
        customer: order.customer,
        deliveryAddress: order.deliveryAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        vendorOrder: mine,
      }
    })

    res.json(scoped)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/orders/:id/vendor-status
exports.updateVendorOrderStatus = async (req, res, next) => {
  try {
    const { status, vendorNotes } = req.body
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    const vendorOrder = order.vendorOrders.find(
      (vo) => vo.vendor.toString() === req.user._id.toString()
    )
    if (!vendorOrder) {
      return res.status(403).json({ message: 'You do not have items in this order' })
    }

    if (status) vendorOrder.status = status
    if (vendorNotes !== undefined) vendorOrder.vendorNotes = vendorNotes

    order.recalculateOverallStatus()
    await order.save()

    res.json(order)
  } catch (err) {
    next(err)
  }
}

// GET /api/orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query
    const filter = status ? { overallStatus: status } : {}
    const orders = await Order.find(filter).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/orders/:id/cancel
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' })
    }
    if (order.overallStatus !== 'pending') {
      return res.status(400).json({ message: 'Order can no longer be cancelled' })
    }

    order.vendorOrders.forEach((vo) => {
      vo.status = 'cancelled'
    })
    order.recalculateOverallStatus()
    await order.save()

    res.json(order)
  } catch (err) {
    next(err)
  }
}
