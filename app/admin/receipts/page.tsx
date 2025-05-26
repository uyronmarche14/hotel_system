"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaDownload, FaPrint, FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';

// Function to get bookings from the existing API endpoint
async function getAdminBookings() {
  try {
    // Use the same endpoint as the admin bookings page
    const response = await fetch('/api/admin/bookings', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Handle unauthorized access
        throw new Error('Unauthorized access');
      }
      throw new Error('Failed to fetch bookings');
    }
    
    const data = await response.json();
    let bookingsData = [];
    
    // Handle different response formats
    if (data.bookings && Array.isArray(data.bookings)) {
      bookingsData = data.bookings;
    } else if (data.data && Array.isArray(data.data)) {
      bookingsData = data.data;
    } else if (Array.isArray(data)) {
      bookingsData = data;
    }
    
    // Process each booking to ensure it has all required fields
    const processedBookings = bookingsData.map((booking: any) => {
      // Create a complete booking object with fallbacks for all properties
      return {
        ...booking,
        _id: booking._id || booking.id || `booking-${Math.random().toString(36).substring(2, 9)}`,
        bookingId: booking.bookingId || booking._id || booking.id || `B${Math.floor(Math.random() * 10000)}`,
        roomId: booking.roomId || '',
        roomTitle: booking.roomTitle || booking.roomName || 'Hotel Room',
        checkIn: booking.checkIn || new Date().toISOString(),
        checkOut: booking.checkOut || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        nights: booking.nights || 1,
        guests: booking.guests || booking.adults || 1,
        adults: booking.adults || booking.guests || 1,
        children: booking.children || 0,
        totalPrice: booking.totalPrice || 0,
        basePrice: booking.basePrice || (booking.totalPrice ? booking.totalPrice * 0.85 : 0),
        taxAndFees: booking.taxAndFees || (booking.totalPrice ? booking.totalPrice * 0.15 : 0),
        paymentMethod: booking.paymentMethod || 'credit_card',
        paymentStatus: booking.paymentStatus || 'paid',
        status: booking.status || 'confirmed',
        createdAt: booking.createdAt || new Date().toISOString(),
        updatedAt: booking.updatedAt || booking.createdAt || new Date().toISOString(),
        // Handle different name formats in the API
        customerName: booking.customerName || 
          (booking.firstName && booking.lastName ? `${booking.firstName} ${booking.lastName}` : 'Guest'),
        firstName: booking.firstName || (booking.customerName ? booking.customerName.split(' ')[0] : ''),
        lastName: booking.lastName || (booking.customerName ? booking.customerName.split(' ').slice(1).join(' ') : ''),
        customerEmail: booking.customerEmail || booking.email || '',
        email: booking.email || booking.customerEmail || '',
        phone: booking.phone || '',
        location: booking.location || 'Taguig City, Metro Manila',
        specialRequests: booking.specialRequests || ''
      };
    });
    
    return { bookings: processedBookings };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    // Return empty array if API fails in production
    return { bookings: [] };
  }
}

// Define booking type interface for better type checking
interface Booking {
  _id: string;
  id?: string;
  bookingId: string;
  roomId: string;
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  basePrice?: number;
  taxAndFees?: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  customerName?: string;
  firstName?: string;
  lastName?: string;
  customerEmail?: string;
  email?: string;
  phone?: string;
  location?: string;
  specialRequests?: string;
}

