import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { itemsAPI } from '../services/api';
import './VendorItems.css';

function VendorItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await itemsAPI.getAllItems();
      setItems(response.data);
    } catch (err) {
      setError('Failed to load items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sidebar-layout">
      <Sidebar />
      <div className="main-content">
        <div className="vendor-items-container">
          <div className="items-header">
            <h1>🍕 Food Items</h1>
            <p>Manage your menu items</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="loading">Loading items...</div>
          ) : (
            <div className="items-grid">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="item-card">
                    {item.image && (
                      <div className="item-image">
                        <img
                          src={`data:image/jpeg;base64,${item.image}`}
                          alt={item.name}
                        />
                      </div>
                    )}
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p className="item-desc">{item.description}</p>
                      <div className="item-footer">
                        <span className="price">${item.price}</span>
                        <span className="rating">⭐ {item.rating}/5</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-items">No items found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorItems;
