import { API_URL } from "@/app/lib/constants";
import Cookies from "js-cookie";

// Defining types for our booking data
export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roomType: string;
  roomTitle: string;
  roomCategory: string;
  roomImage: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  specialRequests?: string;
  basePrice: number;
  taxAndFees: number;
  totalPrice: number;
  location?: string;
}

export interface Booking extends BookingFormData {
  _id: string;
  user?: string; // Made optional
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "refunded";
  bookingId: string;
  createdAt: string;
}

// Interface for booking history
export interface BookingHistoryItem {
  id: string;
  bookingId: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalPrice: number;
  createdAt: string;
}

export interface RoomStat {
  roomType: string;
  roomTitle: string;
  count: number;
  totalRevenue: number;
  imageUrl: string;
  bookings: BookingHistoryItem[];
}

export interface BookingHistoryResponse {
  success: boolean;
  stats: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
  };
  roomStats: RoomStat[];
}

// Helper function to format API URLs correctly
const getApiUrl = (endpoint: string) => {
  // Remove any trailing slashes from API_URL
  const baseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;

  // Ensure endpoint starts with a slash
  const formattedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  // Remove duplicate "/api" if it exists in both baseUrl and endpoint
  const cleanEndpoint =
    baseUrl.endsWith("/api") || baseUrl.includes("/api/")
      ? formattedEndpoint.replace(/^\/api/, "")
      : formattedEndpoint;

  // Debug the URL construction
  const fullUrl = `${baseUrl}${cleanEndpoint}`;
  console.log("Constructed API URL:", fullUrl);

  return fullUrl;
};

// API Error handling helper
async function handleResponse(response: Response) {
  const contentType = response.headers.get("content-type");

  // Log the response for debugging
  console.log("Response status:", response.status);
  console.log("Response content type:", contentType);

  // Check if response is JSON before trying to parse it
  if (contentType && contentType.includes("application/json")) {
    try {
      const data = await response.json();

      if (!response.ok) {
        console.error("Error response data:", data);
        throw new Error(
          data.message || `Error ${response.status}: ${response.statusText}`,
        );
      }

      return data;
    } catch (error) {
      console.error("JSON parsing error:", error);
      throw new Error("Failed to parse server response");
    }
  } else {
    // Handle non-JSON responses like HTML error pages
    const text = await response.text();
    console.error("Received non-JSON response:", text);

    // Check if this appears to be an HTML error with a specific message
    const match = text.match(/<pre>([^<]+)<\/pre>/);
    if (match && match[1]) {
      throw new Error(`API Error: ${match[1].trim()}`);
    }

    throw new Error(
      `Unexpected response type: ${contentType || "unknown"} - The API endpoint may be incorrect`,
    );
  }
}

// Function to create a new booking
export const createBooking = async (
  bookingData: BookingFormData,
): Promise<{ success: boolean; data: Booking }> => {
  // Log the booking data being sent
  console.log(
    "Sending booking data to API:",
    JSON.stringify(bookingData, null, 2),
  );

  // Get properly formatted URL
  const bookingUrl = getApiUrl("/api/bookings");

  // Get the token from cookies
  const token = Cookies.get("token");

  if (!token) {
    console.error("No authentication token found");
    throw new Error("Authentication required. Please log in again.");
  }

  // Add timeout to fetch request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

  try {
    console.log("Making POST request to:", bookingUrl);
    console.log("With headers:", {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    });

    const response = await fetch(bookingUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Log the response for debugging
    console.log("Booking API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Booking API error response:", errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const result = await handleResponse(response);
    console.log("Booking API success response:", result);
    return result;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    console.error("Booking creation failed:", error);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "Request timed out. Please check your connection and try again.",
      );
    }

    // Check if the API server is accessible
    try {
      // Use the health endpoint defined in app.js
      const healthUrl = getApiUrl("/health");
      console.log("Checking health at:", healthUrl);

      const pingResponse = await fetch(healthUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      console.log("Health check response:", pingResponse.status);

      if (!pingResponse.ok) {
        throw new Error("API server is unreachable. Please try again later.");
      }
    } catch (pingError) {
      console.error("API server ping failed:", pingError);
      throw new Error("API server is unreachable. Please try again later.");
    }

    throw error;
  }
};

// Function to get all bookings for user by email
export const getUserBookings = async (
  email: string,
): Promise<{ success: boolean; count: number; data: Booking[] }> => {
  // Get the token from cookies
  const token = Cookies.get("token");

  if (!token) {
    console.error("No authentication token found");
    throw new Error("Authentication required. Please log in again.");
  }

  try {
    const url = getApiUrl(`/api/bookings?email=${encodeURIComponent(email)}`);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch user bookings:", error);
    throw error;
  }
};

// Function to get a single booking by ID
export const getBookingById = async (
  bookingId: string,
): Promise<{ success: boolean; data: Booking }> => {
  // Get the token from cookies
  const token = Cookies.get("token");

  if (!token) {
    console.error("No authentication token found");
    throw new Error("Authentication required. Please log in again.");
  }

  try {
    const url = getApiUrl(`/api/bookings/${bookingId}`);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch booking:", error);
    throw error;
  }
};

// Function to cancel a booking
export const cancelBooking = async (
  bookingId: string,
): Promise<{ success: boolean; data: Booking }> => {
  // Get the token from cookies
  const token = Cookies.get("token");

  if (!token) {
    console.error("No authentication token found");
    throw new Error("Authentication required. Please log in again.");
  }

  try {
    const url = getApiUrl(`/api/bookings/${bookingId}/cancel`);
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    throw error;
  }
};

// Function to get booking history with analytics
export const getBookingHistory = async (): Promise<BookingHistoryResponse> => {
  // Get the token from cookies
  const token = Cookies.get("token");

  if (!token) {
    console.error("No authentication token found");
    throw new Error("Authentication required. Please log in again.");
  }

  try {
    const url = getApiUrl("/api/bookings/history");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch booking history:", error);
    throw error;
  }
};

// Function to get booking history for a specific user
export const getUserBookingHistory = async (
  email: string,
): Promise<BookingHistoryResponse> => {
  // Get the token from cookies
  const token = Cookies.get("token");

  if (!token) {
    console.error("No authentication token found");
    throw new Error("Authentication required. Please log in again.");
  }

  try {
    const url = getApiUrl(`/api/bookings/history/${encodeURIComponent(email)}`);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch booking history:", error);
    throw error;
  }
};
