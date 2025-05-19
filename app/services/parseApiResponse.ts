/**
 * Helper functions for parsing API responses in various formats
 */

import { BackendRoom } from "./roomService";

/**
 * Extract rooms array from different API response formats
 * Supports multiple response structures:
 * 1. { data: [...rooms] }
 * 2. { rooms: [...rooms] }
 * 3. [...rooms] (direct array)
 * 4. { success: true, rooms: [...rooms] }
 */
export function extractRoomsFromResponse(data: any): BackendRoom[] {
  if (!data) {
    console.error("API response is null or undefined");
    return [];
  }

  // Log the raw response for debugging
  console.log("Parsing API response:", JSON.stringify(data).substring(0, 200) + "...");

  let roomsArray: BackendRoom[] = [];
  
  if (data.data && Array.isArray(data.data)) {
    console.log("Found rooms in data.data format:", data.data.length);
    roomsArray = data.data;
  } else if (data.rooms && Array.isArray(data.rooms)) {
    console.log("Found rooms in data.rooms format:", data.rooms.length);
    roomsArray = data.rooms;
  } else if (Array.isArray(data)) {
    console.log("Found rooms in direct array format:", data.length);
    roomsArray = data;
  } else if (data.success && Array.isArray(data.rooms)) {
    // Format: { success: true, rooms: [] }
    console.log("Found rooms in success.rooms format:", data.rooms.length);
    roomsArray = data.rooms;
  } else {
    console.error("API response is not in any expected format:", data);
    return [];
  }
  
  // Filter out any null/undefined items
  return roomsArray.filter(Boolean);
}

/**
 * Generate client-side top rated rooms by sorting all rooms by rating
 */
export function generateTopRatedRooms(allRooms: any[], limit = 5): any[] {
  if (!allRooms || !Array.isArray(allRooms) || allRooms.length === 0) {
    console.log("No rooms available to generate top rated rooms");
    return [];
  }

  // Sort by rating descending and take the first 'limit' items
  return [...allRooms]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
}

/**
 * Generate client-side category sample rooms by taking highest rated from each category
 */
export function generateCategorySamples(allRooms: any[]): any[] {
  if (!allRooms || !Array.isArray(allRooms) || allRooms.length === 0) {
    console.log("No rooms available to generate category samples");
    return [];
  }

  // Get unique categories
  const categories = [...new Set(allRooms.map(room => room.category))];
  console.log("Found categories:", categories);

  // For each category, get the highest rated room
  return categories.map(category => {
    const roomsInCategory = allRooms.filter(room => room.category === category);
    return roomsInCategory.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  }).filter(Boolean); // Filter out any undefined results
}
