import { useState, useEffect } from 'react'
import { Route, Routes, useLocation } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css'
import FormEdit from './components/form/fromEdit.jsx'
import Home from './components/form/home.jsx'
import Form from './components/form/form.jsx'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form/:code/edit" element={<FormEdit />} />
        <Route path="/form/:code" element={<Form />} />
      </Routes>
    </>
  )
}

export default App
