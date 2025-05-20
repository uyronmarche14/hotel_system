/**
 * Auth Token Utility
 * Provides consistent token handling across the application
 */

/**
 * Get an authentication token from all available storage sources
 * @returns The authentication token or empty string if not found
 */
export const getAuthToken = (): string => {
  if (typeof window === 'undefined') {
    return ''; // Server-side rendering
  }

  // Try to get token from localStorage (multiple possible key names)
  const localStorageToken = 
    localStorage.getItem('solace_manor_token') || 
    localStorage.getItem('token');
  
  if (localStorageToken) {
    return localStorageToken;
  }
  
  // Try to get token from cookies
  const tokenCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('token=') || row.startsWith('authToken='));
    
  if (tokenCookie) {
    const [_, value] = tokenCookie.split('=');
    return value;
  }
  
  return '';
};

/**
 * Check if user is authenticated
 * @returns boolean indicating if authentication token exists
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Save authentication token to multiple storage sources for consistency
 * @param token The token to save
 */
export const saveAuthToken = (token: string): void => {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }
  
  // Save to localStorage
  localStorage.setItem('solace_manor_token', token);
  localStorage.setItem('token', token);
  
  // Save to cookies - 7 day expiry
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/`;
  document.cookie = `authToken=${token}; expires=${expires.toUTCString()}; path=/`;
};
