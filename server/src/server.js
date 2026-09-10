require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')
const productRoutes = require('./routes/productRoutes')

const app = express()

connectDB()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api/products', productRoutes)

app.get('/', (req, res) => {
  res.json({ message: "Ruby's Choice API is running" })
})

// centralized error handler (catches multer errors, thrown errors, etc.)
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
