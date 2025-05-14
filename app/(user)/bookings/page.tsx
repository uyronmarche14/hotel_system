"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaExclamationCircle,
  FaChartBar,
} from "react-icons/fa";
import {
  getUserBookings,
  cancelBooking,
  Booking,
} from "@/app/lib/bookingService";

const FALLBACK_IMAGE = "/images/room-placeholder.jpg";

export default function BookingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    // Get email from localStorage or sessionStorage if available
    const storedEmail =
      localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (!email) return;

    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getUserBookings(email);
        setBookings(response.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load your bookings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [email]);

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const submittedEmail = formData.get("email") as string;
    if (submittedEmail) {
      setEmail(submittedEmail);
      // Save for future use
      localStorage.setItem("userEmail", submittedEmail);
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancellingId(bookingId);

      // Call API to cancel booking
      await cancelBooking(bookingId);

      // Update the booking status in the UI
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "cancelled", paymentStatus: "refunded" }
            : booking,
        ),
      );
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError("Failed to cancel booking. Please try again later.");
    } finally {
      setCancellingId(null);
    }
  };

  // Separate upcoming and past bookings
  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "pending",
  );

  const pastBookings = bookings.filter(
    (booking) =>
      booking.status === "completed" || booking.status === "cancelled",
  );

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format price function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(price);
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

  // Loading state
  if (isLoading && email) {
    return (
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C3F32] mb-6 sm:mb-8">
          My Bookings
        </h1>
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3">Loading your bookings...</span>
        </div>
      </main>
    );
  }

  // Email lookup form when no email is set
  if (!email) {
    return (
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C3F32] mb-6 sm:mb-8">
          My Bookings
        </h1>
        <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Find your bookings</h2>
          <p className="text-gray-600 mb-4">
            Enter the email address you used to make your booking.
          </p>

          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
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
              Find My Bookings
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C3F32] mb-6 sm:mb-8">
          My Bookings
        </h1>
        <div className="bg-red-50 p-4 rounded-md flex items-center text-red-700 mb-6">
          <FaExclamationCircle className="w-5 h-5 mr-2" />
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

  return (
    <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C3F32]">
          My Bookings
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Viewing bookings for: <span className="font-medium">{email}</span>
            <button
              onClick={() => {
                setEmail("");
                localStorage.removeItem("userEmail");
                sessionStorage.removeItem("userEmail");
              }}
              className="ml-2 text-[#1C3F32] underline"
            >
              Change
            </button>
          </div>
          <Link
            href="/bookings/history"
            className="text-[#1C3F32] hover:underline text-sm"
          >
            <FaChartBar className="inline mr-1" />
            View Booking History
          </Link>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1C3F32] mb-4 sm:mb-6">
          Upcoming Stays
        </h2>

        {upcomingBookings.length === 0 ? (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow text-center">
            <p className="text-gray-600">
              You don&apos;t have any upcoming bookings.
            </p>
            <Link
              href="/dashboard"
              className="inline-block mt-4 bg-[#1C3F32] text-white px-4 sm:px-6 py-2 rounded-md hover:bg-[#1C3F32]/90 transition-colors"
            >
              Book a Room
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {upcomingBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-4 sm:p-6 rounded-lg shadow"
              >
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                  {/* Room Image */}
                  <div className="w-full md:w-1/4">
                    <div className="relative w-full h-32 md:h-full rounded-lg overflow-hidden">
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
                  </div>

                  {/* Booking Details */}
                  <div className="w-full md:w-2/4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {booking.status === "pending" ? "Pending" : "Upcoming"}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        Booking ID: {booking.bookingId}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                      {booking.roomTitle}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <FaCalendarAlt className="text-[#1C3F32] min-w-4" />
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Check-in
                          </p>
                          <p className="text-sm sm:text-base">
                            {formatDate(booking.checkIn)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2">
                        <FaCalendarAlt className="text-[#1C3F32] min-w-4" />
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Check-out
                          </p>
                          <p className="text-sm sm:text-base">
                            {formatDate(booking.checkOut)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2">
                        <FaUsers className="text-[#1C3F32] min-w-4" />
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Guests
                          </p>
                          <p className="text-sm sm:text-base">
                            {booking.guests}{" "}
                            {booking.guests === 1 ? "Guest" : "Guests"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2">
                        <FaMapMarkerAlt className="text-[#1C3F32] min-w-4" />
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Location
                          </p>
                          <p className="text-sm sm:text-base truncate">
                            {booking.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="w-full md:w-1/4 flex flex-col justify-between mt-4 md:mt-0">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Total Price
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-[#1C3F32]">
                        {formatPrice(booking.totalPrice)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {booking.nights}{" "}
                        {booking.nights === 1 ? "night" : "nights"}
                      </p>
                    </div>

                    <div className="space-y-2 mt-3 md:mt-0">
                      <Link
                        href={`/bookings/${booking._id}`}
                        className="block w-full text-center bg-[#1C3F32] text-white py-2 rounded-md hover:bg-[#1C3F32]/90 transition-colors text-sm sm:text-base"
                      >
                        Manage Booking
                      </Link>
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="w-full border border-[#1C3F32] text-[#1C3F32] py-2 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingId === booking._id
                          ? "Cancelling..."
                          : "Cancel Booking"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1C3F32] mb-4 sm:mb-6">
          Past Stays
        </h2>

        {pastBookings.length === 0 ? (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow text-center">
            <p className="text-gray-600">
              You don&apos;t have any past bookings.
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {pastBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-4 sm:p-6 rounded-lg shadow"
              >
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                  {/* Room Image */}
                  <div className="w-full md:w-1/4">
                    <div className="relative w-full h-32 md:h-full rounded-lg overflow-hidden">
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
                  </div>

                  {/* Booking Details */}
                  <div className="w-full md:w-2/4">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          booking.status === "completed"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status === "completed"
                          ? "Completed"
                          : "Cancelled"}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        Booking ID: {booking.bookingId}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                      {booking.roomTitle}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <FaCalendarAlt className="text-[#1C3F32] min-w-4" />
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Check-in
                          </p>
                          <p className="text-sm sm:text-base">
                            {formatDate(booking.checkIn)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2">
                        <FaCalendarAlt className="text-[#1C3F32] min-w-4" />
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Check-out
                          </p>
                          <p className="text-sm sm:text-base">
                            {formatDate(booking.checkOut)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2">
                        <FaUsers className="text-[#1C3F32] min-w-4" />
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Guests
                          </p>
                          <p className="text-sm sm:text-base">
                            {booking.guests}{" "}
                            {booking.guests === 1 ? "Guest" : "Guests"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2">
                        <FaMapMarkerAlt className="text-[#1C3F32] min-w-4" />
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Location
                          </p>
                          <p className="text-sm sm:text-base truncate">
                            {booking.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="w-full md:w-1/4 flex flex-col justify-between mt-4 md:mt-0">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Total Price
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-[#1C3F32]">
                        {formatPrice(booking.totalPrice)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {booking.nights}{" "}
                        {booking.nights === 1 ? "night" : "nights"}
                      </p>
                    </div>

                    {booking.status === "completed" && (
                      <div className="space-y-2 mt-3 md:mt-0">
                        <Link
                          href={`/bookings/${booking._id}`}
                          className="block w-full text-center border border-[#1C3F32] text-[#1C3F32] py-2 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base"
                        >
                          View Details
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
