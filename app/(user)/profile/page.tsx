"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaCreditCard, FaStar } from "react-icons/fa";
import { getSafeImageUrl } from "@/app/lib/utils";
import SafeImage from "@/app/components/ui/SafeImage";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // If user is not available yet, show loading
  if (!user) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // User data with defaults for missing fields
  const userData = {
    name: user.name || "Guest User",
    email: user.email || "No email provided",
    phone: user.phone || "Not provided",
    joined: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "Recently",
    address: user.address || "No address provided",
    membershipLevel: user.membershipLevel || "Standard",
    profilePic: user.profilePic,
    upcomingBookings: user.upcomingBookings || 0,
    pastBookings: user.pastBookings || 0,
    loyaltyPoints: user.loyaltyPoints || 0
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  return (
    <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1C3F32] mb-6 sm:mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Left column - Profile Info */}
        <div className="col-span-1">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
            <div className="flex flex-col items-center mb-4 sm:mb-6">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#1C3F32] mb-3 sm:mb-4">
                <SafeImage
                  src={userData.profilePic}
                  imageType="profile"
                  alt={userData.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">{userData.name}</h2>
              <p className="text-[#1C3F32] font-medium text-sm sm:text-base">{userData.membershipLevel} Member</p>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <FaEnvelope className="text-[#1C3F32] min-w-5" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Email</p>
                  <p className="text-sm sm:text-base break-all">{userData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <FaPhone className="text-[#1C3F32] min-w-5" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                  <p className="text-sm sm:text-base">{userData.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <FaCalendarAlt className="text-[#1C3F32] min-w-5" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Member Since</p>
                  <p className="text-sm sm:text-base">{userData.joined}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 sm:gap-3">
                <FaMapMarkerAlt className="text-[#1C3F32] min-w-5 mt-1" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Address</p>
                  <p className="text-sm sm:text-base">{userData.address}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-6">
              <button 
                onClick={handleEditProfile}
                className="w-full bg-[#1C3F32] text-white py-2 rounded-md hover:bg-[#1C3F32]/90 transition-colors text-sm sm:text-base"
              >
                Edit Profile
              </button>
            </div>
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-lg sm:text-xl font-bold text-[#1C3F32] mb-3 sm:mb-4">Loyalty Program</h3>
            <div className="mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Your Points</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#1C3F32]">{userData.loyaltyPoints}</p>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">You need 750 more points to reach Platinum status</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[#1C3F32] h-2.5 rounded-full" style={{ width: "62%" }}></div>
            </div>
            <button className="w-full mt-3 sm:mt-4 border border-[#1C3F32] text-[#1C3F32] py-2 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base">
              View Benefits
            </button>
          </div>
        </div>
        
        {/* Right column - Bookings & Settings */}
        <div className="col-span-1 md:col-span-2">
          {/* Bookings Summary */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-[#1C3F32] mb-3 sm:mb-4">Your Bookings</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-500">Upcoming</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#1C3F32]">{userData.upcomingBookings}</p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-500">Past Stays</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#1C3F32]">{userData.pastBookings}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/bookings" className="w-full text-center bg-white border border-[#1C3F32] text-[#1C3F32] py-2 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base">
                View All Bookings
              </Link>
              <Link href="/reviews" className="w-full text-center flex items-center justify-center bg-white border border-[#1C3F32] text-[#1C3F32] py-2 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base">
                <FaStar className="mr-2" /> My Reviews
              </Link>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-[#1C3F32]">Payment Methods</h3>
              <button className="text-[#1C3F32] hover:underline text-sm sm:text-base">+ Add New</button>
            </div>
            
            <div className="border rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 sm:gap-3">
                  <FaCreditCard className="text-lg sm:text-xl text-[#1C3F32] min-w-5" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Visa ending in 1234</p>
                    <p className="text-xs sm:text-sm text-gray-500">Expires 09/25</p>
                  </div>
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 sm:py-1 text-xs bg-[#1C3F32] text-white rounded">Default</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-3 sm:p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 sm:gap-3">
                  <FaCreditCard className="text-lg sm:text-xl text-[#1C3F32] min-w-5" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Mastercard ending in 5678</p>
                    <p className="text-xs sm:text-sm text-gray-500">Expires 11/26</p>
                  </div>
                </div>
                <div>
                  <button className="text-[#1C3F32] hover:underline text-xs sm:text-sm">Set as default</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Account Settings */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-lg sm:text-xl font-bold text-[#1C3F32] mb-3 sm:mb-4">Account Settings</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="border-b pb-3 sm:pb-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm sm:text-base">Email Notifications</p>
                  <div className="relative inline-block w-10 h-5 sm:w-12 sm:h-6">
                    <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                    <span className="absolute cursor-pointer inset-0 bg-[#1C3F32] rounded-full"></span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">Receive updates about your bookings and special offers</p>
              </div>
              
              <div className="border-b pb-3 sm:pb-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm sm:text-base">Two-Factor Authentication</p>
                  <div className="relative inline-block w-10 h-5 sm:w-12 sm:h-6">
                    <input type="checkbox" className="opacity-0 w-0 h-0" />
                    <span className="absolute cursor-pointer inset-0 bg-gray-300 rounded-full"></span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm sm:text-base">Language Preference</p>
                  <select className="border rounded p-1 text-xs sm:text-sm">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 