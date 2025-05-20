/**
 * Image Uploader Component
 * A reusable component for uploading images to the backend with Cloudinary support
 */

'use client';

import React, { useState, useRef } from 'react';
import { API_URL, MAX_FILE_SIZE } from '@/app/lib/constants';
import { optimizeCloudinaryImage, isCloudinaryUrl } from '@/app/utils/cloudinaryImage';
import { getAuthToken } from '@/app/utils/auth-token';
import Image from 'next/image';

// Debug helper
const debugLog = (message: string, data: any) => {
  console.log(`[ImageUploader] ${message}:`, data);
};

interface ImageUploaderProps {
  onUploadSuccess?: (imageUrl: string) => void;
  onUploadError?: (error: string) => void;
  endpoint: string;
  initialImage?: string;
  uploadParams?: Record<string, string>;
  previewWidth?: number;
  previewHeight?: number;
  imageType?: 'room' | 'profile';
  buttonText?: string;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  endpoint,
  initialImage = '',
  uploadParams = {},
  previewWidth = 300,
  previewHeight = 200,
  imageType = 'room',
  buttonText = 'Upload Image',
  className = '',
}) => {
  const [image, setImage] = useState<string>(initialImage);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    setError('');
    handleUpload(file);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle file upload
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      // Log upload attempt for debugging
      debugLog('Starting image upload', {
        fileName: file.name,
        fileSize: `${Math.round(file.size / 1024)} KB`,
        endpoint,
        params: uploadParams
      });
      
      const formData = new FormData();
      formData.append('image', file);
      
      // Add any additional parameters
      Object.entries(uploadParams).forEach(([key, value]) => {
        formData.append(key, value);
        debugLog(`Added param: ${key}`, value);
      });

      // Use the auth token utility instead of direct localStorage access
      const token = getAuthToken();
      debugLog('Auth token check', {
        hasToken: !!token,
        tokenLength: token ? token.length : 0
      });
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      debugLog('Upload response status', {
        status: response.status,
        ok: response.ok
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        debugLog('Upload error', errorData);
        throw new Error(errorData.message || 'Failed to upload image');
      }
      
      const data = await response.json();
      debugLog('Upload response data', data);
      
      if (data.success && (data.imageUrl || data.url)) {
        const imageUrl = data.imageUrl || data.url;
        debugLog('Upload successful', { imageUrl: imageUrl.substring(0, 50) + '...' });
        setImage(imageUrl);
        onUploadSuccess?.(imageUrl);
      } else {
        throw new Error('Invalid response from server - missing imageUrl');
      }
    } catch (error: any) {
      console.error('Image upload error:', error);
      setError(error.message || 'Failed to upload image');
      onUploadError?.(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Optimize the image preview if it's a Cloudinary URL
  const previewImage = image 
    ? (isCloudinaryUrl(image) 
      ? optimizeCloudinaryImage(image, { 
          width: previewWidth, 
          height: previewHeight, 
          crop: 'fill',
          quality: 'auto' 
        }) 
      : image)
    : '';

  return (
    <div className={`image-uploader ${className}`}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload image file"
      />
      
      {/* Image preview */}
      {previewImage && (
        <div className="preview-container relative mb-4 rounded overflow-hidden">
          <Image
            src={previewImage}
            alt="Image preview"
            width={previewWidth}
            height={previewHeight}
            className="object-cover"
          />
        </div>
      )}
      
      {/* Upload button */}
      <button
        type="button"
        onClick={triggerFileInput}
        disabled={isUploading}
        className={`btn btn-primary ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isUploading ? 'Uploading...' : buttonText}
      </button>
      
      {/* Error message */}
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
