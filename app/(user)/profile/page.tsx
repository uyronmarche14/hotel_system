"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaEdit, FaHistory, FaSpinner } from "react-icons/fa";
import { getSafeImageUrl } from "@/app/lib/utils";
import SafeImage from "@/app/components/ui/SafeImage";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { API_URL } from "@/app/lib/constants";
import Cookies from "js-cookie";

// Extend the User type to avoid TypeScript errors
type ExtendedUser = {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  role?: string;
  phone?: string;
  createdAt?: string;
  address?: string;
  membershipLevel?: string;
  upcomingBookings?: number;
  pastBookings?: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState({ upcoming: 0, past: 0 });
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Fetch user profile and booking data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // Fetch user profile
        const profileResponse = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        // Fetch user bookings
        const bookingsResponse = await fetch(`${API_URL}/bookings/summary`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (bookingsResponse.ok) {
          const bookingData = await bookingsResponse.json();
          setBookings({
            upcoming: bookingData.data.upcoming || 0,
            past: bookingData.data.past || 0
          });
        }
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setFetchError('Unable to load profile data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  // If user is not available yet, show loading
  if (!user || isLoading) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }
  
  // Cast user to extended type
  const extendedUser = user as unknown as ExtendedUser;
  
  // User data with defaults for missing fields
  const userData = {
    name: extendedUser.name || "Guest User",
    email: extendedUser.email || "No email provided",
    phone: extendedUser.phone || "Not provided",
    joined: extendedUser.createdAt ? new Date(extendedUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "Recently",
    address: extendedUser.address || "No address provided",
    profilePic: extendedUser.profilePic && extendedUser.profilePic.startsWith('/uploads') 
      ? `${API_URL}${extendedUser.profilePic}` 
      : extendedUser.profilePic,
    upcomingBookings: bookings.upcoming,
    pastBookings: bookings.past,
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">User Profile</h1>
      
      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {fetchError}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with profile image */}
        <div className="bg-gradient-to-r from-gray-800 to-[#1C3F32] text-white p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white flex-shrink-0">
            <SafeImage
              src={userData.profilePic}
              imageType="profile"
              alt={userData.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">{userData.name}</h2>
            <p className="text-lg font-light">Member since {userData.joined}</p>
          </div>
        </div>
        
        {/* User information */}
        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 pb-2 mb-4 border-b border-gray-200">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">Email Address</p>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-[#1C3F32] text-xl" />
                  <p className="text-lg text-gray-800">{userData.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">Phone Number</p>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-[#1C3F32] text-xl" />
                  <p className="text-lg text-gray-800">{userData.phone}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">Member Since</p>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-[#1C3F32] text-xl" />
                  <p className="text-lg text-gray-800">{userData.joined}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">Address</p>
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-[#1C3F32] text-xl mt-1" />
                  <p className="text-lg text-gray-800">{userData.address}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Summary */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 pb-2 mb-4 border-b border-gray-200">
              Booking Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <p className="text-gray-600 font-medium mb-2">Upcoming Reservations</p>
                <p className="text-3xl font-bold text-[#1C3F32]">{userData.upcomingBookings}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <p className="text-gray-600 font-medium mb-2">Past Reservations</p>
                <p className="text-3xl font-bold text-[#1C3F32]">{userData.pastBookings}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/bookings" 
                className="flex-1 text-center bg-white border-2 border-[#1C3F32] text-[#1C3F32] py-3 px-6 rounded-md hover:bg-gray-50 transition-colors text-lg font-medium flex items-center justify-center gap-2"
              >
                <FaHistory /> View Booking History
              </Link>
              
              <button 
                onClick={handleEditProfile}
                className="flex-1 bg-[#1C3F32] text-white py-3 px-6 rounded-md hover:bg-[#1C3F32]/90 transition-colors text-lg font-medium flex items-center justify-center gap-2"
              >
                <FaEdit /> Edit Information
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 