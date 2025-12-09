
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import DesignerPanel from './pages/DesignerPanel';

export default function App() {
  const [userRole, setUserRole] = useState(null); // 'admin' | 'designer' | null

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setUserRole={setUserRole} />} />

        <Route
          path="/admin"
          element={userRole === 'admin' ? <AdminPanel onLogout={() => setUserRole(null)} /> : <Navigate to="/" />}
        />

        <Route
          path="/designer"
          element={userRole === 'designer' ? <DesignerPanel onLogout={() => setUserRole(null)} /> : <Navigate to="/" />}
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
