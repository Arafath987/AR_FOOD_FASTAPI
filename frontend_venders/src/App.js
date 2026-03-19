import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { VendorAuthProvider, useVendorAuth } from './context/VendorAuthContext';
import VendorLogin from './pages/VendorLogin';
import VendorProfile from './pages/VendorProfile';
import VendorItems from './pages/VendorItems';
import VendorOrders from './pages/VendorOrders';
import VendorAnalytics from './pages/VendorAnalytics';
import './App.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useVendorAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useVendorAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <VendorLogin />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <VendorProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/items"
        element={
          <ProtectedRoute>
            <VendorItems />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <VendorOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <VendorAnalytics />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <VendorAuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </VendorAuthProvider>
  );
}

export default App;
