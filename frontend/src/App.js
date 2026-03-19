import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import HomePage from './pages/HomePage';
import ItemDetail from './pages/ItemDetail';
import Cart from './pages/Cart';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));

  const handleLogin = (token, username) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('username', username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {/* Public routes - no login required */}
        <Route path="/" element={<HomePage />} />
        <Route path="/item/:itemId" element={<ItemDetail />} />
        <Route path="/cart" element={<Cart />} />
        
        {/* Login route */}
        <Route 
          path="/login" 
          element={<Login onLogin={handleLogin} />}
        />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
