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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken
          });
          
          localStorage.setItem('access_token', response.data.access);
          if (response.data.refresh) {
            localStorage.setItem('refresh_token', response.data.refresh);
          }
          
          // Retry original request
          error.config.headers.Authorization = `Bearer ${response.data.access}`;
          return axios.request(error.config);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/signin';
        }
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (userData: any) => api.post('/auth/register/', userData),
  login: (credentials: any) => axios.post('http://localhost:8000/api/token/', credentials),
  refreshToken: (refresh: string) => axios.post('http://localhost:8000/api/token/refresh/', { refresh }),
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

export const eventsAPI = {
  getEvents: (params?: any) => api.get('/events/', { params }),
  createEvent: (eventData: any) => api.post('/events/', eventData),
  getEvent: (eventId: number) => api.get(`/events/${eventId}/`),
  updateEvent: (eventId: number, data: any) => api.put(`/events/${eventId}/`, data),
  deleteEvent: (eventId: number) => api.delete(`/events/${eventId}/`),
  getMyEvents: () => api.get('/events/my-events/'),
};

export const bookingsAPI = {
  getBookings: () => api.get('/bookings/'),
  createBooking: (bookingData: any) => api.post('/bookings/', bookingData),
  getBooking: (bookingId: number) => api.get(`/bookings/${bookingId}/`),
  updateBooking: (bookingId: number, data: any) => 
    api.put(`/bookings/${bookingId}/`, data),
  getBookingMessages: (bookingId: number) => 
    api.get(`/bookings/${bookingId}/messages/`),
  sendBookingMessage: (bookingId: number, message: string) => 
    api.post(`/bookings/${bookingId}/messages/`, { message }),
};

export const paymentsAPI = {
  getPayments: () => api.get('/payments/'),
  createPayment: (paymentData: any) => api.post('/payments/', paymentData),
  getPayment: (paymentId: number) => api.get(`/payments/${paymentId}/`),
  processPayment: (paymentId: number, data: any) => 
    api.post(`/payments/${paymentId}/process/`, data),
};

export const chatAPI = {
  getChats: () => api.get('/chats/'),
  createChat: (participantId: number, participantType: string) => 
    api.post('/chats/', { participant_id: participantId, participant_type: participantType }),
  getChatMessages: (chatId: number) => 
    api.get(`/chats/${chatId}/messages/`),
  sendMessage: (chatId: number, message: string) => 
    api.post(`/chats/${chatId}/messages/`, { message }),
};

export const mediaAPI = {
  uploadFile: (formData: FormData) => 
    api.post('/media/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getFiles: () => api.get('/media/'),
  deleteFile: (fileId: number) => api.delete(`/media/${fileId}/`),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard-stats/'),
  getUsers: () => api.get('/admin/users/'),
  getVendors: () => api.get('/admin/vendors/'),
  updateUserStatus: (userId: number, status: string) => 
    api.patch(`/admin/users/${userId}/`, { status }),
};

export default api;