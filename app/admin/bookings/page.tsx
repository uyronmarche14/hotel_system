"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaCalendarAlt, FaUser, FaBed, FaMoneyBillWave, 
  FaCheckCircle, FaTimesCircle, FaInfoCircle, 
  FaFilter, FaSearch, FaSort, FaClock, 
  FaExclamationTriangle
} from 'react-icons/fa';
import AdminLayout from '@/app/components/layouts/AdminLayout';
import { API_URL } from '@/app/lib/constants';
import Cookies from 'js-cookie';
import ErrorToast from '@/app/components/ErrorToast';
import LoadingSpinner from '@/app/components/LoadingSpinner';

interface Booking {
  id: string;
  roomId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  roomDetails?: {
    roomNumber: string;
    type: string;
    title?: string;
  };
  adults?: number;
  children?: number;
  specialRequests?: string;
  paymentMethod?: string;
}

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = () => {
      const user = localStorage.getItem('user');
      if (!user || !Cookies.get('token')) {
        router.push('/admin-login');
        return false;
      }
      
      try {
        const userData = JSON.parse(user);
        if (userData.role !== 'admin') {
          router.push('/admin-login');
          return false;
        }
        return true;
      } catch (e) {
        router.push('/admin-login');
        return false;
      }
    };

    const fetchBookings = async () => {
      if (!checkAdminAuth()) return;
      
      try {
        const response = await fetch(`/api/admin/bookings`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            router.push('/admin-login');
            return;
          }
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(data.data);
        setFilteredBookings(data.data);
      } catch (err: any) {
        const errorMessage = err.message || 'An error occurred while fetching bookings';
        setError(errorMessage);
        setShowErrorToast(true);
        console.error('Bookings fetch error:', err);
        
        // Auto-hide error toast after 5 seconds
        setTimeout(() => {
          setShowErrorToast(false);
        }, 5000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  useEffect(() => {
    // Apply filters and sorting
    let result = [...bookings];
    
    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(booking => booking.status.toLowerCase() === filterStatus.toLowerCase());
    }
    
    // Apply search
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(booking => 
        (booking.user?.name?.toLowerCase().includes(lowerSearchTerm)) || 
        (booking.user?.email?.toLowerCase().includes(lowerSearchTerm)) ||
        (booking.id?.toLowerCase().includes(lowerSearchTerm)) ||
        (booking.roomDetails?.roomNumber?.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'date-desc':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'price-asc':
          return (a.totalPrice || 0) - (b.totalPrice || 0);
        case 'price-desc':
          return (b.totalPrice || 0) - (a.totalPrice || 0);
        case 'check-in-asc':
          return new Date(a.checkIn || 0).getTime() - new Date(b.checkIn || 0).getTime();
        case 'check-in-desc':
          return new Date(b.checkIn || 0).getTime() - new Date(a.checkIn || 0).getTime();
        default:
          return 0;
      }
    });
    
    setFilteredBookings(result);
  }, [bookings, searchTerm, filterStatus, sortBy]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    })} at ${date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDuration = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 'N/A';
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} night${diffDays !== 1 ? 's' : ''}`;
  };

  const toggleBookingDetails = (bookingId: string) => {
    if (selectedBooking === bookingId) {
      setSelectedBooking(null);
    } else {
      setSelectedBooking(bookingId);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <LoadingSpinner 
          size="lg"
          message="Loading bookings..." 
          className="h-[calc(100vh-200px)]" 
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 relative">
        <ErrorToast 
          message={error || 'An error occurred'}
          isVisible={showErrorToast && error !== null}
          onClose={() => setShowErrorToast(false)}
        />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
          
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] focus:border-transparent text-gray-800"
                aria-label="Search bookings"
              />
            </div>
            
            <div className="relative flex-1 md:flex-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] focus:border-transparent text-gray-800"
                aria-label="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="relative flex-1 md:flex-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSort className="text-gray-400" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] focus:border-transparent text-gray-800"
                aria-label="Sort bookings"
              >
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="check-in-asc">Check-in (Upcoming)</option>
                <option value="check-in-desc">Check-in (Past)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="price-asc">Price (Low to High)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No bookings found matching your criteria
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200" aria-label="Booking information">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <>
                      <tr key={booking.id} className={`hover:bg-gray-50 ${selectedBooking === booking.id ? 'bg-blue-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{booking.id ? booking.id.substring(0, 8) : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <FaClock className="mr-1" aria-hidden="true" />
                            {booking.createdAt ? formatDate(booking.createdAt) : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaUser className="text-gray-400 mr-2" aria-hidden="true" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {booking.user?.name || 'Unknown'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {booking.user?.email || 'No email'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaBed className="text-gray-400 mr-2" aria-hidden="true" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {booking.roomDetails?.title || `Room ${booking.roomDetails?.roomNumber}` || 'N/A'}
                              </div>
                              <div className="text-xs text-gray-500 capitalize">
                                {booking.roomDetails?.type || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <FaCalendarAlt className="text-green-500 mr-2" aria-hidden="true" />
                              <span className="text-sm text-gray-700">
                                {booking.checkIn ? formatDate(booking.checkIn) : 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <FaCalendarAlt className="text-red-500 mr-2" aria-hidden="true" />
                              <span className="text-sm text-gray-700">
                                {booking.checkOut ? formatDate(booking.checkOut) : 'N/A'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {calculateDuration(booking.checkIn, booking.checkOut)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status || 'unknown')}`}>
                            {(booking.status === 'confirmed' || booking.status === 'completed') ? (
                              <FaCheckCircle className="mr-1" aria-hidden="true" />
                            ) : (
                              <FaTimesCircle className="mr-1" aria-hidden="true" />
                            )}
                            {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaMoneyBillWave className="text-gray-400 mr-2" aria-hidden="true" />
                            <span className="text-sm font-medium text-gray-900">
                              ${(booking.totalPrice || 0).toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleBookingDetails(booking.id)}
                            className="text-[#1C3F32] hover:text-[#1C3F32]/80 flex items-center focus:outline-none focus:underline"
                            aria-expanded={selectedBooking === booking.id}
                            aria-controls={`booking-details-${booking.id}`}
                          >
                            <FaInfoCircle className="mr-1" aria-hidden="true" />
                            <span>{selectedBooking === booking.id ? 'Hide' : 'View'}</span>
                          </button>
                        </td>
                      </tr>
                      {selectedBooking === booking.id && (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 bg-blue-50/50">
                            <div 
                              id={`booking-details-${booking.id}`}
                              className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            >
                              <div>
                                <h3 className="font-medium text-gray-900 mb-2">Booking Information</h3>
                                <p className="text-sm text-gray-700 mb-1">
                                  <span className="font-medium">ID:</span> {booking.id}
                                </p>
                                <p className="text-sm text-gray-700 mb-1">
                                  <span className="font-medium">Created:</span> {formatDateTime(booking.createdAt)}
                                </p>
                                <p className="text-sm text-gray-700 mb-1">
                                  <span className="font-medium">Status:</span> {booking.status || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-700 mb-1">
                                  <span className="font-medium">Payment Method:</span> {booking.paymentMethod || 'N/A'}
                                </p>
                              </div>
                              
                              <div>
                                <h3 className="font-medium text-gray-900 mb-2">Guest Details</h3>
                                <p className="text-sm text-gray-700 mb-1">
                                  <span className="font-medium">Name:</span> {booking.user?.name || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-700 mb-1">
                                  <span className="font-medium">Email:</span> {booking.user?.email || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-700 mb-1">
                                  <span className="font-medium">Adults:</span> {booking.adults || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-700 mb-1">
                                  <span className="font-medium">Children:</span> {booking.children || 'N/A'}
                                </p>
                              </div>
                              
                              <div>
                                <h3 className="font-medium text-gray-900 mb-2">Special Requests</h3>
                                <p className="text-sm text-gray-700">
                                  {booking.specialRequests || 'No special requests'}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 