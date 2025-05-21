/**
 * Cloudinary Image Utilities
 * Functions to optimize and transform Cloudinary images
 */

/**
 * Check if a URL is a Cloudinary URL
 * @param url - Image URL to check
 * @returns boolean indicating if it's a Cloudinary URL
 */
export const isCloudinaryUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('cloudinary.com') && url.includes('/image/upload/');
};

/**
 * Optimize a Cloudinary image URL with specified transformations
 * @param url - Original Cloudinary image URL
 * @param options - Transformation options
 * @returns Optimized Cloudinary URL
 */
export const optimizeCloudinaryImage = (
  url: string, 
  options: {
    width?: number | undefined;
    height?: number | undefined;
    quality?: number | 'auto' | undefined;
    format?: 'auto' | 'webp' | 'jpg' | 'png' | undefined;
    crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'crop' | undefined;
  } = {}
): string => {
  if (!url || !isCloudinaryUrl(url)) {
    return url; // Return original URL if not a Cloudinary URL
  }

  const { 
    width, 
    height, 
    quality = 'auto', 
    format = 'auto', 
    crop = 'fill' 
  } = options;

  // Build transformation string
  const transformations: string[] = [];
  
  // Add dimensions if specified
  if (width || height) {
    if (width && height) {
      transformations.push(`w_${width},h_${height},c_${crop}`);
    } else if (width) {
      transformations.push(`w_${width},c_${crop}`);
    } else if (height) {
      transformations.push(`h_${height},c_${crop}`);
    }
  }
  
  // Add quality and format
  transformations.push(`q_${quality},f_${format}`);
  
  // Build the URL
  const transformationString = transformations.join(',');
  
  // Replace /upload/ with /upload/transformationString/
  return url.replace('/upload/', `/upload/${transformationString}/`);
};

/**
 * Generate a responsive Cloudinary image URL for a specific device size
 * @param url - Original Cloudinary image URL
 * @param deviceSize - 'mobile', 'tablet', or 'desktop'
 * @returns Optimized Cloudinary URL for the specific device size
 */
export const getResponsiveImageUrl = (
  url: string,
  deviceSize: 'mobile' | 'tablet' | 'desktop' = 'desktop'
): string => {
  if (!url || !isCloudinaryUrl(url)) {
    return url;
  }
  
  // Define dimensions based on device size
  switch (deviceSize) {
    case 'mobile':
      return optimizeCloudinaryImage(url, { width: 640, quality: 'auto' });
    case 'tablet':
      return optimizeCloudinaryImage(url, { width: 1024, quality: 'auto' });
    case 'desktop':
    default:
      return optimizeCloudinaryImage(url, { width: 1600, quality: 'auto' });
  }
};

/**
 * Get image dimensions from a Cloudinary URL
 * @param url - Cloudinary image URL
 * @returns An object with width and height if available, null otherwise
 */
export const getCloudinaryImageDimensions = (url: string): { width: number; height: number } | null => {
  if (!url || !isCloudinaryUrl(url)) {
    return null;
  }
  
  try {
    // Extract dimensions from metadata in the URL if available
    const match = url.match(/\/w_(\d+),h_(\d+)/);
    if (match && match[1] && match[2]) {
      return {
        width: parseInt(match[1], 10),
        height: parseInt(match[2], 10)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting dimensions from Cloudinary URL:', error);
    return null;
  }
};

/**
 * Generate srcSet attribute for responsive images
 * @param url - Original Cloudinary image URL
 * @returns srcSet string for use in img or source elements
 */
export const generateSrcSet = (url: string): string => {
  if (!url || !isCloudinaryUrl(url)) {
    return '';
  }
  
  // Reduced number of breakpoints to optimize payload size and improve performance
  // Key breakpoints that cover most device widths without excessive duplication
  const breakpoints = [640, 1024, 1920];
  
  return breakpoints
    .map(width => {
      const optimizedUrl = optimizeCloudinaryImage(url, { width, quality: 'auto' });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
};
