import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vendor_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (username, password) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    return api.post('/auth/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
};

// User APIs - Get vendor data from backend user router
export const userAPI = {
  createUser: (userData) => api.post('/User/create_user', userData),
  getUsers: () => api.get('/User/view_user'),
  getUser: (username) => api.get(`/User/view_user?username=${username}`),
  updateUser: (username, userData) => api.put(`/User/update_user/${username}`, userData),
  deleteUser: (username) => api.delete(`/User/delete_user/${username}`),
  getCurrentUser: async (username) => {
    // Get all users and find current user
    const response = await api.get('/User/view_user');
    const currentUser = response.data.find(user => user.username === username);
    return { data: currentUser };
  },
};

// Items APIs
export const itemsAPI = {
  getAllItems: () => api.get('/items/items'),
  getItemById: (id) => api.get(`/items/items/${id}`),
  createItem: (itemData) => api.post('/items/items', itemData),
  updateItem: (id, itemData) => api.put(`/items/items/${id}`, itemData),
  deleteItem: (id) => api.delete(`/items/items/${id}`),
};

// Order Recent APIs
export const orderRecentAPI = {
  getRecentOrders: () => api.get('/order_item_recent/order_item_recent/view'),
  getOrderById: (orderId) => api.get(`/order_item_recent/order_item_recent/view/${orderId}`),
  createOrderRecent: (orderData) => api.post('/order_item_recent/create', orderData),
  updateOrderStatus: (orderId, status) => 
    api.put(`/order_item_recent/update-status/${orderId}`, { status }),
};
