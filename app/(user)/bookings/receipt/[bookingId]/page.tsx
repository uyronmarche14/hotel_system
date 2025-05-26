"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { format } from "date-fns";
import { FaCalendarAlt, FaUser, FaLocationArrow, FaCheck, FaPrint, FaEnvelope, FaDownload, FaShareAlt } from "react-icons/fa";
import ReviewSection from "@/app/components/reviews/ReviewSection";
import html2canvas from "html2canvas";

const BookingReceipt = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  
  // Get bookingId from URL params with type check and validation
  const bookingId = Array.isArray(params?.bookingId) 
    ? params.bookingId[0] 
    : params?.bookingId as string;
  

  // Define booking interface
  interface Booking {
    _id: string;
    id?: string;
    bookingId: string;
    roomId: string;
    roomTitle: string;
    roomImage?: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    guests: number;
    adults: number;
    children: number;
    totalPrice: number;
    basePrice: number;
    taxAndFees: number;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    createdAt: string;
    updatedAt?: string;
    customerName: string;
    firstName: string;
    lastName: string;
    customerEmail: string;
    email?: string;
    phone: string;
    location: string;
    specialRequests?: string;
    bookingReference?: string;
  }
  
  // State for booking data
  const [booking, setBooking] = useState<Booking | null>(null);
  
  // Function to fetch booking data
  const fetchBookingData = async () => {
    try {
      setLoading(true);
      
      // Try multiple API endpoints to fetch booking data
      let response;
      let attemptedEndpoints = [];
      
      // First try the user bookings endpoint
      try {
        const endpoint = `/api/bookings/${bookingId}`;
        attemptedEndpoints.push(endpoint);
        response = await fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': isAuthenticated ? `Bearer ${localStorage.getItem('token')}` : '',
          },
          cache: 'no-store'
        });
        
        if (!response.ok) throw new Error(`Failed with status ${response.status}`);
      } catch (firstError) {
        console.log('First endpoint failed, trying alternative:', firstError);
        
        // If that fails, try the admin bookings endpoint as fallback
        try {
          const endpoint = `/api/admin/bookings/${bookingId}`;
          attemptedEndpoints.push(endpoint);
          response = await fetch(endpoint, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': isAuthenticated ? `Bearer ${localStorage.getItem('token')}` : '',
            },
            cache: 'no-store'
          });
          
          if (!response.ok) throw new Error(`Failed with status ${response.status}`);
        } catch (secondError) {
          // Finally, try the all bookings endpoint and filter for our ID
          console.log('Second endpoint failed, trying all bookings:', secondError);
          const endpoint = `/api/bookings`;
          attemptedEndpoints.push(endpoint);
          response = await fetch(endpoint, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': isAuthenticated ? `Bearer ${localStorage.getItem('token')}` : '',
            },
            cache: 'no-store'
          });
          
          if (!response.ok) {
            console.error('All endpoints failed:', attemptedEndpoints);
            throw new Error('Failed to fetch booking data from any available endpoint');
          }
        }
      }
      
      // Process the response data
      const data = await response.json();
      let bookingData: any = {};

      // Handle different response formats
      if (data.data) bookingData = data.data;
      else if (data.booking) bookingData = data.booking;
      else if (data.bookings && Array.isArray(data.bookings) && data.bookings.length > 0) {
        // Find the booking with matching ID if we get an array
        const foundBooking = data.bookings.find((b: any) => 
          b.bookingId === bookingId || b._id === bookingId || b.id === bookingId
        );
        
        if (foundBooking) {
          bookingData = foundBooking;
        } else {
          // If we can't find the specific booking, use the first one as fallback
          console.warn('Could not find the specific booking, using first available booking');
          bookingData = data.bookings[0];
        }
      }
      else bookingData = data;

      // Add fallback values for essential properties
      const processedBooking: Booking = {
        _id: bookingData._id || bookingData.id || bookingId,
        bookingId: bookingData.bookingId || bookingId,
        bookingReference: bookingData.bookingReference || bookingData.bookingId || bookingId,
        roomTitle: bookingData.roomTitle || bookingData.roomName || 'Hotel Room',
        roomId: bookingData.roomId || '',
        roomImage: bookingData.roomImage || '/images/room-placeholder.jpg',
        checkIn: bookingData.checkIn || new Date().toISOString(),
        checkOut: bookingData.checkOut || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        nights: bookingData.nights || 1,
        adults: bookingData.adults || bookingData.guests || 1,
        children: bookingData.children || 0,
        guests: bookingData.guests || bookingData.adults || 1,
        totalPrice: bookingData.totalPrice || 0,
        basePrice: bookingData.basePrice || (bookingData.totalPrice ? Math.round(bookingData.totalPrice * 0.85) : 0),
        taxAndFees: bookingData.taxAndFees || (bookingData.totalPrice ? Math.round(bookingData.totalPrice * 0.15) : 0),
        status: bookingData.status || 'confirmed',
        paymentStatus: bookingData.paymentStatus || 'paid',
        paymentMethod: bookingData.paymentMethod || 'credit_card',
        createdAt: bookingData.createdAt || new Date().toISOString(),
        firstName: bookingData.firstName || (bookingData.customerName ? bookingData.customerName.split(' ')[0] : ''),
        lastName: bookingData.lastName || (bookingData.customerName ? bookingData.customerName.split(' ').slice(1).join(' ') : ''),
        customerName: bookingData.customerName || 
          (bookingData.firstName && bookingData.lastName ? `${bookingData.firstName} ${bookingData.lastName}` : 'Guest'),
        customerEmail: bookingData.customerEmail || bookingData.email || '',
        email: bookingData.email || bookingData.customerEmail || '',
        phone: bookingData.phone || '',
        location: bookingData.location || 'Taguig City, Philippines',
        specialRequests: bookingData.specialRequests || '',
      };
      
      console.log('Successfully processed booking data:', processedBooking.bookingId);
      setBooking(processedBooking);
    } catch (error) {
      console.error('Error fetching booking data:', error);
      // Use a minimal booking object with the ID as fallback
      const fallbackBooking: Booking = {
        _id: bookingId,
        bookingId: bookingId,
        bookingReference: bookingId,
        roomId: '',
        roomTitle: 'Room Booking',
        roomImage: '/images/room-placeholder.jpg',
        checkIn: new Date().toISOString(),
        checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        nights: 1,
        guests: 1,
        adults: 1,
        children: 0,
        totalPrice: 0,
        basePrice: 0,
        taxAndFees: 0,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        createdAt: new Date().toISOString(),
        firstName: '',
        lastName: '',
        customerName: 'Guest',
        customerEmail: '',
        phone: '',
        location: 'Taguig City, Philippines',
        specialRequests: '',
      };
      setBooking(fallbackBooking);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(`/login?redirect=/bookings/receipt/${bookingId}`);
      return;
    }

    // Fetch booking data from API
    fetchBookingData();
  }, [bookingId, isAuthenticated, router]);
  
  // Don't render anything if booking data hasn't loaded yet
  if (loading || !booking) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading receipt...</p>
        </div>
      </div>
    );
  }

  // Function to handle printing the receipt
  const handlePrint = () => {
    window.print();
  };

  // Function to handle downloading the receipt as image
  const handleDownload = async () => {
    if (!receiptRef.current) return;
    
    try {
      setDownloading(true);
      
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
      link.download = `receipt-${booking.bookingId || bookingId}.png`;
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
      setDownloading(false);
    }
  };

  // Function to handle emailing the receipt
  const handleEmail = () => {
    // For a real implementation, this would send an API request to email the receipt
    const emailSubject = `Your Booking Receipt - ${booking.bookingId || bookingId}`;
    const emailBody = `Thank you for booking with The Solace Manor.

Your booking details:
Booking ID: ${booking.bookingId || bookingId}
Room: ${booking.roomTitle || 'Hotel Room'}
Check-in: ${format(new Date(booking.checkIn), 'MMMM d, yyyy')}
Check-out: ${format(new Date(booking.checkOut), 'MMMM d, yyyy')}

You can view your full receipt online at: ${window.location.href}`;
    
    // Open the user's email client with pre-filled information
    window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  // Format dates for display
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const formattedCheckIn = format(checkInDate, 'MMMM d, yyyy');
  const formattedCheckOut = format(checkOutDate, 'MMMM d, yyyy');
  const formattedCreatedAt = format(new Date(booking.createdAt), 'MMMM d, yyyy');
  const today = format(new Date(), 'MMMM d, yyyy');
  
  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading receipt...</p>
        </div>
      </div>
    );
  }

  // Get booking details
  const {
    roomTitle,
    roomImage,
    nights,
    basePrice,
    taxAndFees,
    totalPrice,
    bookingReference,
    paymentStatus,
    paymentMethod,
    location,
    firstName,
    lastName,
    customerEmail,
    phone,
    specialRequests
  } = booking;

  // Format display values
  const guestName = `${firstName} ${lastName}`;
  const formattedPaymentMethod = paymentMethod.replace('_', ' ')
    .replace(/\b\w/g, (l: string) => l.toUpperCase());

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Receipt Card */}
      <div ref={receiptRef} id="receipt-container" className="bg-white rounded-lg shadow-lg overflow-hidden border-t-8 border-[#1C3F32]">

        {/* Receipt Header */}
        <div className="bg-gradient-to-r from-[#1C3F32] to-[#2d6349] p-6 print:bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2">
                <Image src="/images/hotel-logo.png" alt="Solace Hotel" width={40} height={40} />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold print:text-black">Booking Receipt</h1>
                <p className="text-white print:text-black">Thank you for choosing Solace Hotel</p>
                <p className="text-white print:text-black text-xs mt-1">Receipt Date: {today}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-white font-bold print:text-black">Booking ID</span>
              <span className="text-white print:text-black">{bookingReference}</span>
            </div>
          </div>
        </div>

        {/* Action buttons (only visible in screen view) */}
        <div id="receipt-actions" className="bg-gray-50 p-4 flex space-x-2 justify-end print:hidden">
          <button 
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#1C3F32] hover:bg-[#2d6349] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C3F32]">
            <FaPrint className="mr-2" />
            Print
          </button>
          <button 
            onClick={handleDownload}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C3F32]">
            <FaDownload className="mr-2" />
            Download
          </button>
          <button 
            onClick={handleEmail}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C3F32]">
            <FaEnvelope className="mr-2" />
            Email
          </button>
        </div>
        {/* Receipt Body */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Room Details */}
            <div className="md:w-1/3">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-16 relative overflow-hidden rounded-md">
                    <Image 
                      src={roomImage || '/images/room-placeholder.jpg'}
                      alt={roomTitle}
                      width={80}
                      height={64}
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/room-placeholder.jpg';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">{roomTitle}</h4>
                    <div className="text-sm text-black flex items-center">
                      <FaLocationArrow className="mr-1 text-xs" />
                      <span>{location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Details */}
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-black">Booking Reference</p>
                  <p className="font-semibold text-black">{bookingReference}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Booking Date</p>
                  <p className="font-semibold text-black">{formattedCreatedAt}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Check-in</p>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-black h-4 w-4 mr-2 print:text-black" />
                    <p className="font-semibold text-black">{formattedCheckIn}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Check-out</p>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-black h-4 w-4 mr-2 print:text-black" />
                    <p className="font-semibold text-black">{formattedCheckOut}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Duration</p>
                  <p className="font-semibold text-black">{nights} Night{nights > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Guests</p>
                  <div className="flex items-center">
                    <FaUser className="text-black h-4 w-4 mr-2 print:text-black" />
                    <p className="font-semibold text-black">{booking.adults + (booking.children || 0)} Guests</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Status</p>
                  <div className="flex items-center">
                    <FaCheck className="text-green-800 h-4 w-4 mr-2 print:text-black" />
                    <p className="font-semibold text-green-800 print:text-black">Confirmed</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Payment Method</p>
                  <p className="font-semibold text-black">{formattedPaymentMethod}</p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mt-6">
                <h3 className="font-bold text-black mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-black">Name</p>
                    <p className="font-semibold text-black">{guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">Email</p>
                    <p className="font-semibold text-black">{customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">Phone</p>
                    <p className="font-semibold text-black">{phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">Payment Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium print:border print:border-gray-400 ${paymentStatus === 'paid' ? 'bg-green-100 text-green-800 print:bg-white' : 'bg-yellow-100 text-yellow-800 print:bg-white'}`}>
                      {paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  {specialRequests && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-black">Special Requests</p>
                      <p className="text-black">{specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-b py-4 mb-4 mt-6">
            <h3 className="font-bold text-black mb-4">Price Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-black">Room Rate ({nights} night{nights > 1 ? 's' : ''})</span>
                <span className="font-medium text-black">₱{basePrice.toLocaleString()}</span>
              </div>
              
              {/* Per night breakdown */}
              <div className="pl-4 text-sm text-black">
                {Array.from({ length: nights }).map((_, index) => {
                  const nightDate = new Date(checkInDate);
                  nightDate.setDate(nightDate.getDate() + index);
                  return (
                    <div key={index} className="flex justify-between">
                      <span>{format(nightDate, 'MMM d, yyyy')}</span>
                      <span>₱{Math.floor(basePrice / nights).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between">
                <span className="text-black">Taxes & Fees</span>
                <span className="font-medium text-black">₱{taxAndFees.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between font-bold pt-2 border-t text-black">
                <span>Total</span>
                <span>₱{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-black mt-8">
            <p>Thank you for choosing Solace Hotel</p>
            <p className="mt-2">123 Acacia Street, Central Signal Village, Taguig City, Metro Manila, Philippines</p>
          </div>
          
          {/* Reviews Section */}
          <ReviewSection
            bookingId={booking._id || bookingId}
            roomId={booking.roomId}
            roomTitle={booking.roomTitle}
            checkOutDate={booking.checkOut}
          />
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
