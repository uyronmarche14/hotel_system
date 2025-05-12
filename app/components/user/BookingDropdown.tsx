"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getUserBookings, Booking } from "@/app/lib/bookingService";
import { useAuth } from "@/app/context/AuthContext";
import { FaCalendarAlt, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { getSafeImageUrl } from "@/app/lib/utils";

// Fallback image path
const FALLBACK_IMAGE = "/images/room-placeholder.jpg";

export interface BookingDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingDropdown = ({ isOpen, onClose }: BookingDropdownProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Function to safely get image URLs - replaced with utility function
  const getImageUrl = (url: string) => {
    return getSafeImageUrl(url, FALLBACK_IMAGE, 'room');
  };

  useEffect(() => {
    // Handle click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (!isOpen || !user?.email) return;

    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getUserBookings(user.email);
        // Filter for upcoming bookings only (confirmed or pending)
        const upcomingBookings = response.data.filter(booking => 
          (booking.status === 'confirmed' || booking.status === 'pending')
        );
        
        // Sort by check-in date (closest first)
        upcomingBookings.sort((a, b) => 
          new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
        );
        
        // Limit to 3 bookings for the dropdown
        setBookings(upcomingBookings.slice(0, 3));
      } catch (err) {
        console.error("Error fetching bookings for dropdown:", err);
        setError("Failed to load your bookings");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [isOpen, user?.email]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-[9999] border border-gray-200 overflow-hidden"
    >
      <div className="py-2 px-3 bg-[#1C3F32] text-white font-semibold flex justify-between items-center">
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2" />
          <span>My Bookings</span>
        </div>
        <span className="text-xs bg-white text-[#1C3F32] px-2 py-1 rounded-full">
          {bookings.length} upcoming
        </span>
      </div>
      
      <div className="max-h-72 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="w-6 h-6 border-2 border-[#1C3F32] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm mt-2 text-gray-500">Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500 text-sm">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500 mb-2">No upcoming bookings found</p>
            <Link href="/dashboard" className="text-xs text-[#1C3F32] font-medium hover:underline">
              Book a room now
            </Link>
          </div>
        ) : (
          <div>
            {bookings.map((booking) => (
              <div key={booking._id} className="p-3 border-b last:border-b-0 hover:bg-gray-50">
                <div className="flex gap-3">
                  <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={getImageUrl(booking.roomImage)}
                      alt={booking.roomTitle}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-800 truncate">{booking.roomTitle}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                        {booking.status === 'pending' ? 'Pending' : 'Confirmed'}
                      </span>
                      <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {booking.guests} guests • {booking.nights} nights
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-2 bg-gray-50 flex justify-between items-center">
        <Link href="/bookings" className="text-sm text-[#1C3F32] font-medium hover:underline flex items-center">
          View all bookings
          <FaChevronRight className="ml-1 text-xs" />
        </Link>
        <Link href="/bookings/history" className="text-sm text-[#1C3F32] font-medium hover:underline">
          Booking history
        </Link>
      </div>
    </div>
  );
};

export default BookingDropdown; 