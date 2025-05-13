import { API_URL } from './constants';
import Cookies from 'js-cookie';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePic?: string;
  phone?: string;
  address?: string;
  bio?: string;
  createdAt: string;
}

export interface Room {
  id: string;
  title: string;
  roomNumber: string;
  type: string;
  category: string;
  price: number;
  location: string;
  description: string;
  fullDescription?: string;
  capacity: number;
  maxOccupancy?: number;
  amenities: string[];
  additionalAmenities?: string[];
  features?: string[];
  images: string[];
  imageUrl?: string;
  href?: string;
  rating?: number;
  reviews?: number;
  bedType?: string;
  roomSize?: string;
  size?: string;
  viewType?: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  activeBookings: number;
  totalRooms: number;
  recentBookings: number;
  totalRevenue: number;
}

// Helper function to get the auth headers
const getAuthHeaders = () => {
  const token = Cookies.get('token');
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || ''}`,
  };
};

// Admin auth methods
export const adminLogin = async (credentials: { username: string; password: string }) => {
  try {
    const response = await fetch(`${API_URL}/auth/admin-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Admin login failed:', error);
    throw error;
  }
};

// Get dashboard stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await fetch(`${API_URL}/admin/dashboard`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching dashboard stats: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    throw error;
  }
};

// User Management API calls
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

// Booking Management API calls
export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    const response = await fetch(`${API_URL}/admin/bookings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching bookings: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    throw error;
  }
};

// Room Management API calls
export const getAllRooms = async (): Promise<Room[]> => {
  try {
    const response = await fetch(`${API_URL}/admin/rooms`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching rooms: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    throw error;
  }
};

export const getRoomById = async (roomId: string): Promise<Room> => {
  try {
    const response = await fetch(`${API_URL}/admin/rooms/${roomId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching room: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Failed to fetch room ${roomId}:`, error);
    throw error;
  }
};

export const createRoom = async (roomData: Omit<Room, 'id'>): Promise<Room> => {
  try {
    const response = await fetch(`${API_URL}/admin/rooms`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(roomData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Error creating room: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to create room:', error);
    throw error;
  }
};

export const updateRoom = async (roomId: string, roomData: Partial<Room>): Promise<Room> => {
  try {
    const response = await fetch(`${API_URL}/admin/rooms/${roomId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(roomData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Error updating room: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Failed to update room ${roomId}:`, error);
    throw error;
  }
};

export const deleteRoom = async (roomId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/admin/rooms/${roomId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Error deleting room: ${response.status}`);
    }
  } catch (error) {
    console.error(`Failed to delete room ${roomId}:`, error);
    throw error;
  }
}; 
 