import { useState, useEffect } from 'react'
import { Route, Routes, useLocation } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css'
import Welcome from './components/welcom.jsx'
import Home from './components/form/home.jsx'
import FormEdit from './components/form/fromEdit.jsx'
import Form from './components/form/form.jsx'
import FormResponse from './components/form/formResponse.jsx';
import Login from './components/auth/login.jsx';
import Logout from './components/auth/logout.jsx'
import ProtectRoute from './components/protect/protectRoute.jsx'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/form" element={<ProtectRoute><Home /></ProtectRoute>} />
        <Route path="/form/:code/edit" element={<ProtectRoute><FormEdit /></ProtectRoute>} />
        <Route path="/form/:code" element={<ProtectRoute><Form /></ProtectRoute>} />
        <Route path="/form/:code/response" element={<ProtectRoute><FormResponse /></ProtectRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<ProtectRoute><Logout /></ProtectRoute>} />
      </Routes>
    </>
  )
}

export default App
