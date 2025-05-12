"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBell, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import { usePathname } from "next/navigation";

const UserNavbar = () => {
  const [notificationCount, setNotificationCount] = useState(3);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  
  const userProfilePic = user?.profilePic || "https://res.cloudinary.com/ddnxfpziq/image/upload/v1746281526/photo_2025-04-08_20-22-13_z7mxk8.jpg";

  const toggleProfileMenu = () => {
    if (!showProfileMenu && profileButtonRef.current && navbarRef.current) {
      // Calculate position before toggling to ensure it's positioned correctly
      const buttonRect = profileButtonRef.current.getBoundingClientRect();
      const navbarRect = navbarRef.current.getBoundingClientRect();
      
      setDropdownPosition({
        top: navbarRect.top + navbarRect.height,
        right: window.innerWidth - buttonRect.right
      });
    }
    setShowProfileMenu((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle click outside of the profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        profileButtonRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuRef, profileButtonRef]);

  // Update dropdown position when showing it
  useEffect(() => {
    if (showProfileMenu && profileButtonRef.current) {
      const buttonRect = profileButtonRef.current.getBoundingClientRect();
      const navbarRect = navbarRef.current?.getBoundingClientRect() || { top: 0, height: 0 };
      
      setDropdownPosition({
        top: navbarRect.top + navbarRect.height,
        right: window.innerWidth - buttonRect.right
      });
    }
  }, [showProfileMenu]);

  const navLinks = [
    { name: "Home", path: "/dashboard" },
    { name: "Rooms", path: "/dashboard" },
    { name: "Bookings", path: "/bookings" },
    { name: "Profile", path: "/profile" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav ref={navbarRef} className="w-full h-auto sm:h-24 flex flex-wrap items-center justify-between bg-[#1C3F32] px-4 sm:px-8 py-3 sm:py-0">
      <div className="flex items-center gap-2 sm:gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 sm:gap-4 hover:opacity-90 transition-opacity">
          <div className="flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-white rounded-full">
            <span className="text-[#1C3F32] font-bold text-sm sm:text-xl">AP</span>
          </div>
          <h1 className="cinzel text-lg sm:text-2xl md:text-3xl text-white font-bold truncate">
            THE SOLACE MANOR
          </h1>
        </Link>
      </div>

      {/* Mobile menu button */}
      <div className="flex md:hidden items-center">
        <button 
          onClick={toggleMobileMenu}
          className="text-white hover:text-gray-200 transition-colors p-2"
        >
          {mobileMenuOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-8">
        {navLinks.map((item, index) => (
          <Link
            key={index}
            href={item.path}
            className={`text-white transition-colors duration-200 font-medium hover:underline ${
              isActive(item.path) ? 'underline font-bold' : ''
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full mt-4 pb-2">
          <div className="flex flex-col space-y-4">
            {navLinks.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className={`text-white transition-colors duration-200 font-medium hover:underline px-2 ${
                  isActive(item.path) ? 'underline font-bold' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 sm:gap-6 order-3 md:order-none">
        {/* Notification Bell */}
        <div className="relative">
          <button className="text-white hover:text-gray-200 transition-colors">
            <FaBell className="text-xl sm:text-2xl" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
        
        {/* User Profile */}
        <div className="relative">
          <button 
            ref={profileButtonRef}
            onClick={toggleProfileMenu}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white">
              <Image
                src={userProfilePic}
                alt="User Profile"
                width={40}
                height={40}
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/default-user.png";
                }}
              />
            </div>
            <span className="hidden md:inline">{user?.name || "Guest"}</span>
          </button>
          
          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div 
              ref={profileMenuRef}
              style={{
                position: 'fixed',
                top: `${dropdownPosition.top}px`,
                right: `${dropdownPosition.right}px`,
              }}
              className="w-48 bg-white rounded-md shadow-xl z-[9999] border border-gray-200 overflow-visible"
            >
              <div className="py-1">
                <Link 
                  href="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  My Profile
                </Link>
                <Link 
                  href="/bookings" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  My Bookings
                </Link>
                <Link 
                  href="/settings" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Settings
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar; 