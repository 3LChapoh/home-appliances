const mongoose = require('mongoose')

// Singleton document — one row holds all site-wide settings.
const settingsSchema = new mongoose.Schema(
  {
    heroImages: [{ type: String }],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Settings', settingsSchema)
