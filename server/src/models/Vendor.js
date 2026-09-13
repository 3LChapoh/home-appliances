const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const vendorSchema = new mongoose.Schema(
  {
    boutiqueName: {
      type: String,
      required: [true, 'Boutique name is required'],
      trim: true,
    },
    contactName: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    // set once the vendor activates their account with the admin-issued PIN
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    // one-time activation PIN generated on approval; cleared once used
    activationPin: {
      type: String,
      select: false,
    },
    activated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

vendorSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

vendorSchema.methods.matchPassword = function matchPassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('Vendor', vendorSchema)
