"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/app/components/ui/buttons";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const logo ="https://res.cloudinary.com/ddnxfpziq/image/upload/v1746767008/preview__1_-removebg-preview_xrlzgr.png";
  
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };
  
  const navLinks = [
    { name: "Home", path: "/dashboard" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="w-full h-auto py-3 sm:h-24 flex flex-wrap items-center justify-between bg-custom-nav px-4 sm:px-8">
      <div className="flex items-center gap-2 sm:gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 sm:gap-4 hover:opacity-90 transition-opacity">
          <Image
            alt="logo"
            src={logo}
            width={50}
            height={50}
            className="object-contain sm:w-[70px] sm:h-[70px]"
          />
          <h1 className="cinzel text-xl sm:text-2xl md:text-3xl text-white font-bold truncate">
            THE SOLACE MANOR
          </h1>
        </Link>
      </div>

      {/* Mobile menu button */}
      <div className="flex md:hidden items-center ml-auto mr-2">
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

      {/* Authentication Buttons or User Profile */}
      {isAuthenticated ? (
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={toggleProfileMenu}
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white">
                {user?.profilePic ? (
                  <Image
                    src={user.profilePic}
                    alt="User Profile"
                    width={40}
                    height={40}
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/default-user.png";
                    }}
                  />
                ) : (
                  <FaUserCircle className="w-full h-full text-white" />
                )}
              </div>
              <span className="hidden md:inline">{user?.name || "User"}</span>
            </button>
            
            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
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
      ) : (
        <div className="hidden md:flex gap-4">
          <Link href="/login">
            <Button
              label="Sign In"
              className="h-10 w-32 hover:bg-opacity-90 transition-colors duration-200"
            />
          </Link>
          <Link href="/register">
            <Button
              variant="secondary"
              label="Register"
              className="h-10 w-32 hover:bg-opacity-90 transition-colors duration-200"
            />
          </Link>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="w-full md:hidden mt-4 pb-3">
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
            
            {isAuthenticated ? (
              <div className="flex flex-col gap-2 px-2">
                <Link 
                  href="/profile" 
                  className="text-white hover:text-gray-200 transition-colors duration-200 font-medium hover:underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link 
                  href="/bookings" 
                  className="text-white hover:text-gray-200 transition-colors duration-200 font-medium hover:underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-gray-200 transition-colors duration-200 font-medium hover:underline text-left"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex mt-4 gap-2 px-2">
                <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    label="Sign In"
                    className="h-10 w-full hover:bg-opacity-90 transition-colors duration-200"
                  />
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="secondary"
                    label="Register"
                    className="h-10 w-full hover:bg-opacity-90 transition-colors duration-200"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
