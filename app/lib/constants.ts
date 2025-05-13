// API base URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// If API is unavailable, admin can still log in with hardcoded credentials
export const ADMIN_USERNAME = 'admin@admin.com';
export const ADMIN_PASSWORD = 'admin123';
export const ADMIN_TOKEN = 'admin-token-secure-123456';

// Maximum file upload size in bytes (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Default pagination limit
export const DEFAULT_PAGINATION_LIMIT = 10;

// Token key in local storage
export const TOKEN_KEY = 'solace_manor_token';

// User key in local storage
export const USER_KEY = 'solace_manor_user';

// Token cookie names
export const AUTH_TOKEN_COOKIE = 'authToken';
export const ADMIN_TOKEN_COOKIE = 'adminToken';

// Image fallbacks
export const PROFILE_IMAGE_FALLBACK = '/images/default-avatar.png';
export const ROOM_IMAGE_FALLBACK = '/images/room-placeholder.jpg';

// Room categories
export const ROOM_CATEGORIES = [
  { id: 'standard-room', name: 'Standard Room' },
  { id: 'deluxe-room', name: 'Deluxe Room' },
  { id: 'executive-suite', name: 'Executive Suite' },
  { id: 'presidential-suite', name: 'Presidential Suite' },
  { id: 'honeymoon-suite', name: 'Honeymoon Suite' },
  { id: 'family-room', name: 'Family Room' }
]; 