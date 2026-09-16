import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Keyboard, KeyboardStyle } from '@capacitor/keyboard'

Keyboard.setStyle({ style: KeyboardStyle.Dark }).catch(() => {})

// Moved out of index.html's inline <script> so a strict CSP (script-src 'self',
// no 'unsafe-inline') can be enforced — see vercel.json.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
