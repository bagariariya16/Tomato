import {BrowserRouter} from 'react-router-dom'
import REACTDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import React from 'react'
import StoreContextProvider from './context/storeContext.jsx'


REACTDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StoreContextProvider>
  <App />
  </StoreContextProvider>
  
  </BrowserRouter>
   
)
