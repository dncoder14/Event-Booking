import api from './axios';

export const authApi = {
  register: (data: { name: string; email: string; password: string }) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
};

export const eventsApi = {
  getAll: (params?: { name?: string; venue?: string; category?: string }) => api.get('/events', { params }),
  getById: (id: string) => api.get(`/events/${id}`),
  getSeats: (id: string) => api.get(`/events/${id}/seats`),
  create: (data: object) => api.post('/events', data),
  update: (id: string, data: object) => api.put(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
};

export const bookingsApi = {
  lockSeats: (data: { eventId: string; seatIds: string[] }) => api.post('/bookings/lock-seats', data),
  processPayment: (id: string, paymentMethod: string) => api.post(`/bookings/${id}/payment`, { paymentMethod }),
  getMyBookings: () => api.get('/bookings/my'),
  getById: (id: string) => api.get(`/bookings/${id}`),
  getAllBookings: () => api.get('/bookings/all'),
  cancel: (id: string) => api.delete(`/bookings/${id}`),
};

export const uploadApi = {
  uploadBanner: (file: File) => {
    const form = new FormData();
    form.append('banner', file);
    return api.post('/upload/banner', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};
