"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { getAllRooms, RoomType } from "@/app/services/roomService";
import { API_URL } from "@/app/lib/constants";
import Cookies from "js-cookie";
import SafeImage from "@/app/components/ui/SafeImage";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isAvailable: boolean;
  isCheckIn?: boolean;
  isCheckOut?: boolean;
  isSelected?: boolean;
}

const CheckAvailabilityPage = () => {
  const params = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calendar and date selection state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendar, setCalendar] = useState<CalendarDay[][]>([]);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(2);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [usingSimulatedData, setUsingSimulatedData] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const category = params.category as string;
  const roomId = params.roomId as string;

  // Load room data
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const allRooms = await getAllRooms();

        // Find room that matches either by title slug or by roomId
        const foundRoom = allRooms.find((r) => {
          const titleSlug = r.title.toLowerCase().replace(/ /g, "-");
          return (
            r.category === category &&
            (titleSlug === roomId || r.href?.includes(roomId))
          );
        });

        if (foundRoom) {
          setRoom(foundRoom);
        } else {
          setError("Room not found");
        }
      } catch (error) {
        console.error("Failed to fetch room data:", error);
        setError("Failed to load room data");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [category, roomId]);

  // Fetch availability data from API
  const fetchAvailabilityData = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");

      // Get first and last day of current month and next month for comprehensive view
      const firstDay = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1,
      );
      const lastDay = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 2,
        0,
      ); // Check 2 months

      // Format dates for API
      const formattedFirstDay = firstDay.toISOString().split("T")[0];
      const formattedLastDay = lastDay.toISOString().split("T")[0];

      // Log the API URL for debugging
      console.log("API URL config:", API_URL);

      if (!room) {
        throw new Error("Room data not available");
      }

      // Construct API endpoint - ensure no double slashes in URL
      const apiBase = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
      const endpoint = `${apiBase}/api/bookings/check-availability?roomCategory=${category}&roomTitle=${encodeURIComponent(room.title)}&checkIn=${formattedFirstDay}&checkOut=${formattedLastDay}`;

      console.log("Fetching availability data from:", endpoint);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Availability data received:", data);

        // Process booked dates if available
        if (data.bookedDates && Array.isArray(data.bookedDates)) {
          const parsedDates = data.bookedDates.map(
            (dateStr: string) => new Date(dateStr),
          );
          setBookedDates(parsedDates);
        } else {
          // If no data from backend, create some simulated booked dates for demonstration
          console.log(
            "No booked dates returned from API, using simulation data",
          );
          simulateBookedDates();
        }
      } else {
        console.error(
          "Error fetching availability:",
          response.status,
          response.statusText,
        );

        // Try to get more error details
        try {
          const errorText = await response.text();
          console.error("Error details:", errorText);
        } catch {
          console.error("Could not read error details");
        }

        // If API endpoint is not available, simulate booked dates
        simulateBookedDates();
      }
    } catch {
      console.error("Failed to fetch availability data");
      simulateBookedDates();
    } finally {
      setLoading(false);
    }
  }, [category, room, currentMonth]);

  // Verify date availability with backend before proceeding
  const verifyAvailabilityBeforeBooking = async () => {
    if (!checkInDate || !checkOutDate || !room) return false;

    setIsChecking(true);
    try {
      const token = Cookies.get("token");

      // Format dates for API
      const formattedCheckIn = checkInDate.toISOString().split("T")[0];
      const formattedCheckOut = checkOutDate.toISOString().split("T")[0];

      // Construct API endpoint - ensure no double slashes in URL
      const apiBase = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
      const endpoint = `${apiBase}/api/bookings/check-availability?roomCategory=${category}&roomTitle=${encodeURIComponent(room.title)}&checkIn=${formattedCheckIn}&checkOut=${formattedCheckOut}&guests=${guests}`;

      console.log("Verifying final availability before booking:", endpoint);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (data.isAvailable) {
          return true;
        } else {
          setError(
            data.message ||
              "Room is not available for the selected dates. Please choose different dates.",
          );
          return false;
        }
      } else {
        // If API fails, assume availability based on calendar simulation
        const allDatesAvailable = areAllDatesAvailable(
          checkInDate,
          checkOutDate,
        );
        if (!allDatesAvailable) {
          setError(
            "One or more selected dates appear to be unavailable. Please choose different dates.",
          );
        }
        return allDatesAvailable;
      }
    } catch (error) {
      console.error("Failed to verify availability:", error);
      // Fallback to local check if API call fails
      return areAllDatesAvailable(checkInDate, checkOutDate);
    } finally {
      setIsChecking(false);
    }
  };

  // Check if all dates in a range are available
  const areAllDatesAvailable = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    for (let day = new Date(start); day < end; day.setDate(day.getDate() + 1)) {
      if (!isDateAvailable(day)) {
        return false;
      }
    }

    return true;
  };

  // Simulate booked dates for demonstration purposes
  const simulateBookedDates = () => {
    setUsingSimulatedData(true);
    const simulatedDates: Date[] = [];
    const today = new Date();

    // Add some weekend dates as booked
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Make weekends more likely to be booked
      if (date.getDay() === 5 || date.getDay() === 6) {
        // Friday or Saturday
        if (Math.random() < 0.7) {
          // 70% chance of booking
          simulatedDates.push(date);
        }
      } else {
        if (Math.random() < 0.3) {
          // 30% chance of booking for weekdays
          simulatedDates.push(date);
        }
      }
    }

    setBookedDates(simulatedDates);
  };

  // Helper functions for date comparisons
  const isSameDay = useCallback((date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }, []);

  const isDateBooked = useCallback(
    (date: Date) => {
      return bookedDates.some((bookedDate) => isSameDay(date, bookedDate));
    },
    [bookedDates, isSameDay],
  ); // Keep bookedDates in dependency array as it's needed

  const isDateAvailable = useCallback(
    (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Date is in the past
      if (date < today) {
        return false;
      }

      // Date is booked
      if (isDateBooked(date)) {
        return false;
      }

      return true;
    },
    [isDateBooked],
  );

  const isDateInRange = useCallback(
    (date: Date) => {
      if (!checkInDate || !checkOutDate) return false;

      const time = date.getTime();
      return time > checkInDate.getTime() && time < checkOutDate.getTime();
    },
    [checkInDate, checkOutDate],
  );

  // Calendar generation
  const generateCalendar = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of the month
    const firstDayOfMonth = new Date(year, month, 1);

    // Get the day of the week the month starts on (0 = Sunday, 1 = Monday, etc.)
    const startingDayIndex = firstDayOfMonth.getDay();

    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get the number of days in the previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Calculate the total number of cells needed (6 rows of 7 days)
    const totalCells = 42;

    // Generate calendar days
    const calendarDays: CalendarDay[] = [];

    // Add days from previous month
    for (let i = startingDayIndex - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      calendarDays.push({
        date,
        isCurrentMonth: false,
        isAvailable: isDateAvailable(date),
      });
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      calendarDays.push({
        date,
        isCurrentMonth: true,
        isAvailable: isDateAvailable(date),
        isCheckIn: checkInDate ? isSameDay(date, checkInDate) : false,
        isCheckOut: checkOutDate ? isSameDay(date, checkOutDate) : false,
        isSelected: isDateInRange(date),
      });
    }

    // Add days from next month to fill the remaining cells
    const remainingCells = totalCells - calendarDays.length;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day);
      calendarDays.push({
        date,
        isCurrentMonth: false,
        isAvailable: isDateAvailable(date),
      });
    }

    // Split days into weeks
    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < totalCells; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }

    setCalendar(weeks);
  }, [
    currentMonth,
    checkInDate,
    checkOutDate,
    isDateAvailable,
    isDateInRange,
    isSameDay,
  ]); // Remove bookedDates as it's accessed through isDateAvailable

  // Add useEffect to call generateCalendar
  useEffect(() => {
    generateCalendar();
  }, [currentMonth, bookedDates, checkInDate, checkOutDate, generateCalendar]);

  // Handle month navigation
  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  // Handle date selection
  const handleDateClick = (day: CalendarDay) => {
    const { date, isAvailable } = day;

    // Ignore if date is not available
    if (!isAvailable) return;

    if (!checkInDate) {
      // Setting check-in date
      setCheckInDate(date);
    } else if (!checkOutDate) {
      // Setting check-out date
      if (date < checkInDate) {
        // If selected date is before check-in, swap them
        setCheckOutDate(checkInDate);
        setCheckInDate(date);
      } else {
        setCheckOutDate(date);
      }
    } else {
      // Both dates are already set, start fresh
      setCheckInDate(date);
      setCheckOutDate(null);
    }
  };

  // Reset date selection
  const resetDateSelection = () => {
    setCheckInDate(null);
    setCheckOutDate(null);
  };

  // Handle guest count change
  const handleGuestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGuests(parseInt(e.target.value));
  };

  // Check availability and proceed to booking
  const handleProceedToBooking = async () => {
    if (checkInDate && checkOutDate && room) {
      setError(null);

      // First verify availability one more time before proceeding
      const isAvailable = await verifyAvailabilityBeforeBooking();

      if (isAvailable) {
        // Format the dates for URL parameters
        const checkInStr = checkInDate.toISOString();
        const checkOutStr = checkOutDate.toISOString();
        const nights = Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        // Navigate to booking page with all necessary parameters
        router.push(
          `/bookings/new?roomId=${roomId}&category=${category}&checkIn=${encodeURIComponent(checkInStr)}&checkOut=${encodeURIComponent(checkOutStr)}&nights=${nights}&guests=${guests}`,
        );
      }
      // If not available, error is already set by verifyAvailabilityBeforeBooking
    }
  };

  // Month names for calendar header
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Loading state
  if (loading && !room) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state
  if (error && !room) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href={`/hotelRoomDetails/${category}`}
            className="inline-block bg-[#1C3F32] text-white px-6 py-2 rounded-md hover:bg-[#1C3F32]/90 transition-colors mr-4"
          >
            Back to Category
          </Link>
          <Link
            href="/dashboard"
            className="inline-block bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center text-sm text-[#1C3F32] mb-4">
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/hotelRoomDetails/${category}`}
          className="hover:underline"
        >
          {category
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </Link>
        <span className="mx-2">›</span>
        {room && (
          <>
            <Link
              href={`/hotelRoomDetails/${category}/${roomId}`}
              className="hover:underline"
            >
              {room.title}
            </Link>
            <span className="mx-2">›</span>
          </>
        )}
        <span className="font-medium">Check Availability</span>
      </div>

      {/* Back button */}
      <Link
        href={`/hotelRoomDetails/${category}/${roomId}`}
        className="inline-flex items-center text-[#1C3F32] font-medium hover:underline"
      >
        <FaArrowLeft className="mr-2" /> Back to Room Details
      </Link>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column - Room Info */}
        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-[#1C3F32]">
              Room Information
            </h2>

            {room && (
              <>
                <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                  <SafeImage
                    src={room.imageUrl}
                    fallbackSrc="/images/room-placeholder.jpg"
                    imageType="room"
                    alt={room.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <h3 className="text-lg font-semibold mb-2">{room.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{room.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">
                      {category
                        .split("-")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per night:</span>
                    <span className="font-medium text-[#1C3F32]">
                      ₱{room.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Occupancy:</span>
                    <span className="font-medium">
                      {room.maxOccupancy || 4} guests
                    </span>
                  </div>
                </div>

                {/* Number of Guests Selection */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2 text-[#1C3F32]" />
                    Number of Guests
                  </label>
                  <select
                    value={guests}
                    onChange={handleGuestChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] focus:border-transparent"
                  >
                    {[...Array(room.maxOccupancy || 4)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1} {i === 0 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Booking Summary */}
            {checkInDate && checkOutDate && room && (
              <div className="mt-6 bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-[#1C3F32] mb-3">
                  Booking Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span>
                      {checkInDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span>
                      {checkOutDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span>{guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights:</span>
                    <span>
                      {Math.ceil(
                        (checkOutDate.getTime() - checkInDate.getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium text-[#1C3F32]">
                    <span>Total Price:</span>
                    <span>
                      ₱
                      {(
                        room.price *
                        Math.ceil(
                          (checkOutDate.getTime() - checkInDate.getTime()) /
                            (1000 * 60 * 60 * 24),
                        )
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleProceedToBooking}
                    disabled={isChecking}
                    className="w-full p-2 bg-[#1C3F32] text-white rounded-md hover:bg-[#15332a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isChecking
                      ? "Verifying Availability..."
                      : "Proceed to Booking"}
                  </button>
                  <button
                    onClick={resetDateSelection}
                    className="w-full p-2 border border-[#1C3F32] text-[#1C3F32] rounded-md hover:bg-green-50 transition-colors"
                  >
                    Reset Selection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Calendar View */}
        <div className="md:col-span-9">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6 text-[#1C3F32]">
              Room Availability Calendar
            </h2>

            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={prevMonth}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <FaChevronLeft className="text-[#1C3F32]" />
              </button>
              <h3 className="text-lg font-semibold">
                {monthNames[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <FaChevronRight className="text-[#1C3F32]" />
              </button>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, i) => (
                  <div
                    key={i}
                    className="text-center font-medium p-2 text-sm text-gray-600"
                  >
                    {day}
                  </div>
                ),
              )}
            </div>

            {/* Calendar Grid */}
            {loading && (
              <div className="min-h-[400px] flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-[#1C3F32]">
                  Loading availability data...
                </span>
              </div>
            )}

            {!loading && (
              <>
                {usingSimulatedData && (
                  <div className="mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-yellow-800 text-sm">
                    <p className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Note: Using simulated availability data. Actual room
                      availability may differ.
                    </p>
                  </div>
                )}

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {calendar.map((week, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-7 border-b border-gray-200 last:border-b-0"
                    >
                      {week.map((day, j) => (
                        <div
                          key={j}
                          className={`
                            min-h-[80px] p-2 border-r border-gray-200 last:border-r-0 relative
                            ${!day.isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}
                            ${day.isCheckIn ? "bg-green-100" : ""}
                            ${day.isCheckOut ? "bg-red-100" : ""}
                            ${day.isSelected ? "bg-green-50" : ""}
                            ${!day.isAvailable ? "cursor-not-allowed" : "cursor-pointer hover:bg-blue-50"}
                          `}
                          onClick={() =>
                            day.isAvailable && handleDateClick(day)
                          }
                        >
                          {/* Date Number */}
                          <div
                            className={`
                            text-sm font-semibold rounded-full w-7 h-7 flex items-center justify-center
                            ${day.isCheckIn ? "bg-green-500 text-white" : ""}
                            ${day.isCheckOut ? "bg-red-500 text-white" : ""}
                          `}
                          >
                            {day.date.getDate()}
                          </div>

                          {/* Availability Indicator */}
                          {day.isCurrentMonth && (
                            <div className="mt-1">
                              {!day.isAvailable ? (
                                <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                                  Booked
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                  Available
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Refresh Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => fetchAvailabilityData()}
                disabled={loading}
                className="flex items-center text-[#1C3F32] px-4 py-2 border border-[#1C3F32] rounded-md hover:bg-green-50 disabled:opacity-50"
              >
                <svg
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Refresh Availability
              </button>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 mr-2"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 mr-2"></div>
                <span className="text-sm">Booked</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 mr-2 rounded-full"></div>
                <span className="text-sm">Check-in Date</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 mr-2 rounded-full"></div>
                <span className="text-sm">Check-out Date</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-50 mr-2"></div>
                <span className="text-sm">Selected Range</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-4 bg-blue-50 p-4 rounded-lg">
              <h3 className="text-blue-800 font-medium mb-2">How to Use</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Click on an available date to select your check-in date
                </li>
                <li>
                  • Click on another available date to select your check-out
                  date
                </li>
                <li>
                  • To change your selection, click on any available date to
                  start over
                </li>
                <li>
                  • After selecting your dates, click &quot;Proceed to
                  Booking&quot; to continue
                </li>
                <li>
                  • Use the refresh button to check for latest availability data
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckAvailabilityPage;
