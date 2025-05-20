/**
 * Admin API Helper Functions
 * 
 * Provides utility functions for making authenticated admin API requests
 * with proper error handling and token management
 */

import Cookies from 'js-cookie';
import { API_URL } from '../lib/constants';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

/**
 * Make an authenticated API request to the admin endpoints
 */
export async function fetchWithAdminAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Get the authentication token from all possible storage locations
  const token = Cookies.get('token') || 
               Cookies.get('authToken') || 
               localStorage.getItem('token') || 
               localStorage.getItem('solace_manor_token');
  
  // Debug token retrieval
  console.log('Auth token check:', {
    cookieToken: !!Cookies.get('token'),
    cookieAuthToken: !!Cookies.get('authToken'),
    localStorageToken: !!localStorage.getItem('token'),
    solaceToken: !!localStorage.getItem('solace_manor_token')
  });
  
  if (!token) {
    throw new Error('Authentication required. Please log in again.');
  }
  
  // Prepare headers with authentication
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {})
  };
  
  try {
    // Make the request with authentication
    const response = await fetch(endpoint, {
      ...options,
      headers,
      cache: 'no-store' // Disable caching for admin requests
    });
    
    // Handle non-2xx responses
    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        throw new Error('Authentication failed. Please log in again.');
      }
      
      // Try to parse error response
      const errorText = await response.text();
      let errorData: { message?: string };
      
      try {
        errorData = JSON.parse(errorText);
      } catch {
        throw new Error(`Request failed with status ${response.status}`);
      }
      
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    // Parse successful response
    const data = await response.json();
    return data as ApiResponse<T>;
  } catch (error) {
    // Re-throw any error with proper TypeScript typing
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
}

/**
 * Get data from an admin API endpoint
 */
export async function getAdminData<T>(path: string): Promise<T | null> {
  try {
    const response = await fetchWithAdminAuth<T>(`/api/admin/${path}`);
    
    // Handle both response formats for backward compatibility
    if (response.data) {
      return response.data;
    } else if ('rooms' in response) {
      return (response as unknown as { rooms: T }).rooms;
    } else if ('users' in response) {
      return (response as unknown as { users: T }).users;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching admin data from ${path}:`, error);
    throw error;
  }
}
