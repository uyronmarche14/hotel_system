import { NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";

/**
 * Health check for the proxy API
 * Used to verify that the proxy can connect to the backend API
 */
export async function GET() {
  try {
    // Try connecting to the backend health endpoint
    const response = await fetch(`${API_URL}/health`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    // Log all details for debugging
    console.log(`Backend health check status: ${response.status}`);

    if (!response.ok) {
      const text = await response.text();
      console.error("Health check failed:", text.substring(0, 500));
      return NextResponse.json(
        {
          status: "error",
          message: "Backend API is not responding correctly",
          backend_status: response.status,
          backend_url: API_URL,
        },
        { status: 500 },
      );
    }

    // Get the response data
    let data;
    try {
      data = await response.json();
    } catch {
      const text = await response.text();
      console.error(
        "Failed to parse backend response:",
        text.substring(0, 500),
      );
      data = { text: text.substring(0, 500) };
    }

    // Return a successful health check
    return NextResponse.json({
      status: "ok",
      message: "Proxy API is connected to backend",
      backend_url: API_URL,
      backend_status: response.status,
      backend_data: data,
    });
  } catch (error: unknown) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to backend API",
        error: error instanceof Error ? error.message : "Unknown error",
        backend_url: API_URL,
      },
      { status: 500 },
    );
  }
}
