const express = require('express')
const router = express.Router()
const { protect, attachUser } = require('../middleware/auth')
const { register, login, getMe, updateMe } = require('../controllers/userController')

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, attachUser, getMe)
router.put('/me', protect, attachUser, updateMe)

module.exports = router
