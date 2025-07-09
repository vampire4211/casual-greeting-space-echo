import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (userData: any) => api.post('/auth/register/', userData),
  login: (credentials: any) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
  updateVendorCategories: (categories: string[]) => 
    api.post('/auth/vendor/categories/', { categories }),
};

export const vendorsAPI = {
  getVendors: (params?: { category?: string; location?: string }) => 
    api.get('/vendors/', { params }),
  getVendorDetail: (vendorId: number) => api.get(`/vendors/${vendorId}/`),
  getDashboardData: () => api.get('/vendors/dashboard/'),
  uploadCategoryImage: (formData: FormData) => 
    api.post('/vendors/upload-category-image/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export const categoriesAPI = {
  getCategories: () => api.get('/categories/'),
  getHomepageImages: (section?: string) => 
    api.get('/categories/homepage-images/', { params: { section } }),
  uploadHomepageImage: (formData: FormData) => 
    api.post('/categories/upload-homepage-image/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  downloadImage: (imageId: number) => 
    api.get(`/categories/download-image/${imageId}/`, { responseType: 'blob' }),
};

export const bookingsAPI = {
  createBooking: (bookingData: any) => api.post('/bookings/', bookingData),
  getBookings: () => api.get('/bookings/'),
  updateBooking: (bookingId: number, data: any) => 
    api.patch(`/bookings/${bookingId}/`, data),
};

export const reviewsAPI = {
  createReview: (reviewData: any) => api.post('/reviews/', reviewData),
  getVendorReviews: (vendorId: number) => 
    api.get(`/reviews/vendor/${vendorId}/`),
};

export const chatAPI = {
  getChats: () => api.get('/chats/'),
  createChat: (vendorId: number) => api.post('/chats/', { vendor_id: vendorId }),
  getChatMessages: (chatRoomId: string) => 
    api.get(`/chats/${chatRoomId}/messages/`),
  sendMessage: (chatRoomId: string, message: string) => 
    api.post(`/chats/${chatRoomId}/messages/`, { message }),
};

export default api;