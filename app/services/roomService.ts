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
 * Helper function to map backend room data to frontend format
 */
const mapRoomData = (room: any): RoomType => ({
  id: room.id || room._id,
  title: room.title || '',
  price: room.price || 0,
  location: room.location || '',
  imageUrl: room.imageUrl || '/images/room-placeholder.jpg',
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
  images: room.images || [],
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
    });
    
    // Race between the timeout and the fetch
    const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status ${response.status} - ${response.statusText}`);
      console.error('Error response body:', errorText.substring(0, 500));
      
      // Try fetching static data as a fallback
      console.log('Attempting to load static fallback data...');
      return getFallbackRooms();
    }

    const data = await response.json();
    console.log('API response received successfully:', data);
    console.log('Received data for', data?.data?.length || 0, 'rooms');
    
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error('API response is not in the expected format:', data);
      return getFallbackRooms();
    }
    
    return data.data.map(mapRoomData);
  } catch (error) {
    console.error('Failed to fetch rooms from API:', error);
    // Return static fallback data if API is unreachable
    return getFallbackRooms();
  }
};

// Fallback room data for when API is unreachable
const getFallbackRooms = (): RoomType[] => {
  console.log('Using fallback room data');
  return [
    {
      id: 'fallback-1',
      title: 'Standard Room',
      price: 3000,
      location: 'Taguig, Metro Manila',
      imageUrl: '/images/room-placeholder.jpg',
      href: '/hotelRoomDetails/standard-room/standard-room',
      rating: 4.2,
      reviews: 24,
      description: 'Comfortable standard room with all basic amenities',
      category: 'standard-room',
      maxOccupancy: 2,
      bedType: 'Queen',
      roomSize: '24 sq m',
      viewType: 'City view',
      amenities: ['Free WiFi', 'TV', 'Air conditioning']
    },
    {
      id: 'fallback-2',
      title: 'Deluxe Room',
      price: 5000,
      location: 'Taguig, Metro Manila',
      imageUrl: '/images/room-placeholder.jpg',
      href: '/hotelRoomDetails/deluxe-room/deluxe-room',
      rating: 4.5,
      reviews: 36,
      description: 'Spacious deluxe room with premium amenities',
      category: 'deluxe-room',
      maxOccupancy: 3,
      bedType: 'King',
      roomSize: '32 sq m',
      viewType: 'Garden view',
      amenities: ['Free WiFi', 'LED TV', 'Air conditioning', 'Mini bar']
    },
    {
      id: 'fallback-3',
      title: 'Executive Suite',
      price: 8000,
      location: 'Taguig, Metro Manila',
      imageUrl: '/images/room-placeholder.jpg',
      href: '/hotelRoomDetails/executive-suite/executive-suite',
      rating: 4.8,
      reviews: 18,
      description: 'Elegant executive suite with separate living area',
      category: 'executive-suite',
      maxOccupancy: 2,
      bedType: 'King',
      roomSize: '48 sq m',
      viewType: 'City skyline',
      amenities: ['Free WiFi', 'Smart TV', 'Air conditioning', 'Mini bar', 'Coffee machine']
    },
    {
      id: 'fallback-4',
      title: 'Presidential Suite',
      price: 15000,
      location: 'Taguig, Metro Manila',
      imageUrl: '/images/room-placeholder.jpg',
      href: '/hotelRoomDetails/presidential-suite/presidential-suite',
      rating: 5.0,
      reviews: 12,
      description: 'Luxurious presidential suite with panoramic views',
      category: 'presidential-suite',
      maxOccupancy: 4,
      bedType: 'King',
      roomSize: '80 sq m',
      viewType: 'Panoramic city view',
      amenities: ['Free WiFi', 'Smart TV', 'Air conditioning', 'Mini bar', 'Coffee machine', 'Jacuzzi']
    },
    {
      id: 'fallback-5',
      title: 'Honeymoon Suite',
      price: 12000,
      location: 'Taguig, Metro Manila',
      imageUrl: '/images/room-placeholder.jpg',
      href: '/hotelRoomDetails/honeymoon-suite/honeymoon-suite',
      rating: 4.9,
      reviews: 15,
      description: 'Romantic honeymoon suite with spa bath',
      category: 'honeymoon-suite',
      maxOccupancy: 2,
      bedType: 'King',
      roomSize: '60 sq m',
      viewType: 'Garden view',
      amenities: ['Free WiFi', 'Smart TV', 'Air conditioning', 'Mini bar', 'Spa bath']
    },
    {
      id: 'fallback-6',
      title: 'Family Room',
      price: 7000,
      location: 'Taguig, Metro Manila',
      imageUrl: '/images/room-placeholder.jpg',
      href: '/hotelRoomDetails/family-room/family-room',
      rating: 4.6,
      reviews: 28,
      description: 'Spacious family room with multiple beds',
      category: 'family-room',
      maxOccupancy: 5,
      bedType: 'Various',
      roomSize: '55 sq m',
      viewType: 'Pool view',
      amenities: ['Free WiFi', 'LED TV', 'Air conditioning', 'Mini fridge']
    }
  ];
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