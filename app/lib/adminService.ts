import { API_URL } from './constants';
import Cookies from 'js-cookie';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profilePic?: string;
  membershipLevel?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  _id: string;
  title: string;
  description?: string;
  fullDescription?: string;
  price: number;
  imageUrl: string;
  location?: string;
  category: string;
  rating?: number;
  maxOccupancy?: number;
  bedType?: string;
  roomSize?: string;
  amenities?: string[];
  additionalAmenities?: string[];
  isAvailable: boolean;
  href: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  users: {
    total: number;
    activeThisMonth: number;
    newThisWeek: number;
  };
  bookings: {
    total: number;
    pending: number;
    completed: number;
    canceled: number;
  };
  rooms: {
    total: number;
    occupied: number;
    available: number;
    maintenance: number;
  };
  revenue: {
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
}

// Helper function to get the admin auth headers
const getAdminHeaders = () => {
  const token = Cookies.get('adminToken');
  
  return {
    'Content-Type': 'application/json',
    'Admin-Authorization': token || '',
  };
};

// Get dashboard stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/stats`, {
      method: 'GET',
      headers: getAdminHeaders(),
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
    const response = await fetch(`${API_URL}/api/admin/users`, {
      method: 'GET',
      headers: getAdminHeaders(),
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

export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
      method: 'GET',
      headers: getAdminHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching user: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error updating user: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Failed to update user ${userId}:`, error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error deleting user: ${response.status}`);
    }
  } catch (error) {
    console.error(`Failed to delete user ${userId}:`, error);
    throw error;
  }
};

// Room Management API calls
export const getAllRooms = async (): Promise<Room[]> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/rooms`, {
      method: 'GET',
      headers: getAdminHeaders(),
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
    const response = await fetch(`${API_URL}/api/admin/rooms/${roomId}`, {
      method: 'GET',
      headers: getAdminHeaders(),
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

export const createRoom = async (roomData: Partial<Room>): Promise<Room> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/rooms`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(roomData),
    });

    if (!response.ok) {
      throw new Error(`Error creating room: ${response.status}`);
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
    const response = await fetch(`${API_URL}/api/admin/rooms/${roomId}`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(roomData),
    });

    if (!response.ok) {
      throw new Error(`Error updating room: ${response.status}`);
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
    const response = await fetch(`${API_URL}/api/admin/rooms/${roomId}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error deleting room: ${response.status}`);
    }
  } catch (error) {
    console.error(`Failed to delete room ${roomId}:`, error);
    throw error;
  }
}; 
 