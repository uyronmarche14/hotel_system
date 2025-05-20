import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";

/**
 * GET handler for admin rooms
 * Fetches all rooms from the backend
 */
export async function GET(request: NextRequest) {
  try {
    // Get the token from the authorization header
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    // Forward the request to the backend API
    const response = await fetch(`${API_URL}/api/admin/rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    // Parse the response
    const data = await response.json();

    // Return the appropriate response
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch rooms" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Admin rooms fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Server error: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 },
    );
  }
}

/**
 * POST handler for creating a new room
 */
export async function POST(request: NextRequest) {
  try {
    // Get the token from the authorization header
    const authHeader = request.headers.get("authorization");
    console.log("Authorization header:", authHeader);
    
    // Extract token from auth header
    const token = authHeader?.startsWith("Bearer ") 
      ? authHeader.split(" ")[1] 
      : authHeader;  // Fallback to using the whole header if it doesn't have Bearer prefix

    if (!token) {
      console.log("No token found in request");
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }
    
    // Debug token length
    console.log("Token received length:", token.length);

    // Handle multipart/form-data submission
    const formData = await request.formData();
    
    // Debug logging
    console.log("Received form data keys:", [...formData.keys()]);
    
    // Forward the multipart form data to the backend API
    const backendFormData = new FormData();
    
    // Define valid room fields based on your database schema
    const validRoomFields = [
      'id', 'title', 'roomNumber', 'type', 'category', 'price',
      'location', 'description', 'fullDescription', 'capacity', 
      'maxOccupancy', 'amenities', 'additionalAmenities', 'features',
      'images', 'imageUrl', 'href', 'rating', 'reviews', 'bedType',
      'roomSize', 'viewType', 'isAvailable'
    ];
    
    // Only transfer valid fields to the new FormData object
    for (const [key, value] of formData.entries()) {
      // Skip any field not in our valid list (like 'discount')
      if (key === 'images' || validRoomFields.includes(key)) {
        backendFormData.append(key, value);
      } else {
        console.log(`Skipping field '${key}' as it's not in database schema`);
      }
    }
    
    // Forward the request to the backend API
    const response = await fetch(`${API_URL}/api/admin/rooms`, {
      method: "POST",
      headers: {
        // Don't set Content-Type for FormData, it will be set automatically
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });

    // Parse the response
    const data = await response.json();

    // Return the appropriate response
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to create room" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Admin room create error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Server error: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 },
    );
  }
}