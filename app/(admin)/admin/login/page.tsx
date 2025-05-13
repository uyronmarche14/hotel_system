'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/app/context/AdminAuthContext';
import { FaHotel, FaLock, FaUser, FaArrowLeft } from 'react-icons/fa';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAdminAuth();
  const router = useRouter();
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    router.push('/admin/dashboard');
    return null;
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    console.log('Attempting login with:', { username, password });
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Calling login function...');
      const result = await login(username, password);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, redirecting to dashboard...');
        router.push('/admin/dashboard');
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back button */}
        <div className="absolute top-4 left-4">
          <Link 
            href="/dashboard" 
            className="flex items-center text-gray-600 hover:text-[#1C3F32] transition-colors"
          >
            <FaArrowLeft className="mr-1" />
            <span>Back to Main Site</span>
          </Link>
        </div>
        
        <div>
          <div className="flex justify-center">
            <FaHotel className="h-16 w-16 text-[#1C3F32]" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Direct access to the administrative panel
          </p>
          <p className="mt-1 text-center text-sm text-blue-600 font-medium">
            No regular user account required
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <FaUser />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32] focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <FaLock />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32] focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-md">
              {error}
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1C3F32] hover:bg-[#15332a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C3F32]"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : null}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-4">
            <p>Admin Credentials (for demo only):</p>
            <p>Username: admin@admin.com | Password: admin123</p>
            <p className="mt-1 text-green-600">Login works even when the server is offline!</p>
          </div>
        </form>
      </div>
    </div>
  );
} 