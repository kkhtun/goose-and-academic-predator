import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { SoundProvider } from './context/SoundContext.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SoundProvider><App /></SoundProvider>
  </StrictMode>,
)
