'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AdminAuthProvider, useAdminAuth } from '@/app/context/AdminAuthContext';
import {
  FaHome,
  FaUsers,
  FaBed,
  FaChartLine,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHotel
} from 'react-icons/fa';
import { useState } from 'react';

// Admin sidebar links
const sidebarLinks = [
  { path: '/admin/dashboard', icon: <FaHome className="w-5 h-5" />, label: 'Dashboard' },
  { path: '/admin/users', icon: <FaUsers className="w-5 h-5" />, label: 'Users' },
  { path: '/admin/rooms', icon: <FaBed className="w-5 h-5" />, label: 'Hotel Rooms' },
  { path: '/admin/stats', icon: <FaChartLine className="w-5 h-5" />, label: 'Statistics' },
];

interface AdminLayoutContentProps {
  children: ReactNode;
}

const AdminLayoutContent = ({ children }: AdminLayoutContentProps) => {
  const { isAuthenticated, loading, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!loading && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router, pathname]);

  // Show loading indicator while checking authentication
  if (loading && pathname !== '/admin/login') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If we're on the login page, just render children without the admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="fixed z-50 top-4 left-4 md:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-[#1C3F32] text-white focus:outline-none"
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1C3F32] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 bg-[#15332a] text-white p-4 sticky top-0 border-b border-[#15332a]">
          <FaHotel className="w-6 h-6 mr-2" />
          <h1 className="text-xl font-bold">Hotel Admin</h1>
        </div>

        <div className="py-4 flex flex-col h-[calc(100%-4rem)] justify-between">
          <nav className="space-y-1 px-3">
            {sidebarLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors ${
                  pathname === link.path
                    ? 'bg-[#15332a] text-white'
                    : 'text-gray-200 hover:bg-[#15332a] hover:text-white'
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="px-3 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-200 hover:bg-[#15332a] hover:text-white rounded-md transition-colors"
            >
              <FaSignOutAlt className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow h-16 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-800">
            {sidebarLinks.find((link) => link.path === pathname)?.label || 'Admin Panel'}
          </h2>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
} 
 