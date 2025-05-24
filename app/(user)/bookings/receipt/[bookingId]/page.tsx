"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { getBookingById } from "@/app/services/bookingService";
import { FaCalendarAlt, FaUser, FaLocationArrow, FaCheck, FaPrint, FaEnvelope, FaDownload } from "react-icons/fa";
import { format } from "date-fns";

const BookingReceipt = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get bookingId from URL params with type check and validation
  const bookingId = Array.isArray(params?.bookingId) 
    ? params.bookingId[0] 
    : params?.bookingId as string;
  
  // For debugging
  console.log('BookingId extracted from params:', bookingId);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(`/login?redirect=/bookings/receipt/${bookingId}`);
      return;
    }

    // Fetch booking details
    const fetchBookingData = async () => {
      try {
        setLoading(true);

        // Enhanced debug logging for bookingId
        console.log('URL params:', params);
        console.log('Raw bookingId from params:', params?.bookingId);
        console.log('Processed bookingId:', bookingId);

        if (!bookingId) {
          console.error("No booking ID provided");
          // Display error state instead of immediate redirect
          setLoading(false);
          return;
        }

        // Check if bookingId is valid
        if (typeof bookingId !== 'string' || bookingId.trim() === '') {
          console.error("Invalid booking ID format:", bookingId);
          // Display error state instead of immediate redirect
          setLoading(false);
          return;
        }

        console.log(`Attempting to fetch booking details for ID: ${bookingId}`);
        
        // Add delay to ensure proper loading state is shown (optional)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const bookingData = await getBookingById(bookingId);

        if (!bookingData) {
          console.error("No booking found with ID:", bookingId);
          // Don't redirect, let the component show an error state
          setLoading(false);
          return;
        }

        console.log("Booking data received successfully:", bookingData);
        setBooking(bookingData);
      } catch (error) {
        console.error("Error fetching booking data:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        // Don't redirect, let the component show an error state
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId, isAuthenticated, router]);

  // Format dates for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy");
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  // Function to handle printing the receipt
  const handlePrint = () => {
    window.print();
  };

  // Function to download receipt as PDF (would require backend implementation)
  const handleDownload = () => {
    alert("This feature will be available soon.");
  };

  // Function to email receipt (would require backend implementation)
  const handleEmailReceipt = () => {
    alert("This feature will be available soon.");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium text-gray-800">Loading your receipt...</p>
            <p className="text-sm text-gray-600 mt-2">Please wait while we prepare your booking receipt.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 mb-4 text-5xl">
            <span>⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Booking Receipt Not Available</h1>
          <p className="text-gray-700 mb-6">
            We couldn't retrieve the booking receipt you're looking for.
          </p>
          <p className="text-gray-600 mb-6 text-sm">
            This could be because the booking ID <span className="font-mono bg-gray-100 px-1 rounded">{bookingId}</span> is not valid or you might not have permission to view this booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-[#1C3F32] text-white py-3 px-6 rounded-md hover:bg-[#15332a] transition-colors text-center font-medium"
            >
              Return to Dashboard
            </Link>
            <Link
              href="/bookings"
              className="bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 transition-colors text-center font-medium"
            >
              View All Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate the total nights
  const nights = booking.nights || 1;

  // Set default values for missing data
  const roomTitle = booking.roomTitle || "Standard Room";
  const roomImage = booking.roomImage || "/images/room-placeholder.jpg";
  
  // Calculate price breakdown
  const totalPrice = booking.totalPrice || 0;
  const basePrice = booking.basePrice || Math.round(totalPrice * 0.85); // Estimate base price if not provided
  const taxAndFees = booking.taxAndFees || totalPrice - basePrice; // Calculate tax & fees if not provided
  
  // Get all other booking details with fallbacks
  const bookingReference = booking.bookingReference || booking.bookingId || booking._id || booking.id || 'Unknown';
  const paymentStatus = booking.paymentStatus || "pending";
  const bookingStatus = booking.status || "confirmed";
  const location = booking.location || "Taguig, Metro Manila";
  const paymentMethod = booking.paymentMethod ? booking.paymentMethod.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Not specified';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Receipt Card */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden print:shadow-none" id="receipt-container">
        {/* Print-only header */}
        <div className="hidden print:block text-center p-4 border-b">
          <h1 className="text-2xl font-bold">Solace Hotel Booking Receipt</h1>
          <p className="text-sm text-gray-500">Issued on {format(new Date(), "dd MMMM yyyy, HH:mm")} PHT</p>
        </div>

        {/* Receipt Header */}
        <div className="bg-gradient-to-r from-[#1C3F32] to-[#2d6349] p-6 print:bg-white print:text-black">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-2 h-14 w-14 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#1C3F32" />
                  <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="#1C3F32" opacity="0.6" />
                </svg>
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold print:text-[#1C3F32]">Booking Receipt</h1>
                <p className="text-green-100 print:text-gray-600">Thank you for choosing Solace Hotel</p>
                <p className="text-green-100 print:text-gray-600 text-xs mt-1">Receipt Date: {format(new Date(), "dd MMMM yyyy")}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="print:hidden bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center">
                {bookingStatus === 'completed' ? (
                  <>
                    <FaCheck className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Completed</span>
                  </>
                ) : bookingStatus === 'cancelled' ? (
                  <>
                    <span className="text-red-300 mr-2">✕</span>
                    <span className="text-sm font-medium">Cancelled</span>
                  </>
                ) : (
                  <>
                    <FaCheck className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Confirmed</span>
                  </>
                )}
              </div>
              <div className="hidden print:block text-right">
                <p className="font-bold text-[#1C3F32]">Booking Status: {bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)}</p>
              </div>
              <p className="text-xs text-green-100 print:text-gray-600 mt-2">Booking Reference: {bookingReference}</p>
            </div>
          </div>
        </div>

        {/* Receipt Details */}
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Room Details */}
            <div className="md:w-1/3">
              <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
                <Image 
                  src={roomImage} 
                  alt={roomTitle} 
                  fill 
                  className="object-cover" 
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h2 className="font-bold text-lg text-gray-800">{roomTitle}</h2>
              <div className="flex items-center text-gray-600 mt-1">
                <FaLocationArrow className="h-4 w-4 mr-2" />
                <span className="text-sm">{location}</span>
              </div>
            </div>

            {/* Right Column - Booking Details */}
            <div className="md:w-2/3 md:pl-6 border-l-0 md:border-l">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Booking Reference</p>
                  <p className="font-semibold text-gray-800">{bookingReference}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Date</p>
                  <p className="font-semibold text-gray-800">{formatDate(booking.createdAt || new Date().toISOString())}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-[#1C3F32] h-4 w-4 mr-2" />
                    <p className="font-semibold text-gray-800">{formatDate(booking.checkIn)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-[#1C3F32] h-4 w-4 mr-2" />
                    <p className="font-semibold text-gray-800">{formatDate(booking.checkOut)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <div className="flex items-center">
                    <FaUser className="text-[#1C3F32] h-4 w-4 mr-2" />
                    <p className="font-semibold text-gray-800">{booking.adults || booking.guests || 1} {(booking.adults || booking.guests || 1) === 1 ? 'Adult' : 'Adults'}{booking.children && booking.children > 0 ? `, ${booking.children} ${booking.children === 1 ? 'Child' : 'Children'}` : ''}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </div>
                </div>
              </div>

              {/* Guest Information */}
              <div className="mt-6">
                <h3 className="font-bold text-gray-800 mb-2">Guest Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-gray-800">{
                      booking.customerName || 
                      `${booking.firstName || ''} ${booking.lastName || ''}`.trim() || 
                      'Guest'
                    }</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{
                      booking.customerEmail || booking.email || 'Not provided'
                    }</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-800">{booking.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-semibold text-gray-800">{
                      booking.paymentMethod ? 
                      booking.paymentMethod.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 
                      'Not specified'
                    }</p>
                  </div>
                  {booking.specialRequests && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Special Requests</p>
                      <p className="text-gray-800">{booking.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="p-6 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 mb-4">Price Details</h3>
          <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-gray-600">Room Rate</span>
                  <span className="ml-2 text-xs text-gray-500">({nights} {nights === 1 ? 'night' : 'nights'})</span>
                </div>
                <span className="text-gray-800 font-medium">₱{basePrice.toLocaleString()}</span>
              </div>
              
              {/* Show nightly breakdown if more than 1 night */}
              {nights > 1 && (
                <div className="ml-4 text-xs text-gray-500 -mt-1">
                  <span>₱{Math.round(basePrice/nights).toLocaleString()} × {nights} nights</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="text-gray-800 font-medium">₱{taxAndFees.toLocaleString()}</span>
              </div>
              
              {/* Show payment method */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-800 font-medium">{paymentMethod}</span>
              </div>
              
              {/* Show payment status */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
              
              <div className="border-t my-3 pt-3 border-dashed border-gray-300"></div>
              
              <div className="flex justify-between items-center bg-[#1C3F32]/5 p-4 rounded-md">
                <span className="text-gray-800 font-bold">Total Amount</span>
                <span className="text-[#1C3F32] text-xl font-bold">₱{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* QR Code */}
          <div className="mt-6 flex flex-col items-center justify-center">
            <div className="bg-white p-3 rounded-md border border-gray-200 inline-block">
              <div className="w-32 h-32 bg-[#1C3F32]/10 p-1 rounded-md flex items-center justify-center">
                <div className="w-full h-full border-2 border-[#1C3F32] p-2 rounded">
                  <div className="bg-white h-full w-full flex items-center justify-center">
                    <span className="text-[#1C3F32] font-bold text-lg">{bookingReference}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Scan to verify booking</p>
          </div>
        </div>

        {/* Action Buttons - Hidden when printing */}
        <div className="p-6 bg-white border-t border-gray-200 flex flex-wrap gap-4 justify-between items-center print:hidden">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
            >
              <FaPrint className="h-4 w-4 mr-2" />
              Print Receipt
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
            >
              <FaDownload className="h-4 w-4 mr-2" />
              Download PDF
            </button>
            <button
              onClick={handleEmailReceipt}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
            >
              <FaEnvelope className="h-4 w-4 mr-2" />
              Email Receipt
            </button>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1C3F32] hover:bg-[#15332a] focus:outline-none transition-colors"
            >
              Return to Dashboard
            </Link>
            <Link
              href="/bookings"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none transition-colors"
            >
              View All Bookings
            </Link>
          </div>
        </div>

        {/* Print-only footer */}
        <div className="hidden print:block text-center p-4 border-t text-sm text-gray-500">
          <div className="mb-2">
            <div className="mx-auto w-[120px] h-[30px] relative">
              <div className="absolute top-5 left-10 w-10 h-10 bg-[#1C3F32] transform rotate-45"></div>
              <div className="absolute top-5 left-20 w-10 h-10 bg-[#1C3F32] transform rotate-45"></div>
              <div className="absolute top-[12px] left-[35px] text-[14px] font-bold text-[#1C3F32]">SOLACE HOTEL</div>
            </div>
          </div>
          <p>This is an electronic receipt for your booking at Solace Hotel.</p>
          <p>For any inquiries, please contact us at reservations@solacehotel.com or +63 (2) 8123 4567</p>
          <p className="mt-2">123 Acacia Street, Central Signal Village, Taguig City, Metro Manila, Philippines</p>
        </div>
      </div>

      {/* Print stylesheet */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-container, #receipt-container * {
            visibility: visible;
          }
          #receipt-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            border: none !important;
            page-break-inside: avoid;
          }
          @page {
            size: A4;
            margin: 0.5cm;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingReceipt;
