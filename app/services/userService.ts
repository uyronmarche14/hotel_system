import { API_URL } from "../lib/constants";
import Cookies from 'js-cookie';

const getAuthHeaders = () => {
  const token = Cookies.get('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

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
  updatedAt?: string;
}

/**
 * Fetches the current user's profile
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Error fetching user profile: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
};

/**
 * Updates the current user's profile
 */
export const updateUserProfile = async (userData: Partial<User>): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`Error updating user profile: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    return null;
  }
};

/**
 * Updates user password
 */
export const updatePassword = async (
  currentPassword: string, 
  newPassword: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/users/me/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });

    if (!response.ok) {
      throw new Error(`Error updating password: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Failed to update password:', error);
    return false;
  }
};

/**
 * Uploads a profile picture
 */
export const uploadProfilePicture = async (formData: FormData): Promise<string | null> => {
  try {
    const token = Cookies.get('token');
    const response = await fetch(`${API_URL}/api/users/me/profile-picture`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Error uploading profile picture: ${response.status}`);
    }

    const data = await response.json();
    return data.data.profilePic;
  } catch (error) {
    console.error('Failed to upload profile picture:', error);
    return null;
  }
}; 