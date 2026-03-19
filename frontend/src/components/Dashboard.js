import React, { useState } from 'react';
import './Dashboard.css';
import UserManagement from './UserManagement';
import ItemsManagement from './ItemsManagement';
import OrdersManagement from './OrdersManagement';
import OrderRecentManagement from './OrderRecentManagement';

function Dashboard({ username, onLogout }) {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>ArFood Management System</h1>
        <div className="header-right">
          <span>Welcome, {username}!</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`nav-btn ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          Items
        </button>
        <button
          className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={`nav-btn ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          Recent Orders
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'items' && <ItemsManagement />}
        {activeTab === 'orders' && <OrdersManagement />}
        {activeTab === 'recent' && <OrderRecentManagement />}
      </main>
    </div>
  );
}

export default Dashboard;
