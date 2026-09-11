require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')
const productRoutes = require('./routes/productRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()

connectDB()


const allowedOrigins = [
  'https://rubys-choice-mern.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as curl/Postman/server-to-server requests.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
  })
)

app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)

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
