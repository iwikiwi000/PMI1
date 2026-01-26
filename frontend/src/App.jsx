import { useState } from 'react'
import './css/App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import ProtectedRoute from '../src/components/ProtectedRoute';
import AdminRoute from '../src/components/AdminRoute';

import Nav from './components/Nav';
import Login from './pages/Login';
import Cameras from './pages/Cameras';
import Footage from './pages/Footage';
import Info from './pages/Info';
import Admin from './pages/Admin';
import PageNotFound from './pages/404';
import AutorizationError from './pages/403';
import ServerError from './pages/500';

function App() {

  return (
    <>
    <BrowserRouter>
        <Nav></Nav>
        <Routes>
          <Route index element={<Login />} />
          <Route
            path="/cameras"
            element={
              <ProtectedRoute>
                <Cameras />
              </ProtectedRoute>
            }
          />
          <Route
            path="/footage"
            element={
              <ProtectedRoute>
                <Footage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/info"
            element={
              <ProtectedRoute>
                <Info />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/403" element={<AutorizationError />} />
          <Route path="/500" element={<ServerError/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
