"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaFileAlt, FaUsers, FaChartBar, FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp, FaBed, FaInfoCircle } from "react-icons/fa";
import { getUserBookingHistory, RoomStat, BookingHistoryItem } from "@/app/lib/bookingService";

// Fallback image path - this should be in your public directory
const FALLBACK_IMAGE = "/images/room-placeholder.jpg";

export default function BookingHistoryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [stats, setStats] = useState<{
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
  } | null>(null);
  const [roomStats, setRoomStats] = useState<RoomStat[]>([]);
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    // Get email from localStorage or sessionStorage if available
    const storedEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (!email) return;
    
    const fetchBookingHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getUserBookingHistory(email);
        setStats(response.stats);
        setRoomStats(response.roomStats);
      } catch (err) {
        console.error("Error fetching booking history:", err);
        setError("Failed to load your booking history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookingHistory();
  }, [email]);

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const submittedEmail = formData.get('email') as string;
    if (submittedEmail) {
      setEmail(submittedEmail);
      // Save for future use
      localStorage.setItem('userEmail', submittedEmail);
    }
  };

  // Toggle room expansion to show bookings
  const toggleRoomExpansion = (roomType: string) => {
    if (expandedRoom === roomType) {
      setExpandedRoom(null);
    } else {
      setExpandedRoom(roomType);
    }
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format price function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(price);
  };
  
  // Function to determine the CSS class based on booking status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to safely get image URLs - handles fallbacks for external URLs
  const getImageUrl = (url: string) => {
    // If URL is empty or undefined, return fallback
    if (!url) return FALLBACK_IMAGE;
    
    // If URL is already a relative path (local image), use it
    if (url.startsWith('/')) return url;
    
    // Handle known domains
    if (url.includes('res.cloudinary.com')) return url;
    
    // For other URLs, use fallback
    return FALLBACK_IMAGE;
  };

  // Email lookup form when no email is set
  if (!email) {
    return (
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C3F32] mb-6 sm:mb-8">My Booking History</h1>
        <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Find your booking history</h2>
          <p className="text-gray-600 mb-4">Enter the email address you used to make your bookings.</p>
          
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="w-full p-2 border border-gray-300 rounded" 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#1C3F32] text-white py-2 rounded-md hover:bg-[#1C3F32]/90 transition-colors"
            >
              View My History
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C3F32] mb-6 sm:mb-8">My Booking History</h1>
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3">Loading your booking history...</span>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C3F32] mb-6 sm:mb-8">My Booking History</h1>
        <div className="bg-red-50 p-4 rounded-md flex items-center text-red-700 mb-6">
          <FaTimesCircle className="w-5 h-5 mr-2" />
          <p>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#1C3F32] text-white px-4 py-2 rounded-md hover:bg-[#1C3F32]/90 transition-colors"
        >
          Refresh Page
        </button>
      </main>
    );
  }

  // No history found
  if (roomStats.length === 0) {
    return (
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C3F32]">My Booking History</h1>
          <Link href="/bookings" className="text-[#1C3F32] hover:underline flex items-center">
            <FaFileAlt className="mr-1" />
            View My Bookings
          </Link>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <FaInfoCircle className="mx-auto text-[#1C3F32] text-4xl mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Booking History Found</h2>
          <p className="text-gray-600 mb-6">You don't have any completed or cancelled bookings in your history yet.</p>
          <Link href="/dashboard" className="inline-block bg-[#1C3F32] text-white px-6 py-2 rounded-md hover:bg-[#1C3F32]/90 transition-colors">
            Browse Available Rooms
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C3F32]">My Booking History</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Viewing history for: <span className="font-medium">{email}</span>
            <button 
              onClick={() => {
                setEmail('');
                localStorage.removeItem('userEmail');
                sessionStorage.removeItem('userEmail');
              }}
              className="ml-2 text-[#1C3F32] underline"
            >
              Change
            </button>
          </div>
          <Link href="/bookings" className="text-[#1C3F32] hover:underline flex items-center text-sm">
            <FaFileAlt className="mr-1" />
            Current Bookings
          </Link>
        </div>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-[#1C3F32]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalBookings || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#1C3F32]/10 flex items-center justify-center">
              <FaFileAlt className="text-[#1C3F32] text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Completed Stays</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.completedBookings || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Cancelled Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.cancelledBookings || 0}</p>
              <p className="text-xs text-gray-500 mt-1">These bookings were cancelled and refunded</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <FaTimesCircle className="text-red-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-gray-800">{formatPrice(stats?.totalRevenue || 0)}</p>
              <p className="text-xs text-gray-500 mt-1">From completed stays only</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <FaChartBar className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Room Statistics */}
      <h2 className="text-xl font-bold text-[#1C3F32] mb-4 border-b pb-2">Rooms You've Booked</h2>
      
      <div className="space-y-4">
        {roomStats.map((room) => (
          <div key={room.roomType} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleRoomExpansion(room.roomType)}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center mb-3 sm:mb-0 w-full sm:w-auto">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shadow-sm">
                    <Image
                      src={getImageUrl(room.imageUrl)}
                      alt={room.roomTitle}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // TypeScript needs casting for currentTarget
                        const target = e.target as HTMLImageElement;
                        target.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{room.roomTitle}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <FaBed className="mr-1 text-[#1C3F32]" /> {room.roomType}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full sm:w-auto">
                  <div className="text-center px-4 py-2 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Times Booked</p>
                    <p className="text-lg font-semibold text-gray-800">{room.count}</p>
                  </div>
                  
                  <div className="text-center px-4 py-2 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Total Spent</p>
                    <p className="text-lg font-semibold text-[#1C3F32]">{formatPrice(room.totalRevenue)}</p>
                  </div>
                  
                  <div className="flex items-center justify-center px-2">
                    {expandedRoom === room.roomType ? (
                      <div className="w-8 h-8 rounded-full bg-[#1C3F32]/10 flex items-center justify-center">
                        <FaChevronUp className="text-[#1C3F32]" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#1C3F32]/10 flex items-center justify-center">
                        <FaChevronDown className="text-[#1C3F32]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Expanded booking history */}
            {expandedRoom === room.roomType && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <h4 className="text-base font-medium text-[#1C3F32] mb-3 flex items-center">
                  <FaCalendarAlt className="mr-2" /> Booking History for this Room
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-[#1C3F32]/10">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Booking ID
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Check-in
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Check-out
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Guests
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {room.bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                            {booking.bookingId}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(booking.status)}`}>
                              {booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {formatDate(booking.checkIn)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {formatDate(booking.checkOut)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {booking.guests} guests × {booking.nights} nights
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <span className={booking.status === 'cancelled' ? 'line-through text-gray-500' : 'text-[#1C3F32] font-semibold'}>
                              {formatPrice(booking.totalPrice)}
                            </span>
                            {booking.status === 'cancelled' && 
                              <span className="ml-1 text-xs font-medium text-red-600">(Refunded)</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
} 