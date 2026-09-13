const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    vendor: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    // present for signed-in customers, absent for guest checkout
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true, lowercase: true },
    customerPhone: { type: String, trim: true, default: '' },
    deliveryLocation: { type: String, required: true, trim: true },
    paymentMethod: { type: String, required: true, trim: true },
    items: {
      type: [orderItemSchema],
      validate: [(arr) => arr.length > 0, 'Order must have at least one item'],
    },
    // distinct boutique names covered by this order, for vendor-side filtering
    vendors: {
      type: [String],
      default: [],
    },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)
