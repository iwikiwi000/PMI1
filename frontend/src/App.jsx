import { useState } from 'react'
import './css/App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './storage/authStorage';
import { useEffect } from 'react';

import Nav from './components/Nav';
import Login from './pages/Login';
import Cameras from './pages/Cameras';
import Footage from './pages/Footage';
import Info from './pages/Info'
import PageNotFound from './pages/404';
import AutorizationError from './pages/403';
import ServerError from './pages/500';

function App() {

  const { checkAuth, isAuthenticated } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuth();
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return (
      <BrowserRouter>
        <Nav />
        <div style={{ padding: '50px', textAlign: 'center', fontSize: '18px' }}>
          Načítava autentifikáciu...
        </div>
      </BrowserRouter>
    );
  }

  return (
    <>
    <BrowserRouter>
        <Nav></Nav>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/cameras" element={isAuthenticated ? <Cameras /> : <Navigate to="/403" replace />} />
          <Route path="/footage" element={<Footage />} />
          <Route path="/info" element={<Info />} />
          <Route path="/logout" element={<Navigate to="/" replace />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/403" element={<AutorizationError />} />
          <Route path="/500" element={<ServerError/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
