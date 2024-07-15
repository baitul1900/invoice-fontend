import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/global css/global.css'
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster position="bottom-center" reverseOrder={false} />
    <App />
  </React.StrictMode>,
)
