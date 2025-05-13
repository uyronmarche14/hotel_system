import { API_URL } from "../lib/constants";

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
  images?: string[];
  roomNumber?: string;
  type?: string;
  isAvailable?: boolean;
  capacity?: number;
}

/**
 * Validate image URLs, defaulting to Cloudinary fallback if not an absolute URL.
 */
const validateImageUrl = (url: string | undefined): string => {
  const cloudinaryFallback = 'https://res.cloudinary.com/ddnxfpziq/image/upload/v1747146600/room-placeholder_mnyxqz.jpg';
  // Check if it's a valid-looking absolute URL (http or https)
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    return url;
  }
  // For any other case (undefined, null, empty, relative path), use the fallback
  return cloudinaryFallback;
};

/**
 * Helper function to map backend room data to frontend format
 */
const mapRoomData = (room: any): RoomType => ({
  id: room.id || room._id,
  title: room.title || '',
  price: room.price || 0,
  location: room.location || '',
  imageUrl: validateImageUrl(room.imageUrl),
  href: room.href || `/hotelRoomDetails/${room.category}/${room.title?.toLowerCase().replace(/\s+/g, '-') || 'room'}`,
  rating: room.rating || 0,
  reviews: room.reviews || 0,
  description: room.description || '',
  category: room.category || 'standard',
  fullDescription: room.fullDescription || '',
  features: room.features || [],
  maxOccupancy: room.maxOccupancy || 2,
  bedType: room.bedType || '',
  roomSize: room.roomSize || '',
  viewType: room.viewType || '',
  additionalAmenities: room.additionalAmenities || [],
  amenities: room.amenities || [],
  images: Array.isArray(room.images) ? room.images.map(validateImageUrl) : [],
  roomNumber: room.roomNumber || '',
  type: room.type || 'standard',
  isAvailable: room.isAvailable !== undefined ? room.isAvailable : true,
  capacity: room.capacity || 1
});

/**
 * Fetches all rooms from the MongoDB database via API
 */
