'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { API_URL, ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_TOKEN, ADMIN_TOKEN_COOKIE } from '../lib/constants';

type Admin = {
  username: string;
  role: string;
};

interface AdminAuthContextType {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  admin: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => ({ success: false }),
  logout: () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Log admin credentials for demonstration/debugging
  useEffect(() => {
    console.log('Admin login is available with:');
    console.log('Username: admin@admin.com');
    console.log('Password: admin123');
  }, []);

  const loadAdmin = async () => {
    const storedToken = Cookies.get(ADMIN_TOKEN_COOKIE);
    
    if (!storedToken) {
      setLoading(false);
      return;
    }
    
    try {
      try {
        // Try to verify with server first
        const response = await fetch(`${API_URL}/api/admin/direct-verify`, {
          method: 'GET',
          headers: {
            'Admin-Authorization': storedToken,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAdmin(data.admin);
          setToken(storedToken);
        } else {
          Cookies.remove(ADMIN_TOKEN_COOKIE);
        }
      } catch (serverError) {
        console.error('Server connection error, using fallback verification', serverError);
        
        // If server is down but the token is the expected one, proceed with admin access
        if (storedToken === ADMIN_TOKEN) {
          setAdmin({
            username: ADMIN_USERNAME,
            role: 'admin'
          });
          setToken(storedToken);
        } else {
          Cookies.remove(ADMIN_TOKEN_COOKIE);
        }
      }
    } catch (error) {
      console.error('Error verifying admin:', error);
      Cookies.remove(ADMIN_TOKEN_COOKIE);
    } finally {
      setLoading(false);
    }
  };

  // Load admin on component mount
  useEffect(() => {
    loadAdmin();
  }, []);

  // Login
  const login = async (username: string, password: string) => {
    try {
      try {
        // Try to connect to server first
        const response = await fetch(`${API_URL}/api/admin/direct-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
          setAdmin(data.admin);
          setToken(data.token);
          Cookies.set(ADMIN_TOKEN_COOKIE, data.token, { expires: 7 });
          return { success: true };
        } else {
          return { success: false, message: data.message || 'Authentication failed' };
        }
      } catch (serverError) {
        console.error('Server connection error, using fallback login', serverError);
        
        // If server is down, use fallback login logic
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          const adminData = {
            username: ADMIN_USERNAME,
            role: 'admin'
          };
          
          setAdmin(adminData);
          setToken(ADMIN_TOKEN);
          Cookies.set(ADMIN_TOKEN_COOKIE, ADMIN_TOKEN, { expires: 7 });
          return { success: true };
        } else {
          return { success: false, message: 'Invalid admin credentials' };
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Connection error. Please try again.' };
    }
  };

  // Logout
  const logout = () => {
    setAdmin(null);
    setToken(null);
    Cookies.remove(ADMIN_TOKEN_COOKIE);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!admin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}; 