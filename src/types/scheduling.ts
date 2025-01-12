export type ServiceType = 'ONETIME' | 'YEARLY';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customer: Customer;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: ServiceType;
  numberOfPanels: number;
  isResidential: boolean;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  travelDistance: number;
  travelTime: number;
  totalCost: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_SERVICE_DURATION = 60; // minutes
export const TRAVEL_COST_PER_10KM = 100; // SEK 