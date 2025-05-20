/**
 * Room Image Manager Component
 * A component for managing room images using Cloudinary
 */

'use client';

import React, { useState, useEffect } from 'react';
import { API_URL } from '@/app/lib/constants';
import { uploadImage, uploadMultipleImages } from '@/app/services/imageService';
import { getAuthToken } from '@/app/utils/auth-token';
import { FaImage } from 'react-icons/fa';
import ImageUploader from '../shared/ImageUploader';
import ImageGallery from '../shared/ImageGallery';
import OptimizedImage from '../shared/OptimizedImage';

// Debug helper
const debugLog = (message: string, data: any) => {
  console.log(`[RoomImageManager] ${message}:`, data);
};

interface RoomImageManagerProps {
  roomId: string;
  initialMainImage?: string;
  initialImages?: string[];
  onUpdate?: (mainImage: string, images: string[]) => void;
}

const RoomImageManager: React.FC<RoomImageManagerProps> = ({
  roomId,
  initialMainImage = '',
  initialImages = [],
  onUpdate
}) => {
  const [mainImage, setMainImage] = useState<string>(initialMainImage);
  const [additionalImages, setAdditionalImages] = useState<string[]>(initialImages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Format images array excluding the main image
  const formattedAdditionalImages = additionalImages.filter(img => img !== mainImage);

  // Upload main image
  const handleMainImageUpload = async (imageUrl: string) => {
    setMainImage(imageUrl);
    setSuccess('Main image uploaded successfully');
    
    // Update room in database with new main image
    await updateRoomImages(imageUrl, additionalImages);
    
    // Notify parent component
    if (onUpdate) {
      onUpdate(imageUrl, additionalImages);
    }
  };

  // Upload additional images
  const handleAdditionalImagesUpload = async (imageUrls: string[]) => {
    if (!imageUrls || imageUrls.length === 0) return;
    
    const newImages = [...additionalImages, ...imageUrls];
    setAdditionalImages(newImages);
    setSuccess(`${imageUrls.length} additional images uploaded successfully`);
    
    // Update room in database with new images array
    await updateRoomImages(mainImage, newImages);
    
    // Notify parent component
    if (onUpdate) {
      onUpdate(mainImage, newImages);
    }
  };

  // Set an image as main image
  const setAsMainImage = async (imageUrl: string) => {
    if (imageUrl === mainImage) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Update main image
      setMainImage(imageUrl);
      setSuccess('Main image updated successfully');
      
      // Update room in database
      await updateRoomImages(imageUrl, additionalImages);
      
      // Notify parent component
      if (onUpdate) {
        onUpdate(imageUrl, additionalImages);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to update main image');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an image
  const deleteImage = async (imageUrl: string) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Get auth token from centralized utility
      const token = getAuthToken();
      
      debugLog('Deleting image', { 
        imageUrlPrefix: imageUrl ? imageUrl.substring(0, 50) + '...' : 'none',
        hasToken: !!token,
        tokenLength: token ? token.length : 0
      });
      
      // Use the correct API path for image deletion
      const response = await fetch(`${API_URL}/api/images/cloudinary/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete image');
      }
      
      // Remove from state
      if (imageUrl === mainImage) {
        // If deleting main image, set a new main image if available
        setMainImage(additionalImages[0] || '');
        setAdditionalImages(additionalImages.filter(img => img !== additionalImages[0]));
      } else {
        // Remove from additional images
        setAdditionalImages(additionalImages.filter(img => img !== imageUrl));
      }
      
      setSuccess('Image deleted successfully');
      
      // Update room in database
      const newMainImage = imageUrl === mainImage ? (additionalImages[0] || '') : mainImage;
      const newAdditionalImages = imageUrl === mainImage 
        ? additionalImages.filter(img => img !== additionalImages[0])
        : additionalImages.filter(img => img !== imageUrl);
        
      await updateRoomImages(newMainImage, newAdditionalImages);
      
      // Notify parent component
      if (onUpdate) {
        onUpdate(newMainImage, newAdditionalImages);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to delete image');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to update room images in database
  const updateRoomImages = async (mainImageUrl: string, imagesArray: string[]) => {
    try {
      setIsUpdating(true);
      setError('');

      if (!mainImageUrl && !imagesArray.length) {
        console.error('No images to update');
        setError('No images selected to update');
        setIsUpdating(false);
        return;
      }

      // Get JWT token
      const token = await getAuthToken();
      if (!token) {
        console.error('Failed to get authentication token');
        setError('Authentication failed');
        setIsUpdating(false);
        return;
      }

      // Force mainImageUrl to be set if we have images
      // This ensures we always have a main image
      const effectiveMainImageUrl = mainImageUrl || (imagesArray.length > 0 ? imagesArray[0] : '');
      
      if (!effectiveMainImageUrl) {
        console.error('No main image URL available');
        setError('No main image available');
        setIsUpdating(false);
        return;
      }

      console.log('Updating room images with:', { 
        roomId, 
        endpoint: `/api/admin/rooms/${roomId}`,
        mainImageUrl: effectiveMainImageUrl ? effectiveMainImageUrl.substring(0, 30) + '...' : 'none', 
        imagesCount: imagesArray.length 
      });

      // Update the room directly with both main image and additional images
      // Connect directly to the backend instead of going through Next.js API routes
      const response = await fetch(`${API_URL}/api/admin/rooms/${roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          // Use snake_case for the backend fields as per database schema
          image_url: effectiveMainImageUrl,
          images: imagesArray
        }),
      });
      
      console.log('Room update response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Failed to update room images';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('Error updating room images:', errorData);
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Room update successful:', {
        success: data.success,
        room: data.room ? 'received' : 'not received',
        imageUrl: data.room?.image_url ? 'set' : 'not set',
        imagesCount: data.room?.images?.length || 0
      });
      
      // Log response status for debugging
      debugLog('Update response status', { status: response.status, ok: response.ok });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update room images');
      }
      
      debugLog('Images successfully updated', { mainImage: !!mainImageUrl, additionalImages: imagesArray.length });
      return true;
    } catch (error: any) {
      console.error('Error updating room images:', error);
      setError(error.message || 'Failed to update room images');
      return false;
    }
  };

  return (
    <div className="room-image-manager p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Room Images</h2>
      
      {/* Main Image Upload */}
      <div className="main-image-section mb-6">
        <h3 className="text-lg font-semibold mb-2">Main Image</h3>
        
        {mainImage ? (
          <div className="relative">
            <OptimizedImage
              src={mainImage}
              type="room"
              width={400}
              height={300}
              alt="Main room image"
              className="rounded-lg object-cover"
            />
            <button 
              className="btn btn-sm btn-error absolute top-2 right-2"
              onClick={() => deleteImage(mainImage)}
              disabled={isLoading}
            >
              Delete
            </button>
          </div>
        ) : (
          <div className="bg-gray-100 flex flex-col items-center justify-center rounded-lg h-[300px]">
            <FaImage className="text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">No main image set</p>
            <p className="text-gray-400 text-sm">Upload an image or select one from additional images</p>
          </div>
        )}
        
        <div className="mt-4">
          <ImageUploader
            endpoint={`${API_URL}/api/admin/rooms/${roomId}/image?setAsMain=true`}
            onUploadSuccess={handleMainImageUpload}
            onUploadError={(err) => setError(err)}
            buttonText="Upload Main Image"
            imageType="room"
          />
        </div>
      </div>
      
      {/* Additional Images */}
      <div className="additional-images-section mb-6">
        <h3 className="text-lg font-semibold mb-2">Additional Images</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {formattedAdditionalImages.map((image, index) => (
            <div key={`add-img-${index}`} className="relative">
              <OptimizedImage
                src={image}
                type="room"
                width={250}
                height={150}
                alt={`Room image ${index + 1}`}
                className="rounded-lg object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button 
                  className="btn btn-xs btn-primary"
                  onClick={() => setAsMainImage(image)}
                  disabled={isLoading}
                >
                  Set as Main
                </button>
                <button 
                  className="btn btn-xs btn-error"
                  onClick={() => deleteImage(image)}
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          {formattedAdditionalImages.length === 0 && (
            <div className="bg-gray-100 flex items-center justify-center rounded-lg h-[150px] col-span-2">
              <p className="text-gray-500">No additional images</p>
            </div>
          )}
        </div>
        
        <ImageUploader
          endpoint={`${API_URL}/api/admin/rooms/${roomId}/images`}
          onUploadSuccess={(url) => handleAdditionalImagesUpload([url])}
          onUploadError={(err) => setError(err)}
          buttonText="Add More Images"
          imageType="room"
        />
      </div>
      
      {/* Gallery Preview */}
      <div className="gallery-preview-section">
        <h3 className="text-lg font-semibold mb-2">Gallery Preview</h3>
        <ImageGallery
          images={additionalImages}
          mainImage={mainImage}
          imageType="room"
        />
      </div>
      
      {/* Status Messages */}
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
    </div>
  );
};

export default RoomImageManager;
