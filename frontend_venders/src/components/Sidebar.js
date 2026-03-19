import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendorAuth } from '../context/VendorAuthContext';
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useVendorAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="vendor-sidebar" >
      <div className="sidebar-header">
        <span className="sidebar-logo">🍽️</span>
        <h2>ArFood</h2>
      </div>

      <nav className="sidebar-nav">
        <button 
          className="sidebar-item"
          onClick={() => navigate('/dashboard')}
          title="Profile"
        >
          <span className="sidebar-icon">👤</span>
          <span className="sidebar-label">Profile</span>
        </button>

        <button 
          className="sidebar-item"
          onClick={() => navigate('/items')}
          title="Food Items"
        >
          <span className="sidebar-icon">🍕</span>
          <span className="sidebar-label">Items</span>
        </button>

        <button 
          className="sidebar-item"
          onClick={() => navigate('/orders')}
          title="Recent Orders"
        >
          <span className="sidebar-icon">🕐</span>
          <span className="sidebar-label">Recent</span>
        </button>

        <button 
          className="sidebar-item"
          onClick={() => navigate('/analytics')}
          title="Analytics"
        >
          <span className="sidebar-icon">📊</span>
          <span className="sidebar-label">Analytics</span>
        </button>
      </nav>

      <button 
        className="sidebar-item "
        onClick={handleLogout}
        title="Logout"
      >
        <span className="sidebar-icon">🚪</span>
        <span className="sidebar-label">Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
