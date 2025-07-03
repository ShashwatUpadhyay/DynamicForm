import { useState, useEffect } from 'react'
import { Route, Routes, useLocation } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css'
import Form from './components/form/from.jsx'
import Home from './components/form/home.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form/:code" element={<Form />} />
      </Routes>
    </>
  )
}

export default App
