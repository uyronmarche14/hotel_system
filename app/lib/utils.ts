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
  // If URL is empty or undefined, return appropriate fallback
  if (!url) {
    if (fallbackUrl) return fallbackUrl;
    
    // Return appropriate default based on image type
    switch (type) {
      case 'profile':
        return '/images/default-user.png';
      case 'room':
        return '/images/room-placeholder.jpg';
      default:
        return '/images/hotel-logo.png';
    }
  }
  
  // If URL is already a relative path (local image), use it
  if (url.startsWith('/')) return url;
  
  // For external URLs, we return the URL but components should use onError for fallback
  return url;
}
