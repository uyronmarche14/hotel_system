import { API_URL } from "../lib/constants";

export interface RoomType {
  id: string;
  _id?: string; // Added to support MongoDB/Supabase format inconsistencies
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
 * Validate and fix image URLs with proper fallbacks
 */
const validateImageUrl = (url: string | undefined): string => {
  // Placeholder for missing images
  const imageFallback = "https://placehold.co/600x400/png?text=Room+Image";

  // Handle missing values
  if (!url || url.trim() === '' || url === 'null' || url === 'undefined') {
    return imageFallback;
  }
  
  // Check if URL is a local path that might not exist
  if (url.startsWith('/images/') || url.includes('/rooms/fallback-room')) {
    console.log('Converting local image path to placeholder:', url);
    return imageFallback;
  }
  
  // Handle Supabase storage URLs
  if (url.includes('supabase.co') || url.includes('supabase.in')) {
    // Ensure the URL is properly formatted
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Add https:// if it's missing
      const properUrl = url.startsWith('//') ? `https:${url}` : `https://${url}`;
      console.log('Fixed Supabase URL format:', properUrl);
      return properUrl;
    }
    return url;
  }
  
  // If it's a path to Supabase storage but doesn't include the full domain
  if (url.includes('/storage/v1/object/') || url.includes('/storage/v1/upload/')) {
    // Assuming API_URL might contain the Supabase project URL
    const supabaseBaseUrl = API_URL.includes('supabase') 
      ? API_URL 
      : 'https://your-project.supabase.co';
      
    // If it starts with a slash, remove it for joining
    const cleanPath = url.startsWith('/') ? url.substring(1) : url;
    return `${supabaseBaseUrl}/${cleanPath}`;
  }
  
  // If it's already a Cloudinary URL, return it
  if (url.includes("cloudinary.com")) {
    return url;
  }

  // If it's another absolute URL, return it
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Handle relative URLs that might be referencing public assets
  if (url.startsWith('/images/') || url.startsWith('/assets/')) {
    // These are likely public directory assets
    return url;
  }
  
  // For local file paths that might be from Supabase storage
  if (url.includes('/storage/')) {
    console.log('Found storage path, constructing proper URL:', url);
    // If API_URL points to your backend, construct a proper URL
    return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  // If it's a relative URL but doesn't start with slash, add one for consistency
  if (!url.startsWith("/")) {
    return `/${url}`;
  }

  // Return the URL if none of the above conditions match
  return url;
};

export interface BackendRoom {
  id?: string;
  _id?: string;
  title?: string;
  price?: number;
  location?: string;
  imageUrl?: string; // Frontend expects this
  image_url?: string; // Supabase uses this
  href?: string;
  rating?: number;
  reviews?: number;
  description?: string;
  category?: string;
  fullDescription?: string;
  features?: string[];
  maxOccupancy?: number;
  bedType?: string;
  roomSize?: string;
  viewType?: string;
  additionalAmenities?: string[];
  amenities?: string[];
  images?: string[];
  roomNumber?: string;
  type?: string;
  isAvailable?: boolean;
  capacity?: number;
}

/**
 * Helper function to map backend room data to frontend format
 */
const mapRoomData = (room: BackendRoom): RoomType => {
  // Handle the schema mismatch between Supabase and frontend
  // Supabase uses image_url, frontend expects imageUrl
  const imageUrlToUse = room.imageUrl || room.image_url;
  
  console.log('Original room data image URLs:', { 
    imageUrl: room.imageUrl, 
    image_url: room.image_url 
  });
  
  const category = room.category || "standard";
  const titleSlug = (room.title || "").toLowerCase().replace(/ /g, "-");

  // Ensure href is properly formatted for navigation
  const href = room.href || `/hotelRoomDetails/${category}/${titleSlug}`;

  // Ensure we always have a valid ID for the room
  const roomId = room.id || room._id || `room-${Date.now()}`;
  
  return {
    id: roomId as string, // Force type assertion to handle TypeScript error
    _id: room._id,
    title: room.title || "",
    price: room.price || 0,
    location: room.location || "",
    imageUrl: validateImageUrl(imageUrlToUse),
    href: href,
    rating: room.rating || 0,
    reviews: room.reviews || 0,
    description: room.description || "",
    category: room.category || "standard",
    fullDescription: room.fullDescription || "",
    features: room.features || [],
    maxOccupancy: room.maxOccupancy || 2,
    bedType: room.bedType || "",
    roomSize: room.roomSize || "",
    viewType: room.viewType || "",
    additionalAmenities: room.additionalAmenities || [],
    amenities: room.amenities || [],
    images: Array.isArray(room.images) ? room.images.map(validateImageUrl) : [],
    roomNumber: room.roomNumber || "",
    type: room.type || "standard",
    isAvailable: room.isAvailable !== undefined ? room.isAvailable : true,
    capacity: room.capacity || 1,
  };
};

/**
 * Fetches all rooms from the MongoDB database via API
 */
export const getAllRooms = async (): Promise<RoomType[]> => {
  try {
    // Check if API connection is available first
    const isConnected = await checkApiConnection().catch(() => false);
    if (!isConnected) {
      console.log("API connection check failed - returning empty array");
      return [];
    }

    // Use the dedicated rooms API route instead of the proxy
    const url = `/api/rooms`;
    console.log("Fetching rooms via API URL:", url);

    // Use a timeout promise to detect network issues
    const timeoutPromise = new Promise<Response>((_, reject) => {
      setTimeout(
        () => reject(new Error("Request timeout - API might be unreachable")),
        10000,
      );
    });

    // Create the actual fetch request
    const fetchPromise = fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // Add a cache-busting parameter to prevent caching
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
      // Removed revalidation to ensure we always get fresh data
    });

