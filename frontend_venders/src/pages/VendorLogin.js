import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendorAuth } from '../context/VendorAuthContext';
import './VendorLogin.css';

function VendorLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useVendorAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-login-page">
      <div className="vendor-login-container">
        <div className="login-box">
          <div className="login-header">
            <span className="restaurant-icon">🍽️</span>
            <h1>ArFood Vendors</h1>
          </div>
          <p className="login-subtitle">Vendor Management Portal</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                disabled={loading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                disabled={loading}
                className="form-input"
              />
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Access to vendor management portal</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorLogin;
