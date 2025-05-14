import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";
import type { ApiErrorResponse } from "@/app/types/api";

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

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorResponse: ApiErrorResponse = {
      error: "Server error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
