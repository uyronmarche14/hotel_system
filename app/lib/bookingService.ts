import { API_URL } from '@/app/lib/constants';

// Defining types for our booking data
export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roomType: string;
  roomTitle: string;
  roomCategory: string;
  roomImage: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  specialRequests?: string;
  basePrice: number;
  taxAndFees: number;
  totalPrice: number;
  location?: string;
}

export interface Booking extends BookingFormData {
  _id: string;
  user?: string; // Made optional
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  bookingId: string;
  createdAt: string;
}

// Interface for booking history
export interface BookingHistoryItem {
  id: string;
  bookingId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalPrice: number;
  createdAt: string;
}

export interface RoomStat {
  roomType: string;
  roomTitle: string;
  count: number;
  totalRevenue: number;
  imageUrl: string;
  bookings: BookingHistoryItem[];
}

export interface BookingHistoryResponse {
  success: boolean;
  stats: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
  };
  roomStats: RoomStat[];
}

// API Error handling helper
async function handleResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  
  // Log the response for debugging
  console.log('Response status:', response.status);
  console.log('Response content type:', contentType);
  
  // Check if response is JSON before trying to parse it
  if (contentType && contentType.includes('application/json')) {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error response data:', data);
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      return data;
    } catch (error) {
      console.error('JSON parsing error:', error);
      throw new Error('Failed to parse server response');
    }
  } else {
    // Handle non-JSON responses like HTML error pages
    const text = await response.text();
    console.error('Received non-JSON response:', text.substring(0, 100) + '...');
    throw new Error(`Unexpected response type: ${contentType}`);
  }
}

// Function to create a new booking
export const createBooking = async (
  bookingData: BookingFormData
): Promise<{ success: boolean; data: Booking }> => {
  // Log the booking data being sent
  console.log('Sending booking data to API:', JSON.stringify(bookingData, null, 2));
  console.log('API URL:', `${API_URL}/bookings`);
  
  // Add timeout to fetch request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(bookingData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    // Log the response for debugging
    console.log('Booking API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Booking API error response:', errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await handleResponse(response);
    console.log('Booking API success response:', result);
    return result;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('Booking creation failed:', error);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    
    // Check if the API server is accessible
    try {
      const pingResponse = await fetch(`${API_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!pingResponse.ok) {
        throw new Error('API server is unreachable. Please try again later.');
      }
    } catch (pingError) {
      console.error('API server ping failed:', pingError);
      throw new Error('API server is unreachable. Please try again later.');
    }
    
    throw error;
  }
};

// Function to get all bookings for user by email
export const getUserBookings = async (
  email: string
): Promise<{ success: boolean; count: number; data: Booking[] }> => {
  try {
    const response = await fetch(`${API_URL}/bookings?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch user bookings:', error);
    throw error;
  }
};

// Function to get a single booking by ID
export const getBookingById = async (
  bookingId: string
): Promise<{ success: boolean; data: Booking }> => {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    throw error;
  }
};

// Function to cancel a booking
export const cancelBooking = async (
  bookingId: string
): Promise<{ success: boolean; data: Booking }> => {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    throw error;
  }
};

// Function to get booking history with analytics
export const getBookingHistory = async (): Promise<BookingHistoryResponse> => {
  try {
    const response = await fetch(`${API_URL}/bookings/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch booking history:', error);
    throw error;
  }
};

// Function to get booking history for a specific user
export const getUserBookingHistory = async (email: string): Promise<BookingHistoryResponse> => {
  try {
    const response = await fetch(`${API_URL}/bookings/history/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch user booking history:', error);
    throw error;
  }
}; 