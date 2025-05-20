import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";
import type { ApiError } from "@/app/types/api";

// Debug helper
const debugLog = (message: string, data: any) => {
  console.log(`[API:room-image] ${message}:`, data);
};

/**
 * Handle POST request for uploading a main room image
 * 
 * @param request The NextRequest instance
 */
export async function POST(request: NextRequest) {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    // Since the path is /api/admin/rooms/[id]/image, the ID should be pathParts[4]
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
    
    // Check if an image was provided
    if (!formData.has('image')) {
      return NextResponse.json(
        { success: false, message: "No image provided" },
        { status: 400 },
      );
    }
    
    // Create a new FormData to forward to the backend
    const backendFormData = new FormData();
    
    // Copy all entries from the original form data
    for (const [key, value] of formData.entries()) {
      backendFormData.append(key, value);
    }
    
    debugLog('Uploading main image', {
      roomId: id,
      formDataKeys: Array.from(formData.keys()),
      hasImage: formData.has('image'),
      setAsMain: formData.get('setAsMain') === 'true'
    });

    // Forward the request to the backend API
    debugLog('Forwarding to backend', {
      endpoint: `${API_URL}/api/admin/rooms/${id}/image`,
      method: 'POST',
      authHeader: token ? `Bearer ${token.substring(0, 10)}...` : 'missing'
    });
    
    const response = await fetch(`${API_URL}/api/admin/rooms/${id}/image`, {
      method: "POST",
      headers: {
        // Don't set Content-Type for FormData, it will be set automatically
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });
    
    debugLog('Backend response received', {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    // Parse the response as text first to help with debugging
    const responseText = await response.text();
    debugLog('Response text received', {
      length: responseText.length,
      preview: responseText.substring(0, 100) + (responseText.length > 100 ? '...' : '')
    });

    let data;
    try {
      // Try to parse the response as JSON
      data = JSON.parse(responseText);
      debugLog('Parsed response JSON', data);
      
      // Check for specific image-related fields
      if (data.imageUrl || data.image_url) {
        debugLog('Image URL found in response', {
          imageUrl: data.imageUrl ? data.imageUrl.substring(0, 50) + '...' : 'not present',
          image_url: data.image_url ? data.image_url.substring(0, 50) + '...' : 'not present'
        });
      } else {
        debugLog('No image URL found in response', {
          keys: Object.keys(data)
        });
      }
    } catch (error) {
      debugLog('Failed to parse response as JSON', {
        error: error instanceof Error ? error.message : String(error),
        responsePreview: responseText.substring(0, 500),
      });
      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload image: Server returned an invalid response",
        },
        { status: 500 },
      );
    }

    // Return the appropriate response
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to upload image" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Room image upload error:", error);
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
