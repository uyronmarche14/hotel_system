"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBell, FaUserCircle } from "react-icons/fa";
import Button from "@/app/components/ui/buttons";

const UserNavbar = () => {
  const [notificationCount, setNotificationCount] = useState(3);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const logo = "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744609832/Vintage_and_Luxury_Hotel_Decorative_Ornamental_Logo_3_jm9wzq.png";
  const userProfilePic = "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744609832/user-profile-default.jpg";

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <nav className="w-full h-24 flex items-center justify-between bg-custom-nav px-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
          <Image
            alt="logo"
            src={logo}
            width={70}
            height={70}
            className="object-contain"
            onError={(e) => {
              e.currentTarget.src = "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744609832/Vintage_and_Luxury_Hotel_Decorative_Ornamental_Logo_3_jm9wzq.png";
            }}
          />
          <h1 className="cinzel text-3xl text-white font-bold">
            THE ANETOS PALACE
          </h1>
        </Link>
      </div>

      <div className="hidden md:flex space-x-8">
        {[
          { name: "Home", path: "/dashboard" },
          { name: "Rooms", path: "/dashboard" },
          { name: "Bookings", path: "/bookings" },
          { name: "Profile", path: "/profile" }
        ].map((item, index) => (
          <Link
            key={index}
            href={item.path}
            className="text-white hover:text-gray-200 transition-colors duration-200 font-medium hover:underline"
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <div className="relative">
          <button className="text-white hover:text-gray-200 transition-colors">
            <FaBell className="text-2xl" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
        
        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={toggleProfileMenu}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
              <Image
                src={userProfilePic}
                alt="User Profile"
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/40";
                }}
              />
            </div>
            <span className="hidden md:inline">John Doe</span>
          </button>
          
          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <Link 
                  href="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </Link>
                <Link 
                  href="/bookings" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Bookings
                </Link>
                <Link 
                  href="/settings" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <Link 
                  href="/login" 
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign Out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar; 