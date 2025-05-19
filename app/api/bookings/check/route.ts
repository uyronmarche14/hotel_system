import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";

/**
 * Health check endpoint for the bookings API
 */
export async function GET(request: NextRequest) {
  try {
    // Construct the URL to the backend API
    const apiUrl = `${API_URL}/api/bookings/check-availability`;
    console.log(`Checking bookings API health: ${apiUrl}`);

    // Send a test request to the backend
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    // Log response status for debugging
    console.log(`Bookings API health check status: ${response.status}`);

    // Return health check response
    return NextResponse.json({
      success: true,
      apiStatus: response.status,
      message: "Bookings API connectivity check completed",
      endpoint: apiUrl,
      backendUp: response.ok,
    });
  } catch (error: any) {
    console.error("Error checking bookings API health:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to bookings API",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
