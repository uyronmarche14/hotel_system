import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    if (!body.username || !body.password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 },
      );
    }

    // Forward the request to the backend API
    const response = await fetch(`${API_URL}/api/auth/admin-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
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
          message: "Login failed: Server returned an invalid response",
        },
        { status: 500 },
      );
    }

    // Return the appropriate response
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Login failed" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Admin login error:", error);
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
