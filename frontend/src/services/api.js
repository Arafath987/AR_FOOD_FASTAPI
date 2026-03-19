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
    const token = localStorage.getItem('access_token');
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
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/auth/token', formData);
  },
};

// User APIs
export const userAPI = {
  createUser: (userData) => api.post('/User/create_user', userData),
  getUsers: () => api.get('/User/view_user'),
  updateUser: (username, userData) => api.put(`/User/update_user/${username}`, userData),
  deleteUser: (username) => api.delete(`/User/delete_user/${username}`),
};

// Items APIs
export const itemsAPI = {
  getAllItems: () => api.get('/items/items'),
  getItemsWithCategory: () => api.get('/items/items/with-category'),
  getItemsByCategory: (categoryName) => api.get(`/items/items/by-category/${categoryName}`),
  createItem: (categoryName, itemData) => api.post(`/items/items/${categoryName}`, itemData),
  getAllCategories: () => api.get('/items/categories'),
  createCategory: (categoryData) => api.post('/items/categories', categoryData),
};

// Orders APIs
export const ordersAPI = {
  getAllOrders: () => api.get('/orders/orders'),
  createOrder: (orderData) => api.post('/orders/orders', orderData),
  getAllOrderItems: () => api.get('/orders/order-items'),
  getOrderItemsByOrderId: (orderId) => api.get(`/orders/order-items/${orderId}`),
  createOrderItem: (orderItemData) => api.post('/orders/order-items', orderItemData),
};

// Order Items Recent APIs
export const orderRecentAPI = {
  getRecentOrders: () => api.get('/order_item_recent/order_item_recent/view'),
  createRecentOrder: (orderId) => api.post(`/order_item_recent/order_items_recent/create/${orderId}`),
  deleteRecentOrder: (orderId) => api.delete(`/order_item_recent/order_item_recent/delete/${orderId}`),
  deleteAllRecentOrders: () => api.delete('/order_item_recent/order_item_recent'),
};

export default api;