export const getAllRooms = async (): Promise<RoomType[]> => {
  try {
    // Check if API connection is available first
    const isConnected = await checkApiConnection().catch(() => false);
    if (!isConnected) {
      console.log('API connection check failed - returning empty array');
      return [];
    }
    
    // Use the dedicated rooms API route instead of the proxy
    const url = `/api/rooms`;
    console.log('Fetching rooms via API URL:', url);
    
    // Use a timeout promise to detect network issues
    const timeoutPromise = new Promise<Response>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout - API might be unreachable')), 10000);
    });
    
    // Create the actual fetch request
    const fetchPromise = fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 } // Cache for 5 minutes to reduce load on backend
    });
    
    // Race between the timeout and the fetch
    const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status ${response.status} - ${response.statusText}`);
      console.error('Error response body:', errorText.substring(0, 500));
      
      // Return empty array when API fails
      console.log('API request failed - returning empty array');
      return [];
    }

    const data = await response.json();
    console.log('API response received successfully');
    console.log('Received data for', data?.data?.length || 0, 'rooms');
    
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error('API response is not in the expected format');
      return [];
    }
    
    return data.data.map(mapRoomData);
  } catch (error) {
    console.error('Failed to fetch rooms from API:', error);
    return [];
  }
};

/**
 * Fetches a room by ID from the MongoDB database via API
 */
export const getRoomById = async (roomId: string): Promise<RoomType | null> => {
  try {
    // Use the internal Next.js API proxy route
    const response = await fetch(`/api/proxy/hotels/rooms/${roomId}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status ${response.status} - ${response.statusText}`);
      console.error('Error response body:', errorText.substring(0, 500));
      return null;
    }

    const data = await response.json();
    
    if (!data || !data.data) {
      console.error('API response is not in the expected format:', data);
      return null;
    }
    
    return mapRoomData(data.data);
  } catch (error) {
    console.error(`Failed to fetch room ${roomId} from API:`, error);
    return null;
  }
};

/**
 * Fetches top rated rooms from the MongoDB database via API
 */
export const getTopRatedRooms = async (limit = 5): Promise<RoomType[]> => {
  try {
    // Use the internal Next.js API proxy route
    const response = await fetch(`/api/proxy/hotels/rooms/top-rated?limit=${limit}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status ${response.status} - ${response.statusText}`);
      console.error('Error response body:', errorText.substring(0, 500));
      
      // If dedicated endpoint fails, fallback to sorting client-side
      const allRooms = await getAllRooms();
      return [...allRooms]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);
    }

    const data = await response.json();
    
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error('API response is not in the expected format:', data);
      return [];
    }
    
    return data.data.map(mapRoomData);
  } catch (error) {
    console.error('Failed to fetch top rated rooms:', error);
    return [];
  }
};

/**
 * Fetches rooms by category from the MongoDB database via API
 */
export const getRoomsByCategory = async (category: string): Promise<RoomType[]> => {
  try {
    // Use the internal Next.js API proxy route
    const response = await fetch(`/api/proxy/hotels/rooms/category/${category}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status ${response.status} - ${response.statusText}`);
      console.error('Error response body:', errorText.substring(0, 500));
      
      // If dedicated endpoint fails, fallback to filtering client-side
      const allRooms = await getAllRooms();
      return allRooms.filter(room => room.category === category);
    }

    const data = await response.json();
    
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error('API response is not in the expected format:', data);
      return [];
    }
    
    return data.data.map(mapRoomData);
  } catch (error) {
    console.error(`Failed to fetch rooms by category ${category}:`, error);
    return [];
  }
};

/**
 * Fetches one room from each category from the MongoDB database via API
 */
export const getCategoryRooms = async (): Promise<RoomType[]> => {
  try {
    // Use the internal Next.js API proxy route
    const response = await fetch(`/api/proxy/hotels/rooms/categories/samples`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status ${response.status} - ${response.statusText}`);
      console.error('Error response body:', errorText.substring(0, 500));
      
      // If dedicated endpoint fails, get categories manually from all rooms
      const allRooms = await getAllRooms();
      const categories = [...new Set(allRooms.map(room => room.category))];
      return categories.map(category => {
        const roomsInCategory = allRooms.filter(room => room.category === category);
        return roomsInCategory.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
      });
    }

    const data = await response.json();
    
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error('API response is not in the expected format:', data);
      return [];
    }
    
    return data.data.map(mapRoomData);
  } catch (error) {
    console.error('Failed to fetch category rooms:', error);
    return [];
  }
};

/**
 * Search rooms by query from the MongoDB database via API
 */
export const searchRooms = async (query: string): Promise<RoomType[]> => {
  try {
    // Use the internal Next.js API proxy route
    const response = await fetch(`/api/proxy/hotels/rooms/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API search request failed with status ${response.status} - ${response.statusText}`);
      console.error('Error response body:', errorText.substring(0, 500));
      return [];
    }

    const data = await response.json();
    
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error('API response is not in the expected format:', data);
      return [];
    }
    
    return data.data.map(mapRoomData);
  } catch (error) {
    console.error('Failed to search rooms:', error);
    return [];
  }
};

/**
 * Fetches room availability for specific dates
 */
export const checkRoomAvailability = async (
  roomId: string, 
  checkIn: string, 
  checkOut: string
): Promise<boolean> => {
  try {
    // Use the internal Next.js API proxy route
    const response = await fetch(
      `/api/proxy/hotels/rooms/${roomId}/availability?checkIn=${checkIn}&checkOut=${checkOut}`,
      {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API availability check failed with status ${response.status} - ${response.statusText}`);
      console.error('Error response body:', errorText.substring(0, 500));
      return false;
    }

    const data = await response.json();
    return data.available || false;
  } catch (error) {
    console.error('Failed to check room availability:', error);
    return false;
  }
};

/**
 * Checks if the API is connected and accessible
 * @returns {Promise<boolean>} True if API is connected
 */
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/proxy/health', {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error('API health check failed with status:', response.status);
      return false;
    }
    
    const data = await response.json();
    console.log('API health check:', data);
    return data.status === 'ok';
  } catch (error) {
    console.error('API connection check failed:', error);
    return false;
  }
}; 