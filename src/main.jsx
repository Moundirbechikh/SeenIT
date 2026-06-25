import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  // Autour de ton <App />
  <GoogleOAuthProvider clientId="606127145016-i6t72s5vs7ujeluft3um5592nb4f77i5.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)
