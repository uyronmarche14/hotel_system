import { NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";

/**
 * Proxy API requests to the backend server for room category samples
 */
export async function GET() {
  try {
    // Construct the URL to the backend API
    const apiUrl = `${API_URL}/api/rooms/categories/samples`;
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
    console.log(`Received response with status: ${response.status}`);

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

        // Return a fallback response with empty data
        return NextResponse.json({
          success: true,
          data: [],
          message: "Fallback: No category samples available"
        });
      }
    }

    // Get the response data
    const data = await response.json();
    console.log("Categories API response:", JSON.stringify(data).substring(0, 200));
    
    // Process the response to ensure it's in the expected format
    let roomsArray = [];
    
    if (data && data.rooms && Array.isArray(data.rooms)) {
      roomsArray = data.rooms;
    } else if (data && Array.isArray(data)) {
      roomsArray = data;
    } else if (data && data.data && Array.isArray(data.data)) {
      roomsArray = data.data;
    } else {
      // If no category samples found, generate them client-side
      console.log("No category rooms found in API response, generating client-side");
      
      // Make a request to get all rooms
      const allRoomsResponse = await fetch(`${API_URL}/api/rooms`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        cache: "no-store",
      });
      
      if (allRoomsResponse.ok) {
        const allRoomsData = await allRoomsResponse.json();
        let allRooms = [];
        
        if (allRoomsData.rooms && Array.isArray(allRoomsData.rooms)) {
          allRooms = allRoomsData.rooms;
        } else if (allRoomsData.data && Array.isArray(allRoomsData.data)) {
          allRooms = allRoomsData.data;
        } else if (Array.isArray(allRoomsData)) {
          allRooms = allRoomsData;
        }
        
        // Get unique categories
        const categories = [...new Set(allRooms.map((room: any) => room.category))].filter(Boolean) as string[];
        console.log("Found categories:", categories);
        
        // For each category, get the highest rated room
        roomsArray = categories.map((category) => {
          const roomsInCategory = allRooms.filter((room: any) => room.category === category);
          return roomsInCategory.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))[0];
        }).filter(Boolean); // Filter out any undefined results
      }
    }
    
    // Ensure image URLs are valid
    roomsArray = roomsArray.map((room: any) => {
      const cloudinaryFallback = "https://placehold.co/600x400/png?text=Room+Image";
      
      if (!room.imageUrl || room.imageUrl.includes("room-placeholder") || room.imageUrl.startsWith("/images/")) {
        room.imageUrl = cloudinaryFallback;
      }
      
      if (!room.images || !Array.isArray(room.images) || room.images.length === 0) {
        room.images = [cloudinaryFallback];
      } else {
        room.images = room.images.map((img: any) => {
          if (!img || img.includes("room-placeholder") || img.startsWith("/images/")) {
            return cloudinaryFallback;
          }
          return img;
        });
      }
      
      return room;
    });
    
    // Return the processed response in the expected format
    return NextResponse.json({
      success: true,
      data: roomsArray
    });
  } catch (error) {
    console.error("Error in category samples API proxy:", error);
    return NextResponse.json(
      { 
        success: true,
        data: [],
        message: "Error fetching category samples"
      },
      { status: 200 } // Return 200 with empty data as fallback
    );
  }
}
