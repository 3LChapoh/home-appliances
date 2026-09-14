const Settings = require('../models/Settings')

async function getOrCreateSettings() {
  let settings = await Settings.findOne()
  if (!settings) {
    settings = await Settings.create({ heroImages: [] })
  }
  return settings
}

async function getConfig(req, res) {
  try {
    const settings = await getOrCreateSettings()
    res.json({
      whatsapp: process.env.RUBYS_CHOICE_WHATSAPP || '',
      email: process.env.RUBYS_CHOICE_EMAIL || '',
      heroImages: settings.heroImages,
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to load config', error: err.message })
  }
}

async function updateHeroImages(req, res) {
  try {
    const urls = (req.files || []).map((f) => f.path)
    if (urls.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' })
    }
    const settings = await getOrCreateSettings()
    settings.heroImages = urls
    await settings.save()
    res.json({ heroImages: settings.heroImages })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update hero images', error: err.message })
  }
}

module.exports = { getConfig, updateHeroImages }
