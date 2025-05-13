import { API_URL } from "../lib/constants";
import { rooms as staticRooms } from "../data/rooms";

export interface RoomType {
  id?: string;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  href: string;
  rating?: number;
  reviews?: number;
  description?: string;
  size?: string;
  amenities?: string[];
  category: string;
  fullDescription?: string;
  features?: string[];
  maxOccupancy?: number;
  bedType?: string;
  roomSize?: string;
  viewType?: string;
  additionalAmenities?: string[];
}

/**
 * Fetches all rooms from the API with fallback to static data
 */
export const getAllRooms = async (): Promise<RoomType[]> => {
  try {
    // First try the API endpoint
    const response = await fetch(`${API_URL}/api/hotels/rooms`, {
      method: 'GET',
      cache: 'no-store'
    });

    if (!response.ok) {
      console.warn(`API request failed with status ${response.status}, using static data instead`);
      // Fall back to static data if API fails
      return staticRooms;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch rooms from API, using static data instead:', error);
    // Fall back to static data on any error
    return staticRooms;
  }
};

/**
 * Fetches room by ID from the API with fallback to static data
 */
export const getRoomById = async (roomId: string): Promise<RoomType | null> => {
  try {
    const response = await fetch(`${API_URL}/api/hotels/rooms/${roomId}`, {
      method: 'GET',
      cache: 'no-store'
    });

    if (!response.ok) {
      console.warn(`API request failed with status ${response.status}, using static data instead`);
      // Fall back to static data if API fails
      // Use title or href for matching in static data since it doesn't have id
      return staticRooms.find(room => room.href.includes(roomId) || room.title.toLowerCase().includes(roomId.toLowerCase())) || null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Failed to fetch room ${roomId} from API, using static data instead:`, error);
    // Fall back to static data on any error
    // Use title or href for matching in static data since it doesn't have id
    return staticRooms.find(room => room.href.includes(roomId) || room.title.toLowerCase().includes(roomId.toLowerCase())) || null;
  }
};

/**
 * Fetches top rated rooms from the API
 */
export const getTopRatedRooms = async (limit = 5): Promise<RoomType[]> => {
  try {
    const allRooms = await getAllRooms();
    return [...allRooms]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch top rated rooms:', error);
    // Fallback to static top rated rooms
    return staticRooms
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }
};

/**
 * Fetches rooms by category from the API
 */
export const getRoomsByCategory = async (category: string): Promise<RoomType[]> => {
  try {
    const allRooms = await getAllRooms();
    return allRooms.filter(room => room.category === category);
  } catch (error) {
    console.error(`Failed to fetch rooms by category ${category}:`, error);
    // Fallback to static category rooms
    return staticRooms.filter(room => room.category === category);
  }
};

/**
 * Fetches one room from each category from the API
 */
export const getCategoryRooms = async (): Promise<RoomType[]> => {
  try {
    const allRooms = await getAllRooms();
    const categories = [...new Set(allRooms.map(room => room.category))];
    
    return categories.map(category => {
      const roomsInCategory = allRooms.filter(room => room.category === category);
      return roomsInCategory.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
    });
  } catch (error) {
    console.error('Failed to fetch category rooms:', error);
    // Fallback to static category rooms
    const categories = [...new Set(staticRooms.map(room => room.category))];
    return categories.map(category => {
      const roomsInCategory = staticRooms.filter(room => room.category === category);
      return roomsInCategory.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
    });
  }
}; 