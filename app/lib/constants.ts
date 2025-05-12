// API URL for backend connection
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Maximum file upload size in bytes (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Default pagination limit
export const DEFAULT_PAGINATION_LIMIT = 10;

// Token key in local storage
export const TOKEN_KEY = 'solace_manor_token';

// User key in local storage
export const USER_KEY = 'solace_manor_user'; 