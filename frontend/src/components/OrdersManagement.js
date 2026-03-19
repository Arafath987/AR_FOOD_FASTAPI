import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import './Management.css';

function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    table_number: '',
    seat_number: '',
    name: '',
  });

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else {
      fetchOrderItems();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await ordersAPI.getAllOrders();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await ordersAPI.getAllOrderItems();
      setOrderItems(response.data);
    } catch (err) {
      setError('Failed to fetch order items');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await ordersAPI.createOrder({
        table_number: parseInt(formData.table_number),
        seat_number: parseInt(formData.seat_number),
        name: formData.name,
      });
      setSuccess('Order created successfully!');
      setFormData({
        table_number: '',
        seat_number: '',
        name: '',
      });
      setShowForm(false);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create order');
    }
  };

  return (
    <div className="management-container">
      <h2>Orders Management</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="tab-buttons">
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={activeTab === 'orderItems' ? 'active' : ''}
          onClick={() => setActiveTab('orderItems')}
        >
          Order Items
        </button>
      </div>

      {activeTab === 'orders' && (
        <>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'Create New Order'}
          </button>

          {showForm && (
            <form onSubmit={handleCreateOrder} className="form-container">
              <div className="form-group">
                <label>Table Number</label>
                <input
                  type="number"
                  value={formData.table_number}
                  onChange={(e) =>
                    setFormData({ ...formData, table_number: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Seat Number</label>
                <input
                  type="number"
                  value={formData.seat_number}
                  onChange={(e) =>
                    setFormData({ ...formData, seat_number: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit">Create Order</button>
            </form>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Table Number</th>
                  <th>Seat Number</th>
                  <th>Customer Name</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.table_number}</td>
                    <td>{order.seat_number}</td>
                    <td>{order.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {activeTab === 'orderItems' && (
        <>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Order ID</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.item_name}</td>
                    <td>${item.price}</td>
                    <td>{item.order_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default OrdersManagement;
