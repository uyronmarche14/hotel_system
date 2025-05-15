import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Set up endpoint to handle room image uploads
export async function POST(req: NextRequest) {
  try {
    // Extract the token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Create a FormData instance to send to the backend
    const formData = await req.formData();
    
    // Forward the request to our backend API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/rooms/upload-image`;
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      // Omit Content-Type to let the browser set it with appropriate boundary for FormData
    });

    const data = await response.json();

    // Return the response from the backend
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in upload-image API route:", error);
    return NextResponse.json(
      { success: false, message: "Error uploading image" },
      { status: 500 }
    );
  }
}
