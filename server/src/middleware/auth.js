const jwt = require('jsonwebtoken')

function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Admin authentication required',
      })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        message: 'Admin authentication required',
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        message: 'Admin access required',
      })
    }

    req.admin = decoded
    next()
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid or expired admin token',
    })
  }
}

module.exports = requireAdmin
