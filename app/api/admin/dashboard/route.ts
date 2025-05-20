import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";

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
    const response = await fetch(`${API_URL}/api/admin/dashboard`, {
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
          message:
            "Failed to fetch dashboard stats: Server returned an invalid response",
        },
        { status: 500 },
      );
    }

    // Return the appropriate response
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch dashboard stats",
        },
        { status: response.status },
      );
    }

    // Ensure we return data in a consistent format that the frontend expects
    // Transform the data if needed
    if (data.success && data.dashboard) {
      // Backend returns { success: true, dashboard: { ... } }
      // Frontend expects either { success: true, data: { ... } } or the raw data
      return NextResponse.json({
        success: true,
        data: {
          totalUsers: data.dashboard.totalUsers || 0,
          totalBookings: data.dashboard.totalBookings || 0,
          activeBookings: data.dashboard.statusCounts?.confirmed || 0,
          totalRooms: data.dashboard.totalRooms || 0,
          recentBookings: data.dashboard.recentBookings?.length || 0,
          totalRevenue: data.dashboard.totalRevenue || 0,
        },
        // Also include the original dashboard data for completeness
        dashboard: data.dashboard
      });
    }
    
    // Just pass through the original response if it's in a different format
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Admin dashboard fetch error:", error);
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