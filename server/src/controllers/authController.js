const jwt = require('jsonwebtoken')
const User = require('../models/User')

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, businessName, businessDescription } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    if (role === 'vendor' && !businessName) {
      return res.status(400).json({ message: 'Business name is required for vendor accounts' })
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role === 'vendor' ? 'vendor' : 'customer', // admin accounts created manually, not via public register
      businessName,
      businessDescription,
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      businessName: user.businessName,
      token: generateToken(user._id),
    })
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      businessName: user.businessName,
      token: generateToken(user._id),
    })
  } catch (err) {
    next(err)
  }
}

exports.getMe = async (req, res, next) => {
  try {
    res.json(req.user)
  } catch (err) {
    next(err)
  }
}
