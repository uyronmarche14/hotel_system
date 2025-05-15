import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";

/**
 * Proxy API requests to the backend server for top-rated rooms
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') || '5';
    
    // Construct the URL to the backend API
    const apiUrl = `${API_URL}/api/hotels/rooms/top-rated?limit=${limit}`;
    console.log(`Proxying GET request to: ${apiUrl}`);

    // Forward the request to the backend API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    // Log response for debugging
    console.log(
      `Received response from ${apiUrl} with status: ${response.status}`
    );

    // If the response is not OK, handle it safely
    if (!response.ok) {
      console.error(
        `API responded with status ${response.status}: ${response.statusText}`
      );

      // Get content type to check if it's JSON or HTML
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        // If JSON, just pass through the error response
        try {
          const errorData = await response.json();
          return NextResponse.json(errorData, { status: response.status });
        } catch {
          return NextResponse.json(
            { error: response.statusText || "Unknown error" },
            { status: response.status }
          );
        }
      } else {
        // If not JSON (likely HTML), return a proper JSON error
        const text = await response.text();
        console.error("Error response content:", text.substring(0, 500));

        return NextResponse.json(
          {
            error: "API request failed",
            status: response.status,
            message:
              response.statusText || "The server returned an invalid response",
          },
          { status: response.status }
        );
      }
    }

    // Get the response data
    const data = await response.json();

    // Return the response
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error in top-rated rooms API proxy:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch top-rated rooms from API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
