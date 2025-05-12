"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type User = {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string, redirectUrl?: string) => Promise<boolean>;
  logout: () => void;
  confirmLogout: () => Promise<boolean>;
  register: (name: string, email: string, password: string, redirectUrl?: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = Cookies.get('token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setToken(storedToken);
        
        // Verify token validity with backend
        verifyToken(storedToken);
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        localStorage.removeItem('user');
        Cookies.remove('token');
        setToken(null);
      }
    }
  }, []);
  
  // Handle browser's back button and page unload events
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only apply this for authenticated users
      if (isAuthenticated) {
        // This message won't be shown in most modern browsers due to security,
        // but it will trigger the confirmation dialog
        const message = 'Are you sure you want to leave? You will be logged out.';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    // Add event listener for beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Handle popstate (back/forward button)
    const handlePopState = (e: PopStateEvent) => {
      if (isAuthenticated) {
        // In a real app, you would save the current route and implement a way to
        // restore it if user cancels, but that's complex for this implementation
        if (confirm('Are you sure you want to navigate away? You will be logged out.')) {
          logout();
        } else {
          // Prevent navigation by pushing current route again
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Push initial state to enable popstate handling
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated]);
  
  // Verify token with backend
  const verifyToken = async (token: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.get(`${API_URL}/auth/me`, config);
    } catch (error) {
      console.error('Token verification failed', error);
      // Token is invalid, log the user out
      logout();
    }
  };

  // Login function
  const login = async (email: string, password: string, redirectUrl?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    console.log(`Attempting login for user: ${email}`);
    console.log(`API URL: ${API_URL}/auth/login`);
    
    try {
      // Add timeout to the axios request
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      }, { 
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Login response:', response.data);
      
      if (!response.data) {
        console.error('Empty response from server');
        setLoading(false);
        setError('Empty response from server. Please try again.');
        return false;
      }
      
      const { user, token } = response.data;
      
      if (!user) {
        console.error('No user in response:', response.data);
        setLoading(false);
        setError('Invalid response from server. Please try again.');
        return false;
      }
      
      // Save user to state and storage
      setUser(user);
      setIsAuthenticated(true);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Store token in cookies for middleware access
      Cookies.set('token', token, { expires: 30, path: '/' });
      
      setLoading(false);
      
      console.log('Login successful, redirecting...');
      
      // Navigate to the redirect URL if provided, or to appropriate dashboard based on user role
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        // Determine the correct route based on user role
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          // Use the correct path for standard user dashboard
          router.push('/dashboard');
        }
      }
      
      return true;
    } catch (error: any) {
      setLoading(false);
      
      // Improved error handling
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server error response status:', error.response.status);
        console.error('Server error response data:', error.response.data);
        console.error('Server error response headers:', error.response.headers);
        
        errorMessage = error.response.data?.message || 'Server error. Please try again.';
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request error:', error.message);
        errorMessage = 'Request failed. Please try again.';
      }
      
      setError(errorMessage);
      console.error('Login failed:', error.toString());
      return false;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, redirectUrl?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    console.log(`Attempting registration for user: ${email}`);
    console.log(`API URL: ${API_URL}/auth/register`);
    
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      
      console.log('Registration response:', response.data);
      const { user, token } = response.data;
      
      // Instead of storing user data and redirecting to dashboard,
      // we'll redirect to login with a success flag
      setLoading(false);
      
      console.log('Registration successful, redirecting to login...');
      
      // Navigate to login page with registration_success flag
      const loginPath = `/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}&registration_success=true` : '?registration_success=true'}`;
      router.push(loginPath);
      
      return true;
    } catch (error: any) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration failed', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      return false;
    }
  };

  // Confirm logout function
  const confirmLogout = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const confirmed = window.confirm('Are you sure you want to log out?');
      if (confirmed) {
        logout();
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };

  // Logout function
  const logout = () => {
    console.log('Logging out user');
    
    // Clear user data and auth state
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
    
    // Remove from storage
    localStorage.removeItem('user');
    Cookies.remove('token');
    
    // Redirect to login page
    router.push('/login?session_expired=true');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        token,
        login,
        logout,
        confirmLogout,
        register,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 