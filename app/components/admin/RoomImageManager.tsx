/**
 * Room Image Manager Component
 * A component for managing room images using direct Cloudinary uploads
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiTrash2, FiImage, FiCheck } from 'react-icons/fi';
import CloudinaryUploader from '../shared/CloudinaryUploader';

// Environment variables
const API_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:5000';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Debug helper
const debugLog = (message: string, data: any) => {
  console.log(`[RoomImageManager] ${message}:`, data);
};

// Simple toast notification component
const Toast = {
  success: (message: string) => {
    console.log('SUCCESS:', message);
    // In a real app, you'd show a toast UI here
  },
  error: (message: string) => {
    console.error('ERROR:', message);
    // In a real app, you'd show a toast UI here
  }
};

// Simple Button component
const Button = ({ children, onClick, disabled, className, variant = 'default' }: any) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-2 rounded ${variant === 'outline' ? 'border border-gray-300 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);

// Helper function to join classNames
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

// RoomImageManagerProps interface
interface RoomImageManagerProps {
  roomId: string;
  initialMainImage?: string;
  initialImages?: string[];
  onUpdate?: (mainImage: string, images: string[]) => void;
}

/**
 * Room Image Manager Component
 */
const RoomImageManager: React.FC<RoomImageManagerProps> = ({
  roomId,
  initialMainImage = '',
  initialImages = [],
  onUpdate
}) => {
  const [mainImage, setMainImage] = useState<string>(initialMainImage);
  const [additionalImages, setAdditionalImages] = useState<string[]>(initialImages || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Format images array excluding the main image
  const formattedAdditionalImages = additionalImages.filter(img => img !== mainImage);

  // Handle successful main image upload
  const handleMainImageUpload = async (imageUrl: string) => {
    try {
      setIsLoading(true);
      debugLog('Main image uploaded to Cloudinary', imageUrl);
      
      // Now we need to tell the backend to update the room with this new image URL
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Call the sync endpoint to update the database
      const response = await fetch(`${API_URL}/api/cloudinary/sync/rooms/${roomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          image_url: imageUrl,
          is_main_image: true
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to sync image: ${response.statusText}`);
      }
      
      const result = await response.json();
      debugLog('Sync result', result);
      
      // Update state with the new image
      setMainImage(imageUrl);
      Toast.success('Main image uploaded successfully');
      
      // Notify parent component if needed
      if (onUpdate) {
        onUpdate(imageUrl, additionalImages);
      }
    } catch (error: any) {
      console.error('Error syncing main image:', error);
      setError(error.message || 'Failed to upload main image');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful additional image upload
  const handleAdditionalImageUpload = async (imageUrl: string) => {
    try {
      setIsLoading(true);
      debugLog('Additional image uploaded to Cloudinary', imageUrl);
      
      // Now we need to tell the backend to update the room with this new image URL
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Call the sync endpoint to update the database
      const response = await fetch(`${API_URL}/api/cloudinary/sync/rooms/${roomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          image_url: imageUrl,
          is_main_image: false
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to sync image: ${response.statusText}`);
      }
      
      const result = await response.json();
      debugLog('Sync result', result);
      
      // Update state with the new images array
      setAdditionalImages(prev => [...prev, imageUrl]);
      Toast.success('Additional image uploaded successfully');
      
      // Notify parent component if needed
      if (onUpdate) {
        onUpdate(mainImage, [...additionalImages, imageUrl]);
      }
    } catch (error: any) {
      console.error('Error syncing additional image:', error);
      setError(error.message || 'Failed to upload additional image');
    } finally {
      setIsLoading(false);
    }
  };

  // Set image as main image
  const setAsMainImage = async (imageUrl: string) => {
    try {
      setIsLoading(true);
      
      // Now we need to tell the backend to update the room with this new main image
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Call the sync endpoint to update the database
      const response = await fetch(`${API_URL}/api/cloudinary/sync/rooms/${roomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          image_url: imageUrl,
          is_main_image: true
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to set main image: ${response.statusText}`);
      }
      
      // Update state
      setMainImage(imageUrl);
      Toast.success('Main image updated successfully');
      
      // Notify parent component if needed
      if (onUpdate) {
        onUpdate(imageUrl, additionalImages);
      }
    } catch (error: any) {
      console.error('Error setting main image:', error);
      setError(error.message || 'Failed to set main image');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete image
  const deleteImage = async (imageUrl: string) => {
    try {
      setIsLoading(true);
      
      // Extract public_id from Cloudinary URL
      const urlParts = imageUrl.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split('.')[0];
      
      // Request deletion from the backend
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`${API_URL}/api/cloudinary/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          public_id: publicId,
          resource_type: 'image',
          room_id: roomId,
          image_url: imageUrl
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete image: ${response.statusText}`);
      }
      
      // Update state
      if (imageUrl === mainImage) {
        setMainImage('');
      }
      
      setAdditionalImages(prev => prev.filter(img => img !== imageUrl));
      Toast.success('Image deleted successfully');
      
      // Notify parent component if needed
      if (onUpdate) {
        onUpdate(
          imageUrl === mainImage ? '' : mainImage,
          additionalImages.filter(img => img !== imageUrl)
        );
      }
    } catch (error: any) {
      console.error('Error deleting image:', error);
      setError(error.message || 'Failed to delete image');
    } finally {
      setIsLoading(false);
    }
  };

  // Render component
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-md">
      {/* Main image section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Main Room Image</h3>
        
        {/* Show main image if available */}
        {mainImage ? (
          <div className="relative rounded-md overflow-hidden border border-gray-200 aspect-video">
            <Image
              src={mainImage}
              alt="Main Room Image"
              className="object-cover"
              fill
            />
            <div className="absolute top-0 right-0 p-2">
              <Button 
                variant="destructive"
                onClick={() => deleteImage(mainImage)}
                className="p-1 rounded bg-red-500 text-white"
                aria-label="Delete main image"
              >
                <FiTrash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md text-center">
            <div className="space-y-2">
              <FiImage className="w-12 h-12 mx-auto text-gray-400" />
              <p className="text-gray-500">No main image selected</p>
            </div>
          </div>
        )}
        
        {/* Main image uploader - direct to Cloudinary */}
        <CloudinaryUploader
          onUploadSuccess={(imageUrl: string) => handleMainImageUpload(imageUrl)}
          onUploadError={(error: Error) => setError(error.message)}
          buttonText="Upload Main Image"
          folder="rooms"
          maxFileSize={5}
          className="w-full"
        />
      </div>

      {/* Additional images section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Room Images</h3>
        
        {formattedAdditionalImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {formattedAdditionalImages.map((img, index) => (
              <div key={index} className="relative rounded-md overflow-hidden border border-gray-200 aspect-video">
                <Image
                  src={img}
                  alt={`Room Image ${index + 1}`}
                  className="object-cover"
                  fill
                />
                <div className="absolute top-0 right-0 p-2 flex gap-1">
                  <Button 
                    variant="destructive"
                    onClick={() => deleteImage(img)}
                    className="p-1 rounded bg-red-500 text-white"
                    aria-label={`Delete image ${index + 1}`}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setAsMainImage(img)}
                    aria-label={`Set as main image`}
                    className="p-1 rounded bg-white hover:bg-gray-100"
                  >
                    <FiCheck className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md text-center">
            <div className="space-y-2">
              <FiImage className="w-12 h-12 mx-auto text-gray-400" />
              <p className="text-gray-500">No additional images</p>
            </div>
          </div>
        )}
        
        {/* Additional images uploader - direct to Cloudinary */}
        <CloudinaryUploader
          onUploadSuccess={(imageUrl: string) => handleAdditionalImageUpload(imageUrl)}
          onUploadError={(error: Error) => setError(error.message)}
          buttonText="Upload Additional Image"
          folder="rooms"
          maxFileSize={5}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default RoomImageManager;
