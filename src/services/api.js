import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Bookings API
export const bookingsAPI = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my'),
  getAllBookings: () => api.get('/bookings'),
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data),
};

// Products API
export const productsAPI = {
  getAllProducts: () => api.get('/products'),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Invoices API
export const invoicesAPI = {
  getMyInvoices: () => api.get('/invoices/my'),
  getAllInvoices: () => api.get('/invoices'),
  createInvoice: (invoiceData) => api.post('/invoices', invoiceData),
  getInvoice: (id) => api.get(`/invoices/${id}`),
};

export default api;