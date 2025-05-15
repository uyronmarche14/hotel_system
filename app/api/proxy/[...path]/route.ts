import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/lib/constants";

/**
 * Proxy API requests to the backend server
 * This helps avoid CORS issues by having requests come from the same origin
 */
export async function GET(request: NextRequest) {
  try {
    // Extract path from URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    // Remove 'api' and 'proxy' from the path segments
    const path = pathSegments.slice(2).join('/');

    // Construct the URL to the backend API - note we're using the path directly without adding '/api'
    // because it's already part of our API_URL structure
    const apiUrl = `${API_URL}/api/${path}${request.nextUrl.search || ""}`;
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

    // Return the response
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

export async function POST(request: NextRequest) {
  try {
    // Extract path from URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    // Remove 'api' and 'proxy' from the path segments
    const path = pathSegments.slice(2).join('/');

    // Get the request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // Construct the URL to the backend API
    const apiUrl = `${API_URL}/api/${path}${request.nextUrl.search || ""}`;
    console.log(`Proxying POST request to: ${apiUrl}`);

    // Forward the request to the backend API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
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

    // Get the response data - safely handle potential non-JSON responses
    let data;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error(
        "Unexpected non-JSON response:",
        text.substring(0, 200) + "...",
      );
      return NextResponse.json(
        {
          error: "Server returned non-JSON response",
          message: "The API returned an unexpected response format",
        },
        { status: 500 },
      );
    }

    // Return the response
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error in API proxy:", error);
    return NextResponse.json(
      {
        error: "Failed to send data to API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
