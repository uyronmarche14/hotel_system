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
export const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<{ success: boolean; data?: Booking; error?: string; validationErrors?: any[] }> => {
  try {
    // Ensure all required fields are present and properly formatted
    const enhancedBookingData = {
      ...bookingData,
      // Ensure adults is at least 1
      adults: bookingData.adults || 1,
      // Set a default payment method if none provided
      paymentMethod: bookingData.paymentMethod || 'credit_card',
      // Ensure we have proper dates
      checkIn: formatDateForAPI(bookingData.checkIn),
      checkOut: formatDateForAPI(bookingData.checkOut),
      // Ensure totalPrice is a valid number greater than 0
      totalPrice: validateTotalPrice(bookingData.totalPrice),
      // Calculate nights if not provided
      nights: bookingData.nights || calculateNights(bookingData.checkIn, bookingData.checkOut),
    };
    
    console.log('Sending booking data:', JSON.stringify(enhancedBookingData));
    
    const response = await fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders()
      },
      body: JSON.stringify(enhancedBookingData)
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.log('Booking API error response:', JSON.stringify(responseData));
      return {
        success: false,
        error: responseData.message || `Error creating booking: ${response.status}`,
        validationErrors: responseData.errors
      };
    }

    console.log('Booking created successfully:', responseData);
    return {
      success: true,
      data: responseData.data
    };
  } catch (error) {
    console.error('Failed to create booking:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Validate total price to ensure it's a positive number
 * Returns a valid price or a default minimum price
 */
const validateTotalPrice = (price: number | undefined): number => {
  // Check if price is valid
  if (typeof price !== 'number' || isNaN(price) || price <= 0) {
    console.warn(`Invalid totalPrice: ${price}, setting minimum valid price`);
    // Return a default minimum price if invalid
    return 5000; // Minimum price of 5000
  }
  return price;
};

/**
 * Calculate number of nights between two dates
 */
const calculateNights = (checkIn: string | Date | undefined, checkOut: string | Date | undefined): number => {
  try {
    const inDate = checkIn ? new Date(checkIn) : new Date();
    // If checkout is undefined, set it to the day after checkin
    const outDate = checkOut ? new Date(checkOut) : new Date(inDate.getTime() + 86400000);
    
    // Validate dates
    if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) {
      console.warn('Invalid date for nights calculation, using default');
      return 1; // Default to 1 night
    }
    
    // Calculate difference in days
    const timeDiff = outDate.getTime() - inDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Ensure at least 1 night
    return nights > 0 ? nights : 1;
  } catch (error) {
    console.error('Error calculating nights:', error);
    return 1; // Default to 1 night on error
  }
};

/**
 * Format date for API submission
 * Ensures dates are in the correct format for the API
 */
const formatDateForAPI = (date: string | Date | undefined): string => {
  if (!date) {
    // Use tomorrow as default check-in date if none provided
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
  
  // If it's already a Date object, format it
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  
  // If it's a string, parse it and format it
  try {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      // Make sure the date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (parsedDate < today) {
        // If date is in the past, use tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
      }
      
      return parsedDate.toISOString().split('T')[0];
    }
  } catch (e) {
    // Ignore parsing errors
  }
  
  // If all else fails, use tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
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