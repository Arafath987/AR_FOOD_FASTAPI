import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orderData, setOrderData] = useState({
    table_number: '',
    seat_number: '',
    name: '',
  });

  const handleConfirmOrder = async () => {
    if (!orderData.table_number || !orderData.seat_number || !orderData.name) {
      setError('Please fill in all order details');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create order with total_price
      const orderRes = await ordersAPI.createOrder({
        table_number: parseInt(orderData.table_number),
        seat_number: parseInt(orderData.seat_number),
        name: orderData.name,
        total_price: Math.round(getTotalPrice()),
      });

      const orderId = orderRes.data.id;

      // Add items to order with quantities
      for (let item of cartItems) {
        await ordersAPI.createOrderItem({
          order_id: orderId,
          item_id: item.id,
          quantity: item.quantity,
        });
      }

      setSuccess('Order confirmed successfully! Your order number is: ' + orderId);
      clearCart();
      setTimeout(() => {
        setOrderData({
          table_number: '',
          seat_number: '',
          name: '',
        });
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to confirm order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <div className="cart-container">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Menu
        </button>
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some items to get started!</p>
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <button onClick={() => navigate('/')} className="back-btn">
        ← Back to Menu
      </button>

      <h1>Your Order</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="cart-content">
        <div className="cart-items">
          <h2>Items in Cart</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">${item.price} each</p>
              </div>

              <div className="cart-item-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                <input type="number" value={item.quantity} readOnly />
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>

              <div className="cart-item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="order-form">
          <h2>Order Details</h2>

          <div className="form-group">
            <label htmlFor="name">Customer Name *</label>
            <input
              id="name"
              type="text"
              value={orderData.name}
              onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="table">Table Number *</label>
            <input
              id="table"
              type="number"
              value={orderData.table_number}
              onChange={(e) => setOrderData({ ...orderData, table_number: e.target.value })}
              placeholder="Enter table number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="seat">Seat Number *</label>
            <input
              id="seat"
              type="number"
              value={orderData.seat_number}
              onChange={(e) => setOrderData({ ...orderData, seat_number: e.target.value })}
              placeholder="Enter seat number"
              required
            />
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Items:</span>
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleConfirmOrder}
            disabled={loading}
            className="confirm-btn"
          >
            {loading ? 'Processing...' : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
