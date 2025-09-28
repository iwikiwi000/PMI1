import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './css/App.css'

import Nav from './components/Nav'
import Login from './pages/Login';
import Cameras from './pages/Cameras'

function App() {

  return (
    <>
    <BrowserRouter>
        <Nav></Nav>
        <Routes>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/cameras" element={<Cameras></Cameras>}></Route>
          <Route path="/logout" element={<p>You have been logged out.</p>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
