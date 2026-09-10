import { createRoot } from 'react-dom/client'
import './legacy.css'
import App from './App.jsx'

// Note: StrictMode is intentionally omitted here. It double-invokes effects
// in dev, which would run the legacy script's init() twice and duplicate
// event listeners. Re-add it once the markup is broken into real components.
createRoot(document.getElementById('root')).render(<App />)
