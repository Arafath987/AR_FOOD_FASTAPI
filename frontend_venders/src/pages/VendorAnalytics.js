import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { orderRecentAPI } from '../services/api';
import './VendorAnalytics.css';

function VendorAnalytics() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    newOrders: 0,
    preparedOrders: 0,
    deliveredOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await orderRecentAPI.getRecentOrders();
      const orders = response.data;

      const totalRevenue = orders.reduce((sum, order) => sum + order.tottel_price, 0);
      const newOrders = orders.filter((o) => o.status === 'new').length;
      const preparedOrders = orders.filter((o) => o.status === 'prepared').length;
      const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        newOrders,
        preparedOrders,
        deliveredOrders,
      });
    } catch (err) {
      setError('Failed to load analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sidebar-layout">
      <Sidebar />
      <div className="main-content">
        <div className="vendor-analytics-container">
          <div className="analytics-header">
            <h1>📊 Analytics Dashboard</h1>
            <p>Business insights and statistics</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="loading">Loading analytics...</div>
          ) : (
            <div className="stats-grid">
              <div className="stat-card total-orders">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <h3>Total Orders</h3>
                  <p className="stat-value">{stats.totalOrders}</p>
                </div>
              </div>

              <div className="stat-card total-revenue">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>Total Revenue</h3>
                  <p className="stat-value">${stats.totalRevenue}</p>
                </div>
              </div>

              <div className="stat-card new-orders">
                <div className="stat-icon">🆕</div>
                <div className="stat-content">
                  <h3>New Orders</h3>
                  <p className="stat-value">{stats.newOrders}</p>
                </div>
              </div>

              <div className="stat-card prepared-orders">
                <div className="stat-icon">👨‍🍳</div>
                <div className="stat-content">
                  <h3>Prepared</h3>
                  <p className="stat-value">{stats.preparedOrders}</p>
                </div>
              </div>

              <div className="stat-card delivered-orders">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Delivered</h3>
                  <p className="stat-value">{stats.deliveredOrders}</p>
                </div>
              </div>

              <div className="stat-card conversion-rate">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <h3>Success Rate</h3>
                  <p className="stat-value">
                    {stats.totalOrders > 0
                      ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorAnalytics;
