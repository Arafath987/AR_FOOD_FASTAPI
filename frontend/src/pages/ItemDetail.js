import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import './ItemDetail.css';

function ItemDetail() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  const fetchItem = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await itemsAPI.getAllItems();
      const foundItem = response.data.find((i) => i.id === parseInt(itemId));
      if (foundItem) {
        setItem(foundItem);
      } else {
        setError('Item not found');
      }
    } catch (err) {
      setError('Failed to load item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (item) {
      addToCart({
        ...item,
        quantity: parseInt(quantity),
      });
      setSuccess('Item added to cart!');
      setTimeout(() => {
        setSuccess('');
      }, 2000);
    }
  };

  if (loading) {
    return <div className="loading">Loading item...</div>;
  }

  if (error || !item) {
    return (
      <div className="item-detail-container">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Menu
        </button>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="item-detail-container">
      <button onClick={() => navigate('/')} className="back-btn">
        ← Back to Menu
      </button>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="item-detail">
        {item.image && (
          <div className="item-detail-image">
            <img src={`data:image/jpeg;base64,${item.image}`} alt={item.name} />
          </div>
        )}

        <div className="item-detail-info">
          <h1>{item.name}</h1>

          <p className="item-detail-desc">{item.description}</p>

          <div className="item-detail-stats">
            <div className="stat">
              <label>Rating:</label>
              <span className="rating">⭐ {item.rating}/5</span>
            </div>
          </div>

          <div className="item-detail-price">
            <span className="price-label">Price:</span>
            <span className="price-value">${item.price}</span>
          </div>

          <div className="quantity-section">
            <label htmlFor="quantity">Quantity:</label>
            <div className="quantity-input">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <button onClick={handleAddToCart} className="add-to-cart-btn">
            Add to Cart
          </button>

          <div className="total-price">
            Total: <span>${(item.price * quantity).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
