import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useVendorAuth } from '../context/VendorAuthContext';
import './VendorProfile.css';

function VendorProfile() {
  const { vendor, logout } = useVendorAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: vendor?.username || '',
    designation: vendor?.designation || '',
    phone_number: vendor?.phone_number || '',
    email: vendor?.email || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes (you can add API call here)
      console.log('Saving changes:', formData);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="sidebar-layout">
      <Sidebar />
      <div className="main-content">
        <div className="vendor-profile-container">
          <div className="profile-header">
            <h1>Profile Details</h1>
          </div>

          {vendor && (
            <div className="profile-content">
              {/* Left Box - Profile Picture */}
              <div className="profile-left-box">
                <div className="profile-avatar">
                  <span>👤</span>
                </div>
                <button 
                  className="edit-profile-btn"
                  onClick={handleEditToggle}
                >
                  {isEditing ? '✓ Done' : '✏️ Edit Profile'}
                </button>
              </div>

              {/* Right Box - Input Fields */}
              <div className="profile-right-box">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label>Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your designation"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>
          )}

          <button 
            className="logout-btn"
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default VendorProfile;
