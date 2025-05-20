/**
 * Image Service
 * Handles all image-related operations and API calls
 */

import { API_URL } from '@/app/lib/constants';
import { optimizeCloudinaryImage, isCloudinaryUrl } from '@/app/utils/cloudinaryImage';
import { getAuthToken } from '@/app/utils/auth-token';

interface UploadImageResponse {
  success: boolean;
  message: string;
  imageUrl?: string;
  imageUrls?: string[];
}

/**
 * Upload a single image to the server
 * @param file - The image file to upload
 * @param endpoint - API endpoint for the upload
 * @param additionalParams - Additional parameters to send with the upload
 * @returns Promise with the upload response
 */
export const uploadImage = async (
  file: File,
  endpoint: string,
  additionalParams: Record<string, string> = {}
): Promise<UploadImageResponse> => {
  // Log upload details for debugging
  console.log('[ImageService] Uploading image:', {
    fileName: file.name,
    fileSize: `${Math.round(file.size / 1024)} KB`,
    endpoint,
    params: additionalParams
  });
  try {
    // Create form data
    const formData = new FormData();
    formData.append('image', file);
    
    // Add any additional parameters
    Object.entries(additionalParams).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Get auth token from centralized utility
    const token = getAuthToken();
    
    console.log('Image upload auth check:', {
      hasToken: !!token,
      tokenLength: token ? token.length : 0
    });
    
    // Make API request
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    // Handle errors
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }
    
    // Parse response
    const data = await response.json();
    
    return {
      success: data.success,
      message: data.message || 'Image uploaded successfully',
      imageUrl: data.imageUrl || data.image_url,
    };
  } catch (error: any) {
    console.error('Image upload error:', error);
    return {
      success: false,
      message: error.message || 'Failed to upload image',
    };
  }
};

/**
 * Upload multiple images to the server
 * @param files - Array of image files to upload
 * @param endpoint - API endpoint for the upload
 * @param additionalParams - Additional parameters to send with the upload
 * @returns Promise with the upload response
 */
export const uploadMultipleImages = async (
  files: File[],
  endpoint: string,
  additionalParams: Record<string, string> = {}
): Promise<UploadImageResponse> => {
  try {
    // Create form data
    const formData = new FormData();
    
    // Add all files
    files.forEach((file, index) => {
      formData.append('images', file);
    });
    
    // Add any additional parameters
    Object.entries(additionalParams).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Get auth token from centralized utility
    const token = getAuthToken();
    
    console.log('Image upload auth check:', {
      hasToken: !!token,
      tokenLength: token ? token.length : 0
    });
    
    // Make API request
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    // Handle errors
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload images');
    }
    
    // Parse response
    const data = await response.json();
    
    return {
      success: data.success,
      message: data.message || 'Images uploaded successfully',
      imageUrls: data.imageUrls || data.images,
    };
  } catch (error: any) {
    console.error('Multiple images upload error:', error);
    return {
      success: false,
      message: error.message || 'Failed to upload images',
    };
  }
};

/**
 * Delete an image from the server
 * @param imageUrl - URL of the image to delete
 * @param endpoint - API endpoint for deletion
 * @returns Promise with the deletion response
 */
export const deleteImage = async (
  imageUrl: string,
  endpoint: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Get auth token from centralized utility
    const token = getAuthToken();
    
    console.log('Image upload auth check:', {
      hasToken: !!token,
      tokenLength: token ? token.length : 0
    });
    
    // Make API request
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });
    
    // Handle errors
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete image');
    }
    
    // Parse response
    const data = await response.json();
    
    return {
      success: data.success,
      message: data.message || 'Image deleted successfully',
    };
  } catch (error: any) {
    console.error('Image deletion error:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete image',
    };
  }
};

/**
 * Get an optimized image URL based on device
 * @param imageUrl - Original image URL
 * @param deviceType - Device type for optimization (mobile, tablet, desktop)
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (
  imageUrl: string | null | undefined,
  deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
): string => {
  if (!imageUrl) return '';
  
  if (!isCloudinaryUrl(imageUrl)) {
    return imageUrl;
  }
  
  // Define dimensions based on device type
  const dimensions = {
    mobile: { width: 640 },
    tablet: { width: 1024 },
    desktop: { width: 1600 },
  };
  
  return optimizeCloudinaryImage(imageUrl, {
    ...dimensions[deviceType],
    quality: 'auto',
    format: 'auto',
  });
};

/**
 * Create a cloudinary image URL with a specific transformation
 * @param publicId - Cloudinary public ID
 * @param transformations - Array of transformation strings
 * @returns Full Cloudinary URL with transformations
 */
export const createCloudinaryUrl = (
  publicId: string,
  transformations: string[] = []
): string => {
  if (!publicId) return '';
  
  // Cloud name should ideally come from environment variables
  // For this implementation, we'll extract it from existing URLs or use a default
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
  
  // Build transformation string
  const transformationString = transformations.length 
    ? transformations.join(',') + '/' 
    : '';
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}${publicId}`;
};
