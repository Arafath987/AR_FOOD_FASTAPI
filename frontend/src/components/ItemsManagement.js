import React, { useState, useEffect } from 'react';
import { itemsAPI } from '../services/api';
import './Management.css';

function ItemsManagement() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('items');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rating: 0,
    price: 0,
    category: '',
  });

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await itemsAPI.getAllItems();
      setItems(response.data);
    } catch (err) {
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await itemsAPI.getAllCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await itemsAPI.createItem(formData.category, {
        name: formData.name,
        description: formData.description,
        rating: parseInt(formData.rating),
        price: parseInt(formData.price),
      });
      setSuccess('Item created successfully!');
      setFormData({
        name: '',
        description: '',
        rating: 0,
        price: 0,
        category: '',
      });
      setShowForm(false);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create item');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await itemsAPI.createCategory({ category: formData.category });
      setSuccess('Category created successfully!');
      setFormData({ ...formData, category: '' });
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create category');
    }
  };

  return (
    <div className="management-container">
      <h2>Items & Categories Management</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="tab-buttons">
        <button
          className={activeTab === 'items' ? 'active' : ''}
          onClick={() => setActiveTab('items')}
        >
          Items
        </button>
        <button
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
      </div>

      {activeTab === 'items' && (
        <>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'Create New Item'}
          </button>

          {showForm && (
            <form onSubmit={handleCreateItem} className="form-container">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <input
                  type="number"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                  min="0"
                  max="5"
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.category}>
                      {cat.category}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit">Create Item</button>
            </form>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Rating</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.rating}</td>
                    <td>${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {activeTab === 'categories' && (
        <>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'Create New Category'}
          </button>

          {showForm && (
            <form onSubmit={handleCreateCategory} className="form-container">
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit">Create Category</button>
            </form>
          )}

          <table className="data-table">
            <thead>
              <tr>
                <th>Category Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default ItemsManagement;
