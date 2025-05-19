import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";

/**
 * API route handler for fetching top-rated rooms
 */
export async function GET(request: NextRequest) {
  try {
    // Extract limit query parameter
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') || '5';

    // Construct URL to backend API
    const apiUrl = `${API_URL}/api/rooms/top-rated?limit=${limit}`;
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

      // Client-side fallback: fetch all rooms and sort by rating
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
        let rooms = [];

        // Extract rooms array from response
        if (allRoomsData.rooms && Array.isArray(allRoomsData.rooms)) {
          rooms = allRoomsData.rooms;
        } else if (allRoomsData.data && Array.isArray(allRoomsData.data)) {
          rooms = allRoomsData.data;
        }

        // Sort by rating and take top N
        const topRated = [...rooms]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, parseInt(limit));

        console.log(`Generated ${topRated.length} top-rated rooms client-side`);

        // Provide rooms with a message indicating they're fallback data
        return NextResponse.json({
          success: true,
          fallback: true,
          message: "Using client-side sorted rooms as fallback",
          data: topRated,
        });
      }

      // If all else fails, return an empty array with an error message
      return NextResponse.json({
        success: false,
        data: [],
        message: "Failed to fetch top-rated rooms",
      });
    }

    // Process successful response
    const data = await response.json();
    console.log(`Received ${data?.data?.length || 0} top-rated rooms from API`);

    // Return the data from the backend
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in top-rated rooms API:", error);
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