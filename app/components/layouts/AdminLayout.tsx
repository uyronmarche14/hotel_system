"use client";

import { ReactNode, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaCalendarAlt, 
  FaBed, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle
} from 'react-icons/fa';
import Cookies from 'js-cookie';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed for mobile
  const [isMobile, setIsMobile] = useState(false);
  const [userInfo, setUserInfo] = useState<{name?: string; role?: string} | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Handle clicks outside sidebar to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile && 
        sidebarOpen && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile) {
      if (sidebarOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobile, sidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true); // Always open on desktop
      }
    };

    // Get user info from localStorage
    const getUserInfo = () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserInfo({
            name: user.name,
            role: user.role
          });
        }
      } catch (e) {
        console.error('Error getting user info:', e);
      }
    };

    handleResize(); // Initial check
    getUserInfo(); // Get user info
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  const handleLogout = () => {
    try {
      Cookies.remove('token');
      localStorage.removeItem('user');
      router.push('/admin-login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Users', path: '/admin/users', icon: <FaUsers /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <FaCalendarAlt /> },
    { name: 'Rooms', path: '/admin/rooms', icon: <FaBed /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300" 
          aria-hidden="true"
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${isMobile ? 'fixed z-40 shadow-xl' : 'relative'} 
          bg-white w-64 transition-transform duration-300 ease-in-out flex flex-col h-full border-r border-gray-100
        `}
        aria-label="Sidebar navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <Image 
              src="/images/hotel-logo.png"
              alt="Hotel Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="text-lg font-medium text-gray-800">THE SOLACE HOTEL</span>
          </div>
          {isMobile && (
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1C3F32] rounded-md p-1"
              aria-label="Close sidebar"
            >
              <FaTimes size={18} />
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="mx-4 p-3 mb-6 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-gray-500">
              <FaUserCircle size={20} />
            </div>
            <div>
              <div className="font-medium text-sm text-gray-800">{userInfo?.name || 'Admin User'}</div>
              <div className="text-xs text-gray-500 capitalize">{userInfo?.role || 'admin'}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto hide-scrollbar">
          <ul className="space-y-1.5">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all
                    ${pathname === item.path 
                      ? 'bg-gray-100 text-gray-900 font-medium' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }
                    focus:outline-none focus:ring-2 focus:ring-[#1C3F32] focus:ring-opacity-50
                  `}
                  aria-current={pathname === item.path ? 'page' : undefined}
                >
                  <span className="text-[18px]" aria-hidden="true">{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3F32] focus:ring-opacity-50"
          >
            <FaSignOutAlt aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Menu Toggle */}
        {isMobile && (
          <button 
            ref={toggleButtonRef}
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className={`
              fixed top-4 left-4 z-10 p-2 bg-white rounded-md shadow-sm text-gray-500 hover:text-gray-900
              focus:outline-none focus:ring-2 focus:ring-[#1C3F32]
              transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-64' : 'translate-x-0'}
            `}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={sidebarOpen}
            aria-controls="sidebar-navigation"
          >
            {sidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        )}
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-14 md:pt-6">
          <div className="w-full max-w-7xl mx-auto">
            <div className="mb-5 flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-800">
                {navItems.find(item => item.path === pathname)?.name || 'Admin Panel'}
              </h1>
            </div>
            <div className="w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 