    // Race between the timeout and the fetch
    const response = (await Promise.race([
      fetchPromise,
      timeoutPromise,
    ])) as Response;

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API request failed with status ${response.status} - ${response.statusText}`,
      );
      console.error("Error response body:", errorText.substring(0, 500));

      // Return empty array when API fails
      console.log("API request failed - returning empty array");
      return [];
    }

    const data = await response.json();
    console.log("API response received successfully");
    
    // Support different response formats:
    // 1. { data: [...rooms] }
    // 2. { rooms: [...rooms] }
    // 3. Just [...rooms] array directly
    
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
    
    console.log("Processing", roomsArray.length, "rooms");
    
    // Log if no rooms are returned from API
    if (roomsArray.length === 0) {
      console.log("No rooms returned from API - this might indicate a database issue");
      // Return empty array instead of fallback data
      // This will ensure the UI shows no rooms when there are none in the database
    }
    
    return roomsArray.map(mapRoomData);
  } catch (error) {
    console.error("Failed to fetch rooms from API:", error);
    return [];
  }
};

/**
 * Fetches a single room by ID from the MongoDB database via API
 */
// Simple in-memory cache for room details
const roomCache = new Map<string, { data: RoomType, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches a single room by ID from the MongoDB database via API
 * Optimized to strictly use ID lookup and avoid fetching all rooms
 */
export const getRoomById = async (id: string): Promise<RoomType | null> => {
  try {
    if (!id) return null;
    
    // Check cache first
    const cached = roomCache.get(id);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      console.log(`Returning cached room data for ID: ${id}`);
      return cached.data;
    }

    console.log(`Fetching room by ID directly: ${id}`);

    // UUID regex check to determine strategy
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    // If it's a slug, we might need to search or use fallback
    // But commonly, bookings should use UUID.
    // If it's NOT a UUID, it might be a slug.
    
    let roomData: BackendRoom | null = null;
    
    if (isUUID) {
      // Direct API call for UUID
      const response = await fetch(`/api/rooms/${id}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && (data.data || data.room)) {
           roomData = data.data || data.room;
        }
      } else {
        console.warn(`Direct fetch for room ${id} failed: ${response.status}`);
      }
    }

    // Fallback: If not found via ID (or if it was a slug), try getAllRooms 
    // This maintains backward compatibility for slug-based access but is slower.
    if (!roomData) {
        console.log(`Room ${id} not found via direct ID fetch (or is slug), falling back to search`);
        const allRooms = await getAllRooms();
        // Match by ID or Slug or Title
        const found = allRooms.find(r => 
           r.id === id || 
           r._id === id || 
           r.title.toLowerCase().replace(/ /g, "-") === id ||
           r.category === id // Edge case
        );
        
        if (found) {
            // Cache the result
            roomCache.set(id, { data: found, timestamp: Date.now() });
            return found;
        }
        return null;
    }

    // Map and Cache direct result
    const mappedRoom = mapRoomData(roomData);
    
    // Ensure image URL is valid
    if (!mappedRoom.imageUrl || mappedRoom.imageUrl.includes('/images/rooms/')) {
       mappedRoom.imageUrl = validateImageUrl(mappedRoom.imageUrl);
    }
    
    roomCache.set(id, { data: mappedRoom, timestamp: Date.now() });
    
    return mappedRoom;
  } catch (error) {
    console.error(`Failed to fetch room by ID ${id}:`, error);
    return null;
  }
};


/**
 * Fetches rooms sorted by lowest price first (previously top rated)
 */
