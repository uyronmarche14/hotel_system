import { NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";

interface Room {
  imageUrl?: string;
  images?: string[];
  [key: string]: unknown;
}

/**
 * Proxy handler for fetching rooms from the backend API
 */
export async function GET() {
  try {
    // Construct the URL to the backend API
    const url = `${API_URL}/api/hotels/rooms`;
    console.log(`Proxying GET request to: ${url}`);

    // Forward the request to the backend API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    // Log response for debugging
    console.log(
      `Received response from ${url} with status: ${response.status}`,
    );

    // If the response is not OK, handle it safely
    if (!response.ok) {
      console.error(
        `API responded with status ${response.status}: ${response.statusText}`,
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
            { status: response.status },
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
          { status: response.status },
        );
      }
    }

    // Get the response data
    const data = await response.json();

    // Process the data to ensure proper image URLs
    if (data && data.data && Array.isArray(data.data)) {
      data.data = data.data.map((room: Room) => {
        // Set Cloudinary fallback for image URLs
        const cloudinaryFallback =
          "https://res.cloudinary.com/ddnxfpziq/image/upload/v1747146600/room-placeholder_mnyxqz.jpg";

        // If no imageUrl or using local placeholder, replace with Cloudinary
        if (
          !room.imageUrl ||
          room.imageUrl.includes("room-placeholder") ||
          room.imageUrl.startsWith("/images/")
        ) {
          room.imageUrl = cloudinaryFallback;
        }

        // Process any images array
        if (room.images && Array.isArray(room.images)) {
          room.images =
            room.images.length > 0
              ? room.images.map((img: string) =>
                  img.includes("cloudinary.com") ? img : cloudinaryFallback,
                )
              : [cloudinaryFallback];
        } else {
          room.images = [cloudinaryFallback];
        }

        return room;
      });
    }

    // Return the processed response
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error in API proxy:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch data from API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
