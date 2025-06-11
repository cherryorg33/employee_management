// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import RegisterManager from './pages/RegisterManager';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './components/AuthContext';
import { Toaster } from 'sonner'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<RegisterManager />} />
          <Route
            path="/manager"
            element={
              <PrivateRoute role="manager">
                <ManagerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <PrivateRoute role="employee">
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
        <Toaster/>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
