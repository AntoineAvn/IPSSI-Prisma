import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignUp, SignIn } from './pages'
import './index.css'

let token = localStorage.getItem('token')

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        token ? <Route path="/" element={<div>Dashboard</div>} /> : <Route path="/" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
 