// Receipt preview component
const ReceiptPreview = ({ booking, onClose }: { booking: any, onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  
  // Format dates for display
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const formattedCheckIn = format(checkInDate, 'MMMM d, yyyy');
  const formattedCheckOut = format(checkOutDate, 'MMMM d, yyyy');
  const formattedCreatedAt = format(new Date(booking.createdAt), 'MMMM d, yyyy');

  // Function to handle printing the receipt
  const handlePrint = () => {
    window.print();
  };

  // Function to handle downloading the receipt as image
  const handleDownload = async () => {
    if (!receiptRef.current) return;
    
    try {
      setLoading(true);
      
      // Hide the buttons during capture
      const actionButtons = document.getElementById('receipt-actions');
      if (actionButtons) {
        actionButtons.style.display = 'none';
      }
      
      // Use html2canvas to capture the receipt as an image
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      // Convert the canvas to a data URL and create a download link
      const imageData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `receipt-${booking.bookingId || 'booking'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show the buttons again
      if (actionButtons) {
        actionButtons.style.display = 'flex';
      }
    } catch (error) {
      console.error('Error generating receipt image:', error);
      alert('There was an error creating your receipt image. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // If loading, show a loading indicator
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 font-medium">Generating receipt image...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Receipt #{booking.bookingId}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close receipt preview"
            >
              ✕
            </button>
          </div>
          
          <div ref={receiptRef} id="receipt-container" className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
            {/* Receipt Header */}
            <div className="flex flex-col items-center mb-6 print:mb-4">
              <h1 className="text-2xl font-bold text-center text-black">THE SOLACE MANOR</h1>
              <p className="text-sm text-black text-center">123 Acacia Street, Taguig City</p>
              <div className="mt-2 text-xs bg-[#1C3F32] text-white px-4 py-1 rounded-full print:bg-transparent print:text-black print:border print:border-gray-300">
                <span className="print:text-black">Receipt #{booking.bookingId}</span>
              </div>
            </div>
            {/* Booking Info */}
            <div className="mb-6 print:mb-4">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Booking Confirmation</h2>
                  <p className="text-sm text-gray-600">Confirmation: {booking.bookingId}</p>
                  <p className="text-sm text-gray-600">Issued: {formattedCreatedAt}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="bg-[#1C3F32] text-white px-4 py-2 rounded-lg inline-block print:bg-transparent print:text-black print:border print:border-gray-300">
                    <span className="font-bold text-white print:text-black">{(booking.status || 'confirmed').toUpperCase()}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-dashed border-gray-300 pt-4 mb-4">
// ... (rest of the code remains the same)
                <h3 className="font-bold text-black mb-2">Room Details</h3>
                <p className="font-medium text-lg text-black">{booking.roomTitle}</p>
                <p className="text-black">{booking.location}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-sm font-medium text-black">Check-in</p>
                    <p className="font-semibold text-black">{formattedCheckIn}</p>
                    <p className="text-xs text-black">After 2:00 PM</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">Check-out</p>
                    <p className="font-semibold text-black">{formattedCheckOut}</p>
                    <p className="text-xs text-black">Before 12:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-dashed border-gray-300 pt-4">
                <h3 className="font-bold text-black mb-2">Guest Information</h3>
                <p className="text-black"><span className="font-medium">Name:</span> {booking.customerName || `${booking.firstName || ''} ${booking.lastName || ''}` || 'Guest'}</p>
                <p className="text-black"><span className="font-medium">Email:</span> {booking.customerEmail || booking.email || 'Not provided'}</p>
                <p className="text-black"><span className="font-medium">Guests:</span> {booking.guests || 1} {(booking.guests || 1) === 1 ? 'Person' : 'People'}</p>
                <p className="text-black"><span className="font-medium">Nights:</span> {booking.nights || 1}</p>
              </div>
            </div>
            
            {/* Payment Info */}
            <div className="border-t border-dashed border-gray-300 pt-4 mb-6 print:mb-4">
              <h3 className="font-bold text-black mb-2">Payment Details</h3>
              <div className="flex justify-between mb-1 text-black">
                <span>Room Rate ({booking.nights || 1} nights)</span>
                <span>₱{(booking.basePrice || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-1 text-black">
                <span>Taxes & Fees</span>
                <span>₱{(booking.taxAndFees || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 text-black">
                <span>Total</span>
                <span>₱{(booking.totalPrice || 0).toLocaleString()}</span>
              </div>
              <div className="mt-2 text-sm">
                <p className="text-black"><span className="font-medium">Payment Method:</span> {(booking.paymentMethod || 'card').replace('_', ' ').toUpperCase()}</p>
                <p className="text-black"><span className="font-medium">Payment Status:</span> 
                  <span className={`ml-1 font-semibold ${booking.paymentStatus === 'paid' ? 'text-green-800 print:text-black' : 'text-yellow-800 print:text-black'}`}>
                    {booking.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                  </span>
                </p>
              </div>
            </div>
            
            {/* Barcode/QR Section */}
            <div className="border-t border-dashed border-gray-300 pt-4 text-center">
              <div className="inline-block bg-gray-200 px-6 py-2 rounded-lg mb-2">
                <span className="font-mono font-medium tracking-wider text-black">{booking.bookingId}</span>
              </div>
              <p className="text-xs text-black mt-2">Present this receipt upon check-in</p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div id="receipt-actions" className="flex justify-center space-x-4 mt-6 print:hidden">
            <button 
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              <FaPrint className="mr-2" /> Print
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              <FaDownload className="mr-2" /> Download
            </button>
          </div>
          
          {/* Print stylesheet */}
          <style jsx global>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #receipt-container, #receipt-container * {
                visibility: visible;
                color: black !important;
                background-color: white !important;
              }
              #receipt-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                box-shadow: none !important;
                border: none !important;
              }
              @page {
                size: A4;
                margin: 0.5cm;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

// Main page component
export default function AdminReceiptsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await getAdminBookings();
        setBookings(data.bookings || []);
      } catch (error) {
        console.error('Error loading bookings:', error);
        setBookings([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    }
    
    loadBookings();
  }, []);
  
  const filteredBookings = bookings.filter(booking => {
    // Make sure booking exists and has valid properties
    if (!booking) return false;
    
    // Get proper names for search
    const bookingId = booking.bookingId || '';
    const customerName = booking.customerName || booking.firstName && booking.lastName ? 
      `${booking.firstName} ${booking.lastName}` : '';
    const customerEmail = booking.customerEmail || booking.email || '';
    
    const matchesSearch = searchTerm === '' || 
      bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || (booking.status && booking.status === statusFilter);
      
    return matchesSearch && matchesStatus;
  });
  
  const handleViewReceipt = (booking: any) => {
    setSelectedBooking(booking);
  };
  
  const closeReceiptPreview = () => {
    setSelectedBooking(null);
  };
  
  const exportAllReceipts = () => {
    alert('Export all receipts functionality would be implemented here');
  };
  
  // Calculate total revenue
  const totalRevenue = bookings
    .filter(booking => booking.paymentStatus === 'paid')
    .reduce((sum, booking) => sum + booking.totalPrice, 0);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Receipts</h1>
          <p className="text-gray-600">Manage and view all booking receipts</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <button 
            onClick={exportAllReceipts}
            className="flex items-center justify-center px-4 py-2 bg-[#1C3F32] text-white rounded-md hover:bg-[#15302A] transition-colors"
          >
            <FaDownload className="mr-2" /> Export All
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">₱{totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Pending Bookings</h3>
          <p className="text-3xl font-bold text-gray-900">
            {bookings.filter(b => b.status === 'pending').length}
          </p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        </div>
        
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="pl-10 shadow-sm focus:ring-[#1C3F32] focus:border-[#1C3F32] block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  placeholder="Search by ID, name, or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-64">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                className="shadow-sm focus:ring-[#1C3F32] focus:border-[#1C3F32] block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Receipts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-10 h-10 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading receipts...</span>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium">No receipts found matching your filters.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.bookingId}</div>
                      <div className="text-sm text-gray-500">{formatDate(booking.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                      <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{booking.roomTitle}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{formatDate(booking.checkIn)}</div>
                      <div className="text-sm text-gray-500">to {formatDate(booking.checkOut)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₱{booking.totalPrice.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">
                        {booking.paymentStatus === 'paid' ? (
                          <span className="text-green-600">Paid</span>
                        ) : (
                          <span className="text-yellow-600">Pending</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                        ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                        ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewReceipt(booking)}
                        className="text-[#1C3F32] hover:text-[#15302A] flex items-center justify-end"
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Receipt Preview Modal */}
      {selectedBooking && (
        <ReceiptPreview booking={selectedBooking} onClose={closeReceiptPreview} />
      )}
    </div>
  );
}
