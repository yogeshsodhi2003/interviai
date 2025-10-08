// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute() {
  const { user, initializing } = useAuth();
  if (initializing) return <div className="p-6 text-gray-600">Loading...</div>;
  return user ? children : <Navigate to="/signin" replace />;
}
