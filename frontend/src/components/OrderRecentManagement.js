import React, { useState, useEffect } from 'react';
import { orderRecentAPI } from '../services/api';
import './Management.css';

function OrderRecentManagement() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    order_id: '',
  });

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await orderRecentAPI.getRecentOrders();
      setRecentOrders(response.data);
    } catch (err) {
      setError('Failed to fetch recent orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await orderRecentAPI.createRecentOrder(formData.order_id);
      setSuccess('Recent order created successfully!');
      setFormData({ order_id: '' });
      setShowForm(false);
      fetchRecentOrders();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create recent order');
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm(`Delete recent order ${orderId}?`)) {
      try {
        await orderRecentAPI.deleteRecentOrder(orderId);
        setSuccess('Recent order deleted successfully!');
        fetchRecentOrders();
      } catch (err) {
        setError('Failed to delete recent order');
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Delete all recent orders?')) {
      try {
        await orderRecentAPI.deleteAllRecentOrders();
        setSuccess('All recent orders deleted!');
        fetchRecentOrders();
      } catch (err) {
        setError('Failed to delete all recent orders');
      }
    }
  };

  return (
    <div className="management-container">
      <h2>Recent Orders Management</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="button-group">
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Create New Recent Order'}
        </button>
        <button onClick={handleDeleteAll} className="btn-danger">
          Delete All
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateRecent} className="form-container">
          <div className="form-group">
            <label>Order ID</label>
            <input
              type="number"
              value={formData.order_id}
              onChange={(e) =>
                setFormData({ ...formData, order_id: e.target.value })
              }
              required
            />
          </div>
          <button type="submit">Create Recent Order</button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>${order.tottel_price}</td>
                <td>{order.status}</td>
                <td>
                  <button
                    onClick={() => handleDelete(order.order_id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderRecentManagement;
