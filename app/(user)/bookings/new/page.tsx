"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getAllRooms, RoomType } from "@/app/services/roomService";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaWifi,
  FaCheck,
} from "react-icons/fa";
import { createBooking, BookingFormData } from "@/app/lib/bookingService";

const FALLBACK_IMAGE = "/images/room-placeholder.jpg";

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    specialRequests: "",
    nameOnCard: "",
    cardNumber: "",
    expirationMonth: "",
    expirationYear: "",
    cvv: "",
    billingFirstName: "",
    billingLastName: "",
    country: "",
    state: "",
    postalCode: "",
  });

  const { isAuthenticated, user } = useAuth();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [checkInDate] = useState("Mon 5 April 2025");
  const [checkOutDate] = useState("Wed 7 April 2025");
  const [nightsStay] = useState(2);
  const [adultsCount] = useState(2);

  // Calculate prices
  const basePrice = room ? room.price * nightsStay : 0;
  const taxRate = 0.12; // 12% tax
  const taxAndFees = Math.round(basePrice * taxRate);
  const totalPrice = basePrice + taxAndFees;

  // Get room info from URL parameters - with null checks
  const roomId = searchParams?.get("roomId") || "";
  const category = searchParams?.get("category") || "";


  // Use useEffect to load room data
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/bookings/new");
      return;
    }

    if (!roomId || !category) {
      router.push("/dashboard");
      return;
    }

    const fetchRoom = async () => {
      try {
        const allRooms = await getAllRooms();
        console.log("Fetched rooms:", allRooms.length);
        
        // Log search criteria
        console.log(`Looking for room with category=${category} and roomId=${roomId}`);

        // Find the room
        const foundRoom = allRooms.find((r) => {
          // Create consistent title slug for comparison
          const titleSlug = r.title.toLowerCase().replace(/ /g, "-");
          // Debug room matching
          console.log(`Comparing room: ${r.title}, id=${r.id}, category=${r.category}`);
          
          return (
            r.category === category &&
            (titleSlug === roomId || r.href?.includes(roomId))
          );
        });

        if (!foundRoom) {
          console.error("Room not found with given criteria");
          router.push("/dashboard");
          return;
        }
        
        // Ensure room has a valid ID
        if (!foundRoom.id) {
          console.error("Found room but it has no ID", foundRoom);
          foundRoom.id = roomId; // Use roomId from URL as fallback
        }
        
        console.log("Found room:", foundRoom);
        setRoom(foundRoom);

        // Pre-fill user data if available
        if (user) {
          setFormData((prev) => ({
            ...prev,
            firstName: user.name.split(" ")[0] || "",
            lastName: user.name.split(" ").slice(1).join(" ") || "",
            email: user.email || "",
            billingFirstName: user.name.split(" ")[0] || "",
            billingLastName: user.name.split(" ").slice(1).join(" ") || "",
          }));
        }
      } catch (error) {
        console.error("Failed to fetch room data:", error);
        router.push("/dashboard");
      }
    };

    fetchRoom();
  }, [isAuthenticated, router, roomId, category, user]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate the form data
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone
      ) {
        alert("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Make sure room data is valid
      if (!room) {
        alert("Room information is missing. Please try again.");
        setLoading(false);
        return;
      }
      
      // Parse string date to Date object, handling text formats like "Mon 5 April 2025"
      const parseDate = (dateStr: string) => {
        // First try standard parsing
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
        
        // If that fails, try parsing the format "Day DD Month YYYY"
        const parts = dateStr.split(' ');
        if (parts.length >= 3) {
          const day = parseInt(parts[1]);
          const month = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 
                       'august', 'september', 'october', 'november', 'december']
                       .indexOf(parts[2].toLowerCase());
          const year = parseInt(parts[3]);
          
          if (!isNaN(day) && month !== -1 && !isNaN(year)) {
            return new Date(year, month, day);
          }
        }
        
        // Fall back to current date if parsing fails
        return new Date();
      };

      // Format dates properly for the API and ensure they're valid
      const formatApiDate = (dateStr: string, isCheckOut = false, checkInDateStr: string | null = null) => {
        try {
          // Get current date for validation
          const currentDate = new Date();
          
          // Parse the input date
          const inputDate = parseDate(dateStr);
          
          // If this is a checkout date and we have a check-in date to compare against
          if (isCheckOut && checkInDateStr) {
            const checkInDate = parseDate(checkInDateStr);
            
            // If inputDate is the same as or before checkInDate, add at least 1 day
            if (inputDate <= checkInDate) {
              console.log(`Check-out date ${dateStr} is not after check-in date, adding 1 day`);
              const properCheckOutDate = new Date(checkInDate);
              properCheckOutDate.setDate(properCheckOutDate.getDate() + 1);
              return properCheckOutDate.toISOString();
            }
          }
          
          // If the input date is in the past, use a date from now
          if (inputDate < currentDate) {
            console.log(`Date ${dateStr} is in the past, using future date instead`);
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + (isCheckOut ? 2 : 1)); // Set to tomorrow or day after tomorrow for checkout
            return futureDate.toISOString();
          }
          
          // Otherwise use the provided date
          return inputDate.toISOString();
        } catch (error) {
          console.error("Error formatting date:", error);
          // Fall back to a safe future date if parsing fails
          const safeDate = new Date();
          safeDate.setDate(safeDate.getDate() + (isCheckOut ? 2 : 1)); // Set checkout to day after tomorrow
          return safeDate.toISOString();
        }
      };
      
      // Get user email from form or auth context
      const userEmail = formData.email || user?.email || '';
      
      // Format check-in and check-out dates
      const formattedCheckIn = formatApiDate(checkInDate, false, null);
      const formattedCheckOut = formatApiDate(checkOutDate, true, checkInDate);
      
      // Required payment methods: 'credit_card', 'paypal', 'cash', 'bank_transfer'
      const paymentMethod = 'credit_card';
      
      // Calculate total price to ensure it's a number
      const calculatedTotalPrice = Number(totalPrice) || 0;
      
      // Debug room information
      console.log("Room data for booking:", JSON.stringify(room, null, 2));
      
      // Validate room ID existence
      if (!room.id) {
        console.error("Room ID is missing or undefined!", room);
        throw new Error("Room ID is required but was not found. Please try another room.");
      }

      // Create the booking data in the format expected by the API
      const bookingData: BookingFormData = {
        // Room information with proper ID format - ensure it's a string and exists
        roomId: room.id.toString(),
        
        // Room type information required by BookingFormData interface
        roomType: room.category || '',
        roomTitle: room.title || '',
        roomCategory: room.category || '',
        roomImage: room.imageUrl || '',
        
        // Date information
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        nights: nightsStay,
        
        // Guest information
        adults: adultsCount,
        guests: adultsCount, // Required by BookingFormData interface
        children: 0,
        
        // Payment information
        paymentMethod: paymentMethod,
        totalPrice: calculatedTotalPrice,
        
        // Price breakdown required by BookingFormData interface
        basePrice: basePrice,
        taxAndFees: taxAndFees,
        
        // User information
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: userEmail,
        phone: formData.phone,
        specialRequests: formData.specialRequests || '',
        
        // Location information
        location: room.location || 'Taguig, Metro Manila',
      };

      console.log("Submitting booking data to API:", JSON.stringify(bookingData, null, 2));

      // Call the API to create the booking
      const response = await createBooking(bookingData);

      console.log("Booking API response:", JSON.stringify(response, null, 2));

      if (response && response.success) {
        // Show success state and redirect after delay
        setBookingCompleted(true);
        
        // Redirect to booking confirmation or history page after successful booking
        setTimeout(() => {
          router.push('/bookings/history');
        }, 2000);
      } else {
        // Handle error response without message property
        const errorMessage = "Failed to create booking. Please try again.";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating booking:", error);

      // More detailed error handling
      let errorMessage =
        "There was a problem processing your booking. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }

      // Show error to user
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to safely get image URLs - handles fallbacks for external URLs
  const getImageUrl = (url: string) => {
    // If URL is empty or undefined, return fallback
    if (!url) return FALLBACK_IMAGE;

    // If URL is already a relative path (local image), use it
    if (url.startsWith("/")) return url;

    // Handle known domains
    if (url.includes("res.cloudinary.com")) return url;

    // For other URLs, use fallback
    return FALLBACK_IMAGE;
  };

  if (!room) {
    return (
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium text-gray-800">
                Loading booking details...
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Please wait while we fetch your booking information.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (bookingCompleted) {
    return (
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <FaCheck className="text-green-600 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-gray-700 mb-6 text-base">
              Your booking for{" "}
              <span className="font-semibold">{room.title}</span> has been
              successfully processed. Confirmation has been sent to your email.
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
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1C3F32] mb-6 sm:mb-8">
        Confirm Booking
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Form */}
        <div className="w-full lg:w-2/3">
          <form onSubmit={handleSubmit}>
            {/* Guest Details Section */}
            <section className="mb-8">
              <h2 className="text-base font-medium mb-4 text-gray-800">
                Your details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded text-gray-800 text-base focus:border-[#1C3F32] focus:ring-1 focus:ring-[#1C3F32] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded text-gray-800 text-base focus:border-[#1C3F32] focus:ring-1 focus:ring-[#1C3F32] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded text-gray-800 text-base focus:border-[#1C3F32] focus:ring-1 focus:ring-[#1C3F32] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded text-gray-800 text-base focus:border-[#1C3F32] focus:ring-1 focus:ring-[#1C3F32] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="specialRequests"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Special requests to hotel
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded text-gray-800 text-base focus:border-[#1C3F32] focus:ring-1 focus:ring-[#1C3F32] focus:outline-none"
                />
              </div>
            </section>

            {/* Payment Information */}
            <section className="mb-8">
              <h2 className="text-base font-medium mb-4 text-gray-800">
                Payment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="nameOnCard"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name on card
                  </label>
                  <input
                    type="text"
                    id="nameOnCard"
                    name="nameOnCard"
                    value={formData.nameOnCard}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded text-gray-800 text-base focus:border-[#1C3F32] focus:ring-1 focus:ring-[#1C3F32] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Credit Card Number *
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded text-gray-800 text-base focus:border-[#1C3F32] focus:ring-1 focus:ring-[#1C3F32] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="expirationDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Expiration Date
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="expirationMonth"
                      name="expirationMonth"
                      value={formData.expirationMonth}
                      onChange={handleInputChange}
                      className="w-1/3 p-3 border border-gray-300 rounded text-gray-800 text-base focus:border-[#1C3F32] focus:ring-1 focus:ring-[#1C3F32] focus:outline-none"
                      required
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i + 1}>
                          {String(i + 1).padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                    <select
                      id="expirationYear"
                      name="expirationYear"
                      value={formData.expirationYear}
                      onChange={handleInputChange}
                      className="w-1/3 p-3 border border-gray-300 rounded text-gray-800 text-base focus:border-[#1C3F32] focus:ring-1 focus:ring-[#1C3F32] focus:outline-none"
                      required
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={new Date().getFullYear() + i}>
                          {new Date().getFullYear() + i}
                        </option>
                      ))}
                    </select>
                    <div className="w-1/3">
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="CVV/CVC *"
                        className="w-full p-3 border border-gray-300 rounded text-gray-800 text-base focus:border-[#1C3F32] focus:ring-1 focus:ring-[#1C3F32] focus:outline-none"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Billing Address */}
            <section className="mb-8">
              <h2 className="text-base font-medium mb-4 text-gray-800">
                Billing Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="billingFirstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    id="billingFirstName"
                    name="billingFirstName"
                    value={formData.billingFirstName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded text-gray-800 text-base focus:border-[#1C3F32] focus:ring-1 focus:ring-[#1C3F32] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="billingLastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    id="billingLastName"
                    name="billingLastName"
                    value={formData.billingLastName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded text-gray-800 text-base focus:border-[#1C3F32] focus:ring-1 focus:ring-[#1C3F32] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded text-gray-800 text-base focus:border-[#1C3F32] focus:ring-1 focus:ring-[#1C3F32] focus:outline-none"
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="PH">Philippines</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State/Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded text-gray-800 text-base focus:border-[#1C3F32] focus:ring-1 focus:ring-[#1C3F32] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Postal / ZIP Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded text-gray-800 text-base focus:border-[#1C3F32] focus:ring-1 focus:ring-[#1C3F32] focus:outline-none"
                    required
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-[#1C3F32] text-white py-3 px-6 rounded hover:bg-[#15332a] transition duration-300 w-full max-w-xs font-medium text-base"
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm & Proceed"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Booking Summary */}
        <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded">
          <div className="mb-6">
            <div className="relative h-40 w-full mb-4 rounded overflow-hidden">
              <Image
                src={getImageUrl(room.imageUrl || "")}
                alt={room.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            <h3 className="text-lg font-semibold mb-1 text-gray-800">
              {room.title}
            </h3>
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400">
                {[...Array(Math.floor(room.rating || 5))].map((_, i) => (
                  <span key={i}>★</span>
                ))}
                {room.rating && !Number.isInteger(room.rating) && (
                  <span>½</span>
                )}
              </div>
              <span className="ml-2 text-gray-600 text-sm font-medium">
                {room.rating || 5}-star rating
              </span>
              {room.reviews && (
                <span className="ml-1 text-gray-500 text-xs">
                  ({room.reviews} reviews)
                </span>
              )}
            </div>

            <div className="flex items-start gap-2 mb-2">
              <FaMapMarkerAlt className="h-4 w-4 text-[#1C3F32] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700 leading-tight">
                {room.location}
              </p>
            </div>

            {room.additionalAmenities &&
              room.additionalAmenities.length > 0 && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[#1C3F32]">
                    <FaWifi className="h-3 w-3" />
                    <span className="text-xs font-medium">WiFi</span>
                  </div>
                  {room.additionalAmenities.includes("Daily housekeeping") && (
                    <div className="flex items-center gap-1 text-[#1C3F32]">
                      <FaCheck className="h-3 w-3" />
                      <span className="text-xs font-medium">Housekeeping</span>
                    </div>
                  )}
                </div>
              )}
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <h4 className="font-medium mb-4 text-gray-800">
              Your booking details
            </h4>

            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="h-4 w-4 text-[#1C3F32]" />
                <span className="text-sm text-gray-700">Check-in</span>
              </div>
              <span className="font-medium text-gray-800">{checkInDate}</span>
            </div>

            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="h-4 w-4 text-[#1C3F32]" />
                <span className="text-sm text-gray-700">Check-out</span>
              </div>
              <span className="font-medium text-gray-800">{checkOutDate}</span>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-700">Length of stay</span>
              <span className="font-medium text-gray-800">
                {nightsStay} nights
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <FaUser className="h-4 w-4 text-[#1C3F32]" />
              <span className="text-sm text-gray-700">
                1 room • {room.maxOccupancy || adultsCount}{" "}
                {room.maxOccupancy === 1 ? "adult" : "adults"} max
              </span>
            </div>

            {room.bedType && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-700">Bed type</span>
                <span className="font-medium text-gray-800">
                  {room.bedType}
                </span>
              </div>
            )}

            {room.roomSize && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-700">Room size</span>
                <span className="font-medium text-gray-800">
                  {room.roomSize}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium mb-4 text-gray-800">Pricing Summary</h4>

            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-700">
                {nightsStay} nights × 1 room
              </span>
              <span className="font-medium text-gray-800">
                ₱{basePrice.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-700">
                Tax and service fees
              </span>
              <span className="font-medium text-gray-800">
                ₱{taxAndFees.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center font-semibold border-t border-gray-200 pt-3">
              <span className="text-gray-800">Total</span>
              <span className="text-[#1C3F32] text-lg">
                ₱{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1C3F32]"></div></div>}>
      <BookingContent />
    </Suspense>
  );
}
