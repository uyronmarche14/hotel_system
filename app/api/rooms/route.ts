import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";

/**
 * API route handler for rooms
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    
    // Construct URL to backend API
    const apiUrl = `${API_URL}/api/rooms?page=${page}&limit=${limit}`;
    console.log(`Proxying request to: ${apiUrl}`);

    // Forward the request to the backend
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    console.log(`Received response with status: ${response.status}`);

    // If the response is not OK, handle it gracefully
    if (!response.ok) {
      console.error(`API responded with status ${response.status}`);
      
      // Generate fallback data
      return NextResponse.json({
        success: true,
        count: 0,
        data: [],
        message: "Unable to fetch rooms from backend. Using fallback data."
      });
    }

    // Process successful response
    let data;
    try {
      data = await response.json();
      console.log(`Received ${data?.data?.length || 0} rooms from API`);
    } catch (error) {
      console.error("Error parsing API response:", error);
      // Return fallback data if parsing fails
      return NextResponse.json({
        success: true,
        count: 0,
        data: [],
        message: "Error parsing API response. Using fallback data."
      });
    }

    // Return the data from the backend
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in rooms API:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        data: [] 
      },
      { status: 500 }
    );
  }
}

/**
 * API route handler for creating a new room (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication would normally happen here
    // For now, we'll just proxy the request

    // Get room data from request
    const roomData = await request.json();
    console.log("Creating room with data:", roomData);

    // Forward the booking request to the backend API
    const response = await fetch(`${API_URL}/api/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomData),
    });

    // Log the response status for debugging
    console.log(`Room API responded with status: ${response.status}`);

    // Handle response based on status code
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Room API error:", errorData);

      // Return a structured error response
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to create room",
          errors: errorData.errors || [],
        },
        { status: response.status }
      );
    }

    // Return the successful response
    const roomResponse = await response.json();
    return NextResponse.json(roomResponse);
  } catch (error: any) {
    console.error("Error in room API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error when processing room request",
        error: error.message,
      },
      { status: 500 }
    );
  }
}