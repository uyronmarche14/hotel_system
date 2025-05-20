import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";

// Simple mock for testing - to avoid next-auth dependency issues

/**
 * API route for managing bookings
 */
export async function POST(request: NextRequest) {
  try {
    // Get booking data from request
    const bookingData = await request.json();
    console.log("Creating booking with data:", JSON.stringify(bookingData, null, 2));

    // Extract token from cookies if available
    const cookieHeader = request.headers.get('cookie');
    const token = cookieHeader?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
    
    // Make sure all required fields are present
    const requiredFields = [
      "roomId",
      "checkIn",
      "checkOut",
      "totalPrice",
      "nights",
      // Field can be either adults or guests (we'll use whichever is available)
      ...(bookingData.adults ? ["adults"] : ["guests"]),
      "paymentMethod",
    ];

    const missingFields = requiredFields.filter(field => 
      bookingData[field] === undefined || bookingData[field] === null || bookingData[field] === ''
    );

    if (missingFields.length > 0) {
      console.error("Missing required booking fields:", missingFields);
      return NextResponse.json(
        {
          success: false,
          message: "Missing required booking information",
          errors: missingFields.map(field => ({
            param: field,
            msg: `${field} is required`,
          })),
        },
        { status: 400 }
      );
    }

    // If user data is not provided (from frontend context), use a fallback guest user
    if (!bookingData.userId) {
      // Try to use the email from the booking data
      const guestEmail = bookingData.email || 'guest@example.com';
      const guestName = bookingData.firstName && bookingData.lastName ? 
                        `${bookingData.firstName} ${bookingData.lastName}` : 'Guest User';
      
      bookingData.userId = 'guest-' + Date.now();
      bookingData.userEmail = guestEmail;
      bookingData.userName = guestName;
    }

    // Format dates as ISO strings if they aren't already
    if (bookingData.checkIn && !(bookingData.checkIn instanceof Date)) {
      // Handle various date formats including "Mon 5 April 2025" format
      const checkInDate = new Date(bookingData.checkIn);
      if (!isNaN(checkInDate.getTime())) {
        bookingData.checkIn = checkInDate.toISOString();
      } else {
        // Try parsing other date formats like "Mon 5 April 2025"
        const parts = bookingData.checkIn.split(' ');
        if (parts.length >= 3) {
          // Extract day, month, year
          const day = parseInt(parts[1]);
          const month = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 
                       'august', 'september', 'october', 'november', 'december']
                       .indexOf(parts[2].toLowerCase());
          const year = parseInt(parts[3]);
          
          if (!isNaN(day) && month !== -1 && !isNaN(year)) {
            const date = new Date(year, month, day);
            bookingData.checkIn = date.toISOString();
          }
        }
      }
    }

    if (bookingData.checkOut && !(bookingData.checkOut instanceof Date)) {
      // Same processing for checkout date
      const checkOutDate = new Date(bookingData.checkOut);
      if (!isNaN(checkOutDate.getTime())) {
        bookingData.checkOut = checkOutDate.toISOString();
      } else {
        // Try parsing other date formats like "Mon 5 April 2025"
        const parts = bookingData.checkOut.split(' ');
        if (parts.length >= 3) {
          // Extract day, month, year
          const day = parseInt(parts[1]);
          const month = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 
                       'august', 'september', 'october', 'november', 'december']
                       .indexOf(parts[2].toLowerCase());
          const year = parseInt(parts[3]);
          
          if (!isNaN(day) && month !== -1 && !isNaN(year)) {
            const date = new Date(year, month, day);
            bookingData.checkOut = date.toISOString();
          }
        }
      }
    }

    // Check if roomId is valid - it must exist and be in a valid format for Supabase UUID
    if (!bookingData.roomId || bookingData.roomId === 'undefined' || bookingData.roomId === 'null') {
      console.error("Missing or invalid roomId:", bookingData.roomId);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid room ID format",
          error: "A valid room ID is required"
        },
        { status: 400 }
      );
    }

    // Check if roomId matches UUID pattern (for Supabase)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValidUuid = uuidPattern.test(bookingData.roomId);
    
    // If not a valid UUID, try to create a fallback ID that's compatible
    const finalRoomId = isValidUuid 
      ? bookingData.roomId 
      : '00000000-0000-0000-0000-000000000001';
      
    console.log(`RoomId validation: Original=${bookingData.roomId}, Valid UUID=${isValidUuid}, Final=${finalRoomId}`);

    // Ensure all required fields are in the correct format for the backend
    // Format the data to match the backend API expectations
    const formattedBookingData = {
      room_id: bookingData.roomId,
      check_in: bookingData.checkIn,
      check_out: bookingData.checkOut,
      total_price: Number(bookingData.totalPrice) || 0,
      base_price: Number(bookingData.basePrice) || (bookingData.totalPrice ? Number(bookingData.totalPrice) * 0.9 : 0),
      tax_and_fees: Number(bookingData.taxAndFees) || (bookingData.totalPrice ? Number(bookingData.totalPrice) * 0.1 : 0),
      nights: Number(bookingData.nights) || 1,
      guests: Number(bookingData.guests || bookingData.adults) || 1, // Use guests field, fall back to adults if needed
      payment_method: bookingData.paymentMethod || 'credit_card',
      payment_status: bookingData.paymentStatus || 'pending',
      special_requests: bookingData.specialRequests || '',
      status: bookingData.status || 'pending',
      user_id: bookingData.userId || `guest-${Date.now()}`,
      // Personal information
      first_name: bookingData.firstName || '',
      last_name: bookingData.lastName || '',
      email: bookingData.email || '',
      phone: bookingData.phone || '',
      // Room information
      room_title: bookingData.roomTitle || '',
      room_category: bookingData.roomCategory || '',
      room_type: bookingData.roomType || '',
      room_image: bookingData.roomImage || '',
      location: bookingData.location || 'Taguig, Metro Manila'
    };

    console.log("Sending formatted booking data to backend:", JSON.stringify(formattedBookingData, null, 2));

    // Forward the booking request to the backend API
    const response = await fetch(`${API_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(formattedBookingData),
    });

    // Log the response status for debugging
    console.log(`Booking API responded with status: ${response.status}`);

    // Get response text first for debugging
    const responseText = await response.text();
    console.log("Backend response:", responseText);
    
    // Parse the response if it's valid JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON", e);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to process booking response",
          rawResponse: responseText.substring(0, 500) // Include part of the raw response for debugging
        },
        { status: 500 }
      );
    }

    // Handle response based on status code
    if (!response.ok) {
      console.error("Booking API error:", responseData);

      // Return a structured error response
      return NextResponse.json(
        {
          success: false,
          message: responseData.message || "Failed to create booking",
          errors: responseData.errors || [],
        },
        { status: response.status }
      );
    }

    // Return the successful booking response
    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      data: responseData
    });
    
  } catch (error: any) {
    console.error("Error in booking API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error when processing booking request",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler for retrieving bookings
 */
export async function GET(request: NextRequest) {
  try {
    // TEMPORARY: Use a mock session for testing without auth
    const session = {
      user: {
        id: "test-user-id",
        email: "guest@example.com",
        name: "Guest User"
      },
      accessToken: "dummy-token-for-testing"
    };

    // Forward request to the backend API
    const response = await fetch(`${API_URL}/api/bookings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken || ""}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching bookings:", errorData);
      
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to fetch bookings",
        },
        { status: response.status }
      );
    }

    // Return the bookings data
    const bookingsData = await response.json();
    return NextResponse.json(bookingsData);
    
  } catch (error: any) {
    console.error("Error in GET bookings API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error when fetching bookings",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
