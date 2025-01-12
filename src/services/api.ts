import axios from 'axios';
import { Booking, ServiceType } from '../types/scheduling';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // In production, the API will be served from the same domain
  : 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreateBookingData {
  customerId: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: ServiceType;
  numberOfPanels: number;
  isResidential: boolean;
  address: string;
  location: { lat: number; lng: number };
  travelDistance: number;
  travelTime: number;
  totalCost: number;
}

export interface CreateCustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const bookingService = {
  async createBooking(data: CreateBookingData) {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  },

  async getBookings() {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  },

  async getBooking(id: string) {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  async updateBooking(id: string, data: Partial<CreateBookingData>) {
    const response = await api.put<Booking>(`/bookings/${id}`, data);
    return response.data;
  },

  async deleteBooking(id: string) {
    await api.delete(`/bookings/${id}`);
  },

  async getDailyStats(date?: string) {
    const response = await api.get('/bookings/stats/daily', {
      params: { date }
    });
    return response.data;
  }
};

export const customerService = {
  async createCustomer(data: CreateCustomerData) {
    const response = await api.post('/customers', data);
    return response.data;
  },

  async getCustomer(id: string) {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  async updateCustomer(id: string, data: Partial<CreateCustomerData>) {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  }
};

export const subscriptionService = {
  async createSubscription(customerId: string, data: {
    startDate: Date;
    endDate: Date;
    totalPanels: number;
    monthlyPrice: number;
  }) {
    const response = await api.post('/subscriptions', {
      customerId,
      ...data
    });
    return response.data;
  },

  async getCustomerSubscription(customerId: string) {
    const response = await api.get(`/subscriptions/customer/${customerId}`);
    return response.data;
  },

  async cancelSubscription(id: string) {
    const response = await api.post(`/subscriptions/${id}/cancel`);
    return response.data;
  }
}; 