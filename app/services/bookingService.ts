import { API_URL } from "../lib/constants";
import Cookies from 'js-cookie';

const getAuthHeaders = () => {
  const token = Cookies.get('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  bookingId?: string;
  roomTitle?: string;
  nights?: number;
  paymentMethod?: string;
  specialRequests?: string;
  adults?: number;
  children?: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Fetches all bookings for the current user
 */
export const getUserBookings = async (): Promise<Booking[]> => {
  try {
    const response = await fetch(`${API_URL}/api/bookings`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Error fetching bookings: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return [];
  }
};

/**
 * Fetches a single booking by ID
 */
export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
  try {
    const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Error fetching booking: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Failed to fetch booking ${bookingId}:`, error);
    return null;
  }
};

/**
 * Creates a new booking
 */
export const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking | null> => {
  try {
    const response = await fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      throw new Error(`Error creating booking: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to create booking:', error);
    return null;
  }
};

/**
 * Updates a booking
 */
export const updateBooking = async (bookingId: string, bookingData: Partial<Booking>): Promise<Booking | null> => {
  try {
    const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      throw new Error(`Error updating booking: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Failed to update booking ${bookingId}:`, error);
    return null;
  }
};

/**
 * Cancels a booking
 */
export const cancelBooking = async (bookingId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error cancelling booking: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Failed to cancel booking ${bookingId}:`, error);
    return false;
  }
}; 