import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";
import type { ApiError } from "@/app/types/api";

// Debug helper
const debugLog = (message: string, data: any) => {
  console.log(`[API:cloudinary-delete] ${message}:`, data);
};

/**
 * Handle DELETE request for deleting a Cloudinary image
 * 
 * @param request The NextRequest instance
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get the token from the authorization header
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    // Parse the request body
    const requestData = await request.json();
    
    debugLog('Image deletion request received', {
      hasImageUrl: !!requestData.imageUrl,
      urlPreview: requestData.imageUrl ? requestData.imageUrl.substring(0, 50) + '...' : 'none'
    });
    
    // Check if an image URL was provided
    if (!requestData.imageUrl) {
      debugLog('Missing image URL', { status: 400 });
      return NextResponse.json(
        { success: false, message: "No image URL provided" },
        { status: 400 },
      );
    }

    debugLog('Processing image deletion', {
      imageUrl: requestData.imageUrl.substring(0, 50) + '...',
      backendURL: `${API_URL}/api/images/cloudinary/delete`,
      token: token ? 'present' : 'missing'
    });

    // Forward the request to the backend API
    const response = await fetch(`${API_URL}/api/images/cloudinary/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ imageUrl: requestData.imageUrl }),
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
          message: "Failed to delete image: Server returned an invalid response",
        },
        { status: 500 },
      );
    }

    // Return the appropriate response
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to delete image" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Cloudinary image deletion error:", error);
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
