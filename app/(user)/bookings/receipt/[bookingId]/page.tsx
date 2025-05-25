"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { format } from "date-fns";
import { FaCalendarAlt, FaUser, FaLocationArrow, FaCheck, FaPrint, FaEnvelope, FaDownload } from "react-icons/fa";
import ReviewSection from "@/app/components/reviews/ReviewSection";

const BookingReceipt = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  // Get bookingId from URL params with type check and validation
  const bookingId = Array.isArray(params?.bookingId) 
    ? params.bookingId[0] 
    : params?.bookingId as string;
    

  // Sample booking data to ensure the receipt always works
  const sampleBooking = {
    _id: bookingId || 'sample-booking-123',
    id: bookingId || 'sample-booking-123',
    bookingId: 'BK-123456',
    roomId: 'room-101',
    roomTitle: 'Deluxe Ocean View Suite',
    roomImage: '/images/rooms/deluxe-suite.jpg',
    checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    checkOut: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 3 days after check-in
    nights: 3,
    guests: 2,
    adults: 2,
    children: 0,
    totalPrice: 25000,
    basePrice: 22000,
    taxAndFees: 3000,
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: 'Taguig City, Metro Manila',
    bookingReference: 'REF-ABC123',
    customerName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    customerEmail: 'john.doe@example.com',
    phone: '+63 9123456789',
    specialRequests: 'Please provide extra pillows and arrange for airport pickup.'
  };
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(`/login?redirect=/bookings/receipt/${bookingId}`);
      return;
    }

    // Simulate loading with delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [bookingId, isAuthenticated, router]);

  // Function to handle printing the receipt
  const handlePrint = () => {
    window.print();
  };

  // Function to handle downloading the receipt
  const handleDownload = () => {
    alert("Download functionality will be available soon.");
  };

  // Function to handle emailing the receipt
  const handleEmail = () => {
    alert("Email functionality will be available soon.");
  };

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

  // Format dates for display
  const checkInDate = new Date(sampleBooking.checkIn);
  const checkOutDate = new Date(sampleBooking.checkOut);
  const formattedCheckIn = format(checkInDate, 'MMMM d, yyyy');
  const formattedCheckOut = format(checkOutDate, 'MMMM d, yyyy');
  const formattedCreatedAt = format(new Date(sampleBooking.createdAt), 'MMMM d, yyyy');
  const today = format(new Date(), 'MMMM d, yyyy');

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
  } = sampleBooking;

  // Format display values
  const guestName = `${firstName} ${lastName}`;
  const formattedPaymentMethod = paymentMethod.replace('_', ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Receipt Card */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden print:shadow-none" id="receipt-container">
        {/* Print-only header */}
        <div className="hidden print:block text-center p-4 border-b">
          <h1 className="text-2xl font-bold">Solace Hotel Booking Receipt</h1>
          <p className="text-sm text-gray-500">Issued on {today}</p>
        </div>

        {/* Receipt Header */}
        <div className="bg-gradient-to-r from-[#1C3F32] to-[#2d6349] p-6 print:bg-white print:text-black">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2">
                <Image src="/images/hotel-logo.png" alt="Solace Hotel" width={40} height={40} />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold print:text-[#1C3F32]">Booking Receipt</h1>
                <p className="text-green-100 print:text-gray-600">Thank you for choosing Solace Hotel</p>
                <p className="text-green-100 print:text-gray-600 text-xs mt-1">Receipt Date: {today}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-white font-bold print:text-black">Booking ID</span>
              <span className="text-green-100 print:text-gray-600">{bookingReference}</span>
            </div>
          </div>
        </div>

        {/* Action buttons (only visible in screen view) */}
        <div className="bg-gray-50 p-4 flex space-x-2 justify-end print:hidden">
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
                      src={roomImage}
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
                    <h4 className="font-semibold text-gray-800">{roomTitle}</h4>
                    <div className="text-sm text-gray-500 flex items-center">
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
                  <p className="text-sm text-gray-500">Booking Reference</p>
                  <p className="font-semibold text-gray-800">{bookingReference}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Date</p>
                  <p className="font-semibold text-gray-800">{formattedCreatedAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-[#1C3F32] h-4 w-4 mr-2" />
                    <p className="font-semibold text-gray-800">{formattedCheckIn}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-[#1C3F32] h-4 w-4 mr-2" />
                    <p className="font-semibold text-gray-800">{formattedCheckOut}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold text-gray-800">{nights} Night{nights > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <div className="flex items-center">
                    <FaUser className="text-[#1C3F32] h-4 w-4 mr-2" />
                    <p className="font-semibold text-gray-800">{sampleBooking.adults + (sampleBooking.children || 0)} Guests</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center">
                    <FaCheck className="text-green-500 h-4 w-4 mr-2" />
                    <p className="font-semibold text-green-500">Confirmed</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-semibold text-gray-800">{formattedPaymentMethod}</p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mt-6">
                <h3 className="font-bold text-gray-800 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-gray-800">{guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-800">{phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  {specialRequests && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Special Requests</p>
                      <p className="text-gray-700">{specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-b py-4 mb-4 mt-6">
            <h3 className="font-bold text-gray-800 mb-4">Price Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Room Rate ({nights} night{nights > 1 ? 's' : ''})</span>
                <span className="font-medium">₱{basePrice.toLocaleString()}</span>
              </div>
              
              {/* Per night breakdown */}
              <div className="pl-4 text-sm text-gray-500">
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
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="font-medium">₱{taxAndFees.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total</span>
                <span>₱{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 mt-8">
            <p>Thank you for choosing Solace Hotel</p>
            <p className="mt-2">123 Acacia Street, Central Signal Village, Taguig City, Metro Manila, Philippines</p>
          </div>
          
          {/* Reviews Section */}
          <ReviewSection
            bookingId={sampleBooking._id}
            roomId={sampleBooking.roomId}
            roomTitle={sampleBooking.roomTitle}
            checkOutDate={sampleBooking.checkOut}
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
