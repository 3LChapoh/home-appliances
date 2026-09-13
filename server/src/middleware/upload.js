const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

// Files upload straight to Cloudinary, so nothing touches the server's local
// disk — safe across Render redeploys (a local disk would get wiped).
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'rubys-choice/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1600, height: 2000, crop: 'limit' }],
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only JPEG, PNG, or WEBP images are allowed'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
})

module.exports = upload
