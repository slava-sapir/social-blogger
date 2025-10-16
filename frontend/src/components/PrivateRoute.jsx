// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/app-context';

export default function PrivateRoute({ children }) {
  const { isLoggedIn } = useApp(); // add an "initialized" flag if you have one

  return isLoggedIn ? children : <Navigate to="/" replace />;
}
