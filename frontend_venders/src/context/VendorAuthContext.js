import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const VendorAuthContext = createContext();

export function VendorAuthProvider({ children }) {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('vendor_access_token');
    const vendorUsername = localStorage.getItem('vendor_username');
    
    if (token && vendorUsername) {
      loadVendorData(vendorUsername);
    } else {
      setLoading(false);
    }
  }, []);

  const loadVendorData = async (username) => {
    try {
      const response = await userAPI.getCurrentUser(username);
      setVendor(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to load vendor data:', error);
      localStorage.removeItem('vendor_access_token');
      localStorage.removeItem('vendor_username');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const authResponse = await authAPI.login(username, password);
      const accessToken = authResponse.data.access_token;

      // Store token
      localStorage.setItem('vendor_access_token', accessToken);
      localStorage.setItem('vendor_username', username);

      // Load vendor data
      await loadVendorData(username);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('vendor_access_token');
    localStorage.removeItem('vendor_username');
    setVendor(null);
    setIsAuthenticated(false);
  };

  const updateVendorData = async (username, userData) => {
    try {
      const response = await userAPI.updateUser(username, userData);
      setVendor(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to update vendor data:', error);
      throw error;
    }
  };

  return (
    <VendorAuthContext.Provider
      value={{
        vendor,
        loading,
        isAuthenticated,
        login,
        logout,
        updateVendorData,
      }}
    >
      {children}
    </VendorAuthContext.Provider>
  );
}

export function useVendorAuth() {
  const context = useContext(VendorAuthContext);
  if (!context) {
    throw new Error('useVendorAuth must be used within VendorAuthProvider');
  }
  return context;
}
