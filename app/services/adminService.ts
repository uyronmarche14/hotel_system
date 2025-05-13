import { API_URL } from "../lib/constants";
import Cookies from 'js-cookie';
import { User } from "./userService";
import { Booking } from "./bookingService";
import { RoomType } from "./roomService";

const getAuthHeaders = () => {
  const token = Cookies.get('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export interface AdminStats {
  totalUsers: number;
  totalBookings: number;
  totalRooms: number;
  totalRevenue: number;
  recentBookings: Booking[];
  topRooms: RoomType[];
}

/**
 * Fetches admin dashboard statistics
 */
export const getAdminStats = async (): Promise<AdminStats | null> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Error fetching admin stats: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return null;
  }
};

/**
 * Fetches all users (admin only)
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
};

/**
 * Fetches a user by ID (admin only)
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Error fetching user: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    return null;
  }
};

/**
 * Fetches all bookings (admin only)
 */
export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/bookings`, {
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
 * Updates a booking (admin only)
 */
export const updateBookingAdmin = async (bookingId: string, bookingData: Partial<Booking>): Promise<Booking | null> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/bookings/${bookingId}`, {
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
 * Creates a room (admin only)
 */
export const createRoom = async (roomData: Omit<RoomType, 'id'>): Promise<RoomType | null> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/rooms`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(roomData)
    });

    if (!response.ok) {
      throw new Error(`Error creating room: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to create room:', error);
    return null;
  }
};

/**
 * Updates a room (admin only)
 */
export const updateRoom = async (roomId: string, roomData: Partial<RoomType>): Promise<RoomType | null> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/rooms/${roomId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(roomData)
    });

    if (!response.ok) {
      throw new Error(`Error updating room: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Failed to update room ${roomId}:`, error);
    return null;
  }
};

/**
 * Deletes a room (admin only)
 */
export const deleteRoom = async (roomId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/rooms/${roomId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error deleting room: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete room ${roomId}:`, error);
    return false;
  }
}; 