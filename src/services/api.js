import axios from 'axios';

const API_BASE_URL = 'https://cbc-beauty-backend.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Authorization header set');
  } else {
    console.log('No token found, request will be unauthenticated');
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/users', userData),
  login: (credentials) => api.post('/users/login', credentials),
  googleLogin: (googleData) => api.post('/users/google', googleData),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (productId) => api.get(`/products/${productId}`),
  search: (query) => api.get(`/products/search/${query}`),
  create: (productData) => api.post('/products', productData),
  update: (productId, productData) => api.put(`/products/${productId}`, productData),
  delete: (productId) => api.delete(`/products/${productId}`),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (orderId) => api.get(`/orders/${orderId}`),
  create: (orderData) => api.post('/orders', orderData),
  getQuote: (quoteData) => api.post('/orders/quote', quoteData),
  update: (orderId, orderData) => api.put(`/orders/${orderId}`, orderData),
};

export default api;
// Fixed token variable issue
