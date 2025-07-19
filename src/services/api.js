import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  signin: (credentials) => api.post('/auth/signin', credentials),
  signout: () => api.post('/auth/signout'),
  getMe: () => api.get('/auth/me'),
  getStatus: () => api.get('/auth/status'),
};

// Vendors API
export const vendorsAPI = {
  getAll: (params) => api.get('/vendors', { params }),
  getById: (id) => api.get(`/vendors/${id}`),
  updateProfile: (data) => api.put('/vendors/profile', data),
  getDashboardStats: () => api.get('/vendors/dashboard/stats'),
};

// Customers API
export const customersAPI = {
  getProfile: () => api.get('/customers/profile'),
  updateProfile: (data) => api.put('/customers/profile', data),
  getBookings: () => api.get('/customers/bookings'),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getVendors: (id, params) => api.get(`/categories/${id}/vendors`, { params }),
};

// Bookings API
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { booking_status: status }),
  getVendorBookings: (params) => api.get('/bookings/vendor/list', { params }),
};

// Reviews API
export const reviewsAPI = {
  create: (data) => api.post('/reviews', data),
  getVendorReviews: (vendorId, params) => api.get(`/reviews/vendor/${vendorId}`, { params }),
  update: (id, data) => api.put(`/reviews/${id}`, data),
};

// Chat API
export const chatAPI = {
  getChats: () => api.get('/chat'),
  getMessages: (chatRoomId) => api.get(`/chat/${chatRoomId}/messages`),
  sendMessage: (chatRoomId, message) => api.post(`/chat/${chatRoomId}/messages`, { message }),
  createChatRoom: (vendorId) => api.post('/chat/rooms', { vendor_id: vendorId }),
};

// Images API
export const imagesAPI = {
  uploadVendorImages: (formData) => api.post('/images/vendor/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getVendorImages: (vendorId) => api.get(`/images/vendor/${vendorId}`),
  deleteImage: (imageId) => api.delete(`/images/${imageId}`),
};

export default api;