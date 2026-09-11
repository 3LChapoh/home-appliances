const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
)

const vendorOrderSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vendorName: { type: String, required: true },
    items: {
      type: [orderItemSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    subtotal: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    vendorNotes: { type: String, trim: true },
  },
  { timestamps: true }
)

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vendorOrders: {
      type: [vendorOrderSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    totalAmount: { type: Number, required: true, min: 0 },
    deliveryAddress: {
      recipientName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      estate: { type: String, required: true, trim: true },
      landmark: { type: String, trim: true },
      notes: { type: String, trim: true },
    },
    paymentMethod: {
      type: String,
      enum: ['pay_on_delivery', 'whatsapp_arrangement'],
      default: 'pay_on_delivery',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    overallStatus: {
      type: String,
      enum: ['pending', 'partially_fulfilled', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

orderSchema.methods.recalculateOverallStatus = function () {
  const statuses = this.vendorOrders.map((vo) => vo.status)

  if (statuses.every((s) => s === 'cancelled')) {
    this.overallStatus = 'cancelled'
  } else if (statuses.every((s) => s === 'delivered' || s === 'cancelled')) {
    this.overallStatus = 'fulfilled'
  } else if (statuses.some((s) => s === 'delivered')) {
    this.overallStatus = 'partially_fulfilled'
  } else {
    this.overallStatus = 'pending'
  }
}

orderSchema.index({ customer: 1, createdAt: -1 })
orderSchema.index({ 'vendorOrders.vendor': 1, createdAt: -1 })

module.exports = mongoose.model('Order', orderSchema)
