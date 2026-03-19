import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { itemsAPI } from '../services/api';
import './HomePage.css';

function HomePage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { getTotalItems } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        itemsAPI.getAllItems(),
        itemsAPI.getAllCategories(),
      ]);
      setItems(itemsRes.data);
      setCategories(categoriesRes.data);
      if (categoriesRes.data.length > 0) {
        setSelectedCategory(categoriesRes.data[0].id);
      }
    } catch (err) {
      setError('Failed to load menu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = !selectedCategory || item.category_id === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-left">
          <span className="restaurant-icon">🍽️</span>
          <h1>ArFood</h1>
        </div>
        <a href="/cart" className="cart-icon">
          <span className="cart-icon-emoji">🛒</span>
          <span className="cart-count">({getTotalItems()})</span>
        </a>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="search-section">
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="categories-section">
        <button
          className={`category-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading menu...</div>
      ) : (
        <div className="items-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <a href={`/item/${item.id}`} key={item.id} className="item-card-link">
                <div className="item-card">
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
              </a>
            ))
          ) : (
            <div className="no-items">No items found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
