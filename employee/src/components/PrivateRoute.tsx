import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const PrivateRoute = ({ children, role }: { children: any, role: string }) => {
  const { token, role: userRole } = useAuth();

  if (!token) return <Navigate to="/" />;
  if (userRole !== role) return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
