import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import './Management.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    designation: '',
    phone_number: '',
    password: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userAPI.getUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await userAPI.createUser(formData);
      setSuccess('User created successfully!');
      setFormData({
        username: '',
        email: '',
        designation: '',
        phone_number: '',
        password: '',
      });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user');
    }
  };

  const handleDelete = async (username) => {
    if (window.confirm(`Delete user ${username}?`)) {
      try {
        await userAPI.deleteUser(username);
        setSuccess('User deleted successfully!');
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  return (
    <div className="management-container">
      <h2>User Management</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <button onClick={() => setShowForm(!showForm)} className="btn-primary">
        {showForm ? 'Cancel' : 'Create New User'}
      </button>

      {showForm && (
        <form onSubmit={handleCreate} className="form-container">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Designation</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) =>
                setFormData({ ...formData, designation: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button type="submit">Create User</button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Designation</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.designation}</td>
                <td>{user.phone_number}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user.username)}
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

export default UserManagement;