export const getTopRatedRooms = async (limit = 5): Promise<RoomType[]> => {
  try {
    console.log(`Fetching top rated rooms with limit: ${limit}`);
    // First try direct API route
    const response = await fetch(
      `/api/rooms/top-rated?limit=${limit}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API request failed with status ${response.status} - ${response.statusText}`,
      );
      console.error("Error response body:", errorText.substring(0, 500));

      // If dedicated endpoint fails, fallback to sorting client-side
      console.log("Falling back to client-side sorting for top rated rooms");
      const allRooms = await getAllRooms();
      return [...allRooms]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);
    }

    const data = await response.json();
    console.log(`Received top rated rooms data: ${data?.data?.length || 0} items`);

    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error("API response is not in the expected format:", data);
      return [];
    }

    // Map room data and sort by price (lowest first)
    const mappedRooms = data.data.map(mapRoomData)
      .sort((a: RoomType, b: RoomType) => (a.price || 0) - (b.price || 0))
      .slice(0, limit);
    
    if (mappedRooms.length > 0) {
      console.log('First budget-friendly room:', { 
        title: mappedRooms[0].title,
        price: mappedRooms[0].price,
        imageUrl: mappedRooms[0].imageUrl 
      });
    }
    
    return mappedRooms;
  } catch (error) {
    console.error("Failed to fetch top rated rooms:", error);
    return [];
  }
};

/**
 * Fetches rooms by category from the MongoDB database via API
 */
export const getRoomsByCategory = async (
  category: string,
): Promise<RoomType[]> => {
  try {
    // Use the internal Next.js API proxy route
    const response = await fetch(
      `/api/rooms/category/${category}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API request failed with status ${response.status} - ${response.statusText}`,
      );
      console.error("Error response body:", errorText.substring(0, 500));

      // If dedicated endpoint fails, fallback to filtering client-side
      const allRooms = await getAllRooms();
      return allRooms.filter((room) => room.category === category);
    }

    const data = await response.json();

    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error("API response is not in the expected format:", data);
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
    console.log('Fetching category rooms samples');
    // Use the internal Next.js API proxy route
    const response = await fetch(`/api/rooms/categories/samples`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API request failed with status ${response.status} - ${response.statusText}`,
      );
      console.error("Error response body:", errorText.substring(0, 500));

      // If dedicated endpoint fails, get categories manually from all rooms
      console.log('Falling back to client-side category extraction');
      const allRooms = await getAllRooms();
      const categories = [...new Set(allRooms.map((room) => room.category))];
      console.log(`Found ${categories.length} unique categories`);
      
      const categoryRooms = categories.map((category) => {
        const roomsInCategory = allRooms.filter(
          (room) => room.category === category,
        );
        return roomsInCategory.sort(
          (a, b) => (b.rating || 0) - (a.rating || 0),
        )[0];
      });
      
      // Log the first category room for debugging
      if (categoryRooms.length > 0) {
        console.log('First category room:', { 
          title: categoryRooms[0].title,
          category: categoryRooms[0].category,
          imageUrl: categoryRooms[0].imageUrl 
        });
      }
      
      return categoryRooms;
    }

    const data = await response.json();
    console.log(`Received category rooms data: ${data?.data?.length || 0} items`);

    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error("API response is not in the expected format:", data);
      return [];
    }

    // Map and process the room data
    const mappedRooms = data.data.map((room: BackendRoom) => {
      // Ensure image URLs are correctly processed
      const mappedRoom = mapRoomData(room);
      console.log(`Processed category room: ${mappedRoom.title}, Image URL: ${mappedRoom.imageUrl}`);
      return mappedRoom;
    });
    
    return mappedRooms;
  } catch (error) {
    console.error("Failed to fetch category rooms:", error);
    return [];
  }
};

/**
 * Search rooms by query from the MongoDB database via API
 */
export const searchRooms = async (query: string): Promise<RoomType[]> => {
  try {
    // Use the internal Next.js API proxy route
    const response = await fetch(
      `/api/rooms/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API search request failed with status ${response.status} - ${response.statusText}`,
      );
      console.error("Error response body:", errorText.substring(0, 500));
      return [];
    }

    const data = await response.json();

    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error("API response is not in the expected format:", data);
      return [];
    }

    return data.data.map(mapRoomData);
  } catch (error) {
    console.error("Failed to search rooms:", error);
    return [];
  }
};

/**
 * Fetches room availability for specific dates
 */
export const checkRoomAvailability = async (
  roomId: string,
  checkIn: string,
  checkOut: string,
): Promise<boolean> => {
  try {
    // Use the internal Next.js API proxy route
    const response = await fetch(
      `/api/rooms/${roomId}/availability?checkIn=${checkIn}&checkOut=${checkOut}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API availability check failed with status ${response.status} - ${response.statusText}`,
      );
      console.error("Error response body:", errorText.substring(0, 500));
      return false;
    }

    const data = await response.json();
    return data.available || false;
  } catch (error) {
    console.error("Failed to check room availability:", error);
    return false;
  }
};

// The getFallbackRooms function has been removed to ensure direct database connectivity
// All room data will now come directly from the Supabase backend

/**
 * Checks if the API is connected and accessible
 * @returns {Promise<boolean>} True if API is connected
 */
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/proxy/health", {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("API health check failed with status:", response.status);
      return false;
    }

    const data = await response.json();
    console.log("API health check:", data);
    return data.status === "ok";
  } catch (error) {
    console.error("API connection check failed:", error);
    return false;
  }
};
