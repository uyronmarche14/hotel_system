"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/app/components/ui/buttons";
import { FaBars, FaTimes, FaCalendarCheck } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import { usePathname } from "next/navigation";
import BookingDropdown from "../user/BookingDropdown";

import { API_URL } from "@/app/lib/constants";
import SafeImage from "@/app/components/ui/SafeImage";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBookingDropdown, setShowBookingDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });
  const logo =
    "https://res.cloudinary.com/ddnxfpziq/image/upload/v1746767008/preview__1_-removebg-preview_xrlzgr.png";

  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const bookingButtonRef = useRef<HTMLButtonElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const confirmLogoutRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    if (profileButtonRef.current) {
      const buttonRect = profileButtonRef.current.getBoundingClientRect();

      // Calculate dropdown position based on button position
      setDropdownPosition({
        top: buttonRect.bottom + window.scrollY,
        right: window.innerWidth - buttonRect.right,
      });
    }

    setShowProfileMenu((prev) => !prev);
    // Close booking dropdown if open
    if (showBookingDropdown) setShowBookingDropdown(false);
  };

  const toggleBookingDropdown = () => {
    setShowBookingDropdown((prev) => !prev);
    // Close profile menu if open
    if (showProfileMenu) setShowProfileMenu(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setShowProfileMenu(false);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
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

      if (
        confirmLogoutRef.current &&
        !confirmLogoutRef.current.contains(event.target as Node)
      ) {
        setShowLogoutConfirm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef, profileButtonRef, confirmLogoutRef]);

  // Update dropdown position when showing it
  useEffect(() => {
    if (showProfileMenu && profileButtonRef.current) {
      const buttonRect = profileButtonRef.current.getBoundingClientRect();

      setDropdownPosition({
        top: buttonRect.bottom + window.scrollY,
        right: window.innerWidth - buttonRect.right,
      });
    }
  }, [showProfileMenu]);

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
    <>
      <nav
        ref={navbarRef}
        className="w-full h-auto py-3 sm:h-24 flex flex-wrap items-center justify-between bg-custom-nav px-4 sm:px-8 relative z-[50]"
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 sm:gap-4 hover:opacity-90 transition-opacity"
          >
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
              className={`text-white transition-colors duration-200 font-medium hover:underline cinzel ${
                isActive(item.path) ? "underline font-bold" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Bookings Button with Dropdown for authenticated users */}
          {isAuthenticated && (
            <div className="relative">
              <button
                ref={bookingButtonRef}
                onClick={toggleBookingDropdown}
                className={`text-white transition-colors duration-200 font-medium hover:underline cinzel flex items-center ${
                  isActive("/bookings") ? "underline font-bold" : ""
                }`}
              >
                <FaCalendarCheck className="mr-1" />
                My Bookings
              </button>
              {/* Booking Dropdown Component */}
              <div className="relative">
                <BookingDropdown
                  isOpen={showBookingDropdown}
                  onClose={() => setShowBookingDropdown(false)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Authentication Buttons or User Profile */}
        {isAuthenticated ? (
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                ref={profileButtonRef}
                onClick={toggleProfileMenu}
                className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
              >
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white">
                  {user?.profilePic ? (
                    <SafeImage
                      src={
                        user.profilePic.startsWith("/uploads")
                          ? `${API_URL}${user.profilePic}`
                          : user.profilePic
                      }
                      alt="User Profile"
                      width={40}
                      height={40}
                      imageType="profile"
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src="/images/default-user.png"
                      alt="Default User Profile"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  )}
                </div>
                <span className="hidden md:inline cinzel">
                  {user?.name || "User"}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div
                  ref={profileMenuRef}
                  style={{
                    position: "fixed",
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
                      href="/bookings/history"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Booking History
                    </Link>
                    <button
                      onClick={handleLogoutClick}
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
                className="h-10 w-32 hover:bg-opacity-90 transition-colors duration-200 cinzel"
              />
            </Link>
            <Link href="/register">
              <Button
                variant="secondary"
                label="Register"
                className="h-10 w-32 hover:bg-opacity-90 transition-colors duration-200 cinzel"
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
                  className={`text-white transition-colors duration-200 font-medium hover:underline px-2 cinzel ${
                    isActive(item.path) ? "underline font-bold" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Add Bookings link for mobile when authenticated */}
              {isAuthenticated && (
                <Link
                  href="/bookings"
                  className={`text-white transition-colors duration-200 font-medium hover:underline px-2 cinzel flex items-center ${
                    isActive("/bookings") ? "underline font-bold" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaCalendarCheck className="mr-1" />
                  My Bookings
                </Link>
              )}
            </div>

            {/* Mobile authentication buttons */}
            {!isAuthenticated && (
              <div className="flex flex-col space-y-3 mt-4 px-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#1C3F32] text-white py-2 px-4 rounded text-center font-medium cinzel"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-white text-[#1C3F32] border border-[#1C3F32] py-2 px-4 rounded text-center font-medium cinzel"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile user profile options */}
            {isAuthenticated && (
              <div className="border-t border-white/20 mt-4 pt-3 px-2">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center mr-2">
                    {user?.profilePic ? (
                      <SafeImage
                        src={
                          user.profilePic.startsWith("/uploads")
                            ? `${API_URL}${user.profilePic}`
                            : user.profilePic
                        }
                        alt="User Profile"
                        width={32}
                        height={32}
                        imageType="profile"
                        className="object-cover"
                      />
                    ) : (
                      <Image
                        src="/images/default-user.png"
                        alt="Default User Profile"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <span className="text-white font-medium cinzel">
                    {user?.name || "User"}
                  </span>
                </div>

                <div className="flex flex-col space-y-2">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white/90 hover:text-white text-sm py-1 cinzel"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/bookings/history"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white/90 hover:text-white text-sm py-1 cinzel"
                  >
                    Booking History
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogoutClick();
                    }}
                    className="text-red-300 hover:text-red-200 text-sm py-1 text-left cinzel"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Logout confirmation dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div
            ref={confirmLogoutRef}
            className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl"
          >
            <h3 className="text-lg font-semibold mb-3">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
