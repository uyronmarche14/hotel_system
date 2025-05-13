import clsx from 'clsx';
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple className strings and resolves Tailwind CSS conflicts
 * Example: cn('px-2 py-1', condition && 'bg-blue-500', 'px-4')
 * Will properly merge the classes and the last px-4 will override px-2
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely returns an image URL with fallback handling
 * @param url - The original image URL to use
 * @param fallbackUrl - Optional custom fallback URL (defaults to generic profile image)
 * @param type - Type of image for appropriate default fallback selection
 * @returns A valid image URL string
 */
export function getSafeImageUrl(
  url?: string, 
  fallbackUrl?: string, 
  type: 'profile' | 'room' | 'general' = 'general'
): string {
  // Get default fallback based on image type
  const getDefaultFallback = () => {
    switch (type) {
      case 'profile':
        return '/images/default-user.png';
      case 'room':
        return '/images/room-placeholder.jpg';
      default:
        return '/images/hotel-logo.png';
    }
  };

  // If URL is empty or undefined, return appropriate fallback
  if (!url) {
    return fallbackUrl || getDefaultFallback();
  }
  
  // If URL is already a relative path (local image), use it
  if (url.startsWith('/')) {
    return url;
  }
  
  // Check if the URL is a Cloudinary URL (potential 404 issues)
  if (url.includes('cloudinary.com')) {
    // Use local fallbacks for specific known problematic images
    if (url.includes('default-profile_vkjogl.jpg')) {
      console.warn('Detected problematic Cloudinary default profile image, using local fallback');
      return '/images/default-user.png';
    }
  }
  
  // Return the original URL but components should use onError for fallback
  return url;
}
