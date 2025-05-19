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
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    // Get room data from request
    const roomData = await request.json();

    // Forward the request to the backend API
    const response = await fetch(`${API_URL}/api/admin/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roomData),
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