import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import BujjiAgent from './Component/BujjiiAgent.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BujjiAgent />
  </StrictMode>,
)
