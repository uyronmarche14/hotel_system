import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";
import type { ApiError } from "@/app/types/api";

// Debug helper
const debugLog = (message: string, data: any) => {
  console.log(`[API:room-images] ${message}:`, data);
};

/**
 * Handle POST request for uploading multiple additional room images
 * 
 * @param request The NextRequest instance
 */
export async function POST(request: NextRequest) {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    // Since the path is /api/admin/rooms/[id]/images, the ID should be pathParts[4]
    const id = pathParts[4]; 

    // Get the token from the authorization header
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();
    
    // Check if any images were provided
    const hasImages = formData.has('images');
    const hasImage = formData.has('image');
    
    debugLog('Images upload request', {
      roomId: id,
      hasImages: hasImages,
      hasImage: hasImage,
      formDataKeys: Array.from(formData.keys())
    });
    
    if (!hasImages && !hasImage) {
      debugLog('No images provided', { status: 400 });
      return NextResponse.json(
        { success: false, message: "No images provided" },
        { status: 400 },
      );
    }
    
    // Create a new FormData to forward to the backend
    const backendFormData = new FormData();
    
    // Copy all entries from the original form data
    for (const [key, value] of formData.entries()) {
      backendFormData.append(key, value);
    }
    
    console.log(`Uploading additional images for room ${id}`);

    // Forward the request to the backend API
    const response = await fetch(`${API_URL}/api/admin/rooms/${id}/images`, {
      method: "POST",
      headers: {
        // Don't set Content-Type for FormData, it will be set automatically
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
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
          message: "Failed to upload images: Server returned an invalid response",
        },
        { status: 500 },
      );
    }

    // Return the appropriate response
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to upload images" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Room images upload error:", error);
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
