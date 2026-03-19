import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { orderRecentAPI } from '../services/api';
import './VendorOrders.css';

function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await orderRecentAPI.getRecentOrders();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load recent orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: 'status-new',
      prepared: 'status-prepared',
      delivered: 'status-delivered',
    };
    return badges[status] || 'status-new';
  };

  return (
    <div className="sidebar-layout">
      <Sidebar />
      <div className="main-content">
        <div className="vendor-orders-container">
          <div className="orders-header">
            <h1>🕐 Recent Orders</h1>
            <p>Monitor order status and updates</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="loading">Loading orders...</div>
          ) : (
            <div className="orders-table-wrapper">
              {orders.length > 0 ? (
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Total Price</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="order-id">#{order.order_id}</td>
                        <td className="order-price">${order.tottel_price}</td>
                        <td>
                          <span className={`status-badge ${getStatusBadge(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-orders">No orders found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorOrders;
