const express = require('express')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      })
    }

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        message: 'Invalid admin credentials',
      })
    }

    const token = jwt.sign(
      {
        role: 'admin',
        email: process.env.ADMIN_EMAIL,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '8h',
      }
    )

    res.json({
      message: 'Admin login successful',
      token,
    })
  } catch (err) {
    console.error('Admin login error:', err)

    res.status(500).json({
      message: 'Login failed',
    })
  }
})

module.exports = router

