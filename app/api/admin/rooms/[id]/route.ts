import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";
import type { ApiError } from "@/app/types/api";

export async function GET(request: NextRequest) {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    // Get the token from the authorization header
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    // Forward the request to the backend API
    const response = await fetch(`${API_URL}/api/admin/rooms/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    // Parse the response as text first to help with debugging
    const responseText = await response.text();

    let data;
    try {
      // Try to parse the response as JSON
      data = JSON.parse(responseText);
    } catch {
      console.error(
        "Failed to parse response as JSON:",
        responseText.substring(0, 500),
      );
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch room: Server returned an invalid response",
        },
        { status: 500 },
      );
    }

    // Return the appropriate response
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch room" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Admin room fetch error:", error);
    const apiError = error as ApiError;
    return NextResponse.json(
      {
        success: false,
        message:
          apiError.response?.data?.message ||
          apiError.message ||
          "Unknown error",
      },
      { status: apiError.response?.status || 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    console.log(`Processing PUT request for room ID: ${id}`);

    // Get the token from the authorization header
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }
    
    // Define valid room fields based on your database schema
    const validRoomFields = [
      'id', 'title', 'room_number', 'roomNumber', 'type', 'category', 'price',
      'location', 'description', 'full_description', 'fullDescription', 'capacity', 
      'max_occupancy', 'maxOccupancy', 'amenities', 'additional_amenities', 'additionalAmenities', 
      'features', 'images', 'image_url', 'imageUrl', 'href', 'rating', 'reviews', 
      'bed_type', 'bedType', 'room_size', 'roomSize', 'view_type', 'viewType', 'is_available', 'isAvailable'
    ];
    
    // Check content type to determine how to handle the request
    const contentType = request.headers.get('content-type') || '';
    let backendBody;
    let requestData: any = {};
    
    if (contentType.includes('multipart/form-data')) {
      // Handle multipart/form-data submission
      console.log('Processing multipart/form-data request');
      const formData = await request.formData();
      
      // Forward the multipart form data to the backend API
      const backendFormData = new FormData();
      
      // Only transfer valid fields to the new FormData object
      for (const [key, value] of formData.entries()) {
        if (validRoomFields.includes(key)) {
          backendFormData.append(key, value);
        } else {
          console.log(`Skipping field '${key}' as it's not in database schema`);
        }
      }
      
      // Set request body to the form data
      backendBody = backendFormData;
      console.log(`Updating room ${id} with form data keys:`, [...backendFormData.keys()]);
    } else {
      // Handle JSON submission (from RoomImageManager)
      console.log('Processing JSON request');
      requestData = await request.json();
      
      // Filter out invalid fields
      const filteredData: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(requestData)) {
        if (validRoomFields.includes(key)) {
          filteredData[key] = value;
        } else {
          console.log(`Skipping field '${key}' as it's not in database schema`);
        }
      }
      
      // Log key data points for debugging
      console.log('Image data being sent to backend:', {
        hasImageUrl: !!filteredData.image_url,
        imagesLength: Array.isArray(filteredData.images) ? filteredData.images.length : 'not an array',
        fieldsIncluded: Object.keys(filteredData)
      });
      
      // Set request body to the JSON data
      backendBody = JSON.stringify(filteredData);
    }
    
    // Set headers based on content type
    const headers: HeadersInit = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
    
    // Only set Content-Type for JSON requests
    if (!contentType.includes('multipart/form-data')) {
      headers['Content-Type'] = 'application/json';
    }

    // Forward the request to the backend API
    console.log(`Sending request to ${API_URL}/api/admin/rooms/${id}`);
    const response = await fetch(`${API_URL}/api/admin/rooms/${id}`, {
      method: "PUT",
      headers,
      body: backendBody,
    });

    // Parse the response as text first to help with debugging
    const responseText = await response.text();

    let data;
    try {
      // Try to parse the response as JSON
      data = JSON.parse(responseText);
    } catch {
      console.error(
        "Failed to parse response as JSON:",
        responseText.substring(0, 500),
      );
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update room: Server returned an invalid response",
        },
        { status: 500 },
      );
    }

    // Return the appropriate response
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to update room" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Admin room update error:", error);
    const apiError = error as ApiError;
    return NextResponse.json(
      {
        success: false,
        message:
          apiError.response?.data?.message ||
          apiError.message ||
          "Unknown error",
      },
      { status: apiError.response?.status || 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    // Get the token from the authorization header
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    // Forward the request to the backend API
    const response = await fetch(`${API_URL}/api/admin/rooms/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Parse the response as text first to help with debugging
    const responseText = await response.text();

    let data;
    try {
      // Try to parse the response as JSON
      data = JSON.parse(responseText);
    } catch {
      console.error(
        "Failed to parse response as JSON:",
        responseText.substring(0, 500),
      );
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete room: Server returned an invalid response",
        },
        { status: 500 },
      );
    }

    // Return the appropriate response
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to delete room" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Admin room delete error:", error);
    const apiError = error as ApiError;
    return NextResponse.json(
      {
        success: false,
        message:
          apiError.response?.data?.message ||
          apiError.message ||
          "Unknown error",
      },
      { status: apiError.response?.status || 500 },
    );
  }
}
