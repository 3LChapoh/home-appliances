const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    vendor: {
      type: String,
      required: [true, 'Vendor / boutique name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price (KES) is required'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    images: {
      type: [String], // stored paths, e.g. /uploads/filename.jpg
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
