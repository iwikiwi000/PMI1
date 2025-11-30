import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './css/App.css'

import Nav from './components/Nav';
import Login from './pages/Login';
import Cameras from './pages/Cameras';
import Footage from './pages/Footage';
import Info from './pages/Info'

function App() {

  return (
    <>
    <BrowserRouter>
        <Nav></Nav>
        <Routes>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/cameras" element={<Cameras></Cameras>}></Route>
          <Route path="/logout" element={<p>You have been logged out.</p>} />
          <Route path="/footage" element={<Footage></Footage>}></Route>
          <Route path='/info' element={<Info></Info>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
