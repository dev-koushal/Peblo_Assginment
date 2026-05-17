import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Public from './pages/Public'
import './index.css'

const path = window.location.pathname
const isPublic = path.startsWith('/public/')

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isPublic ? <Public /> : <App />}
  </React.StrictMode>
)
