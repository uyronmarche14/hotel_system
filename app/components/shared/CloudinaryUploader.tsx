'use client';

import React, { useState, useRef, useCallback } from 'react';
import { FiUpload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

// Simple styled components for the uploader
const Button = ({ children, onClick, disabled, className, type, variant }: any) => (
  <button
    type={type || 'button'}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md border ${variant === 'outline' ? 'border-gray-300 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);

// Simple progress component
const Progress = ({ value, className }: { value: number, className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full ${className}`}>
    <div 
      className="bg-blue-600 rounded-full h-full transition-all" 
      style={{ width: `${value}%` }}
    />
  </div>
);

interface CloudinaryUploaderProps {
  onUploadSuccess: (imageUrl: string) => void;
  onUploadError?: (error: Error) => void;
  buttonText?: string;
  folder?: string;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  className?: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export default function CloudinaryUploader({
  onUploadSuccess,
  onUploadError,
  buttonText = 'Upload Image',
  folder = 'rooms',
  maxFileSize = 10, // 10MB default
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = '',
  buttonVariant = 'outline'
}: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  // Debug logging
  console.log('CloudinaryUploader initialized with cloud name:', cloudName);
  console.log('API URL:', process.env.NEXT_PUBLIC_URL);
  
  // Function to trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Get signature from backend
  const getSignature = async () => {
    try {
      console.log('Getting signature for folder:', folder);
      
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token not found');
        throw new Error('Authentication token not found');
      }
      
      // Build URL with fallback
      const apiUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:5000';
      const signatureUrl = `${apiUrl}/api/cloudinary/signature?folder=${folder}`;
      console.log('Requesting signature from:', signatureUrl);

      const response = await fetch(signatureUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error('Signature response not OK:', response.status, response.statusText);
        throw new Error(`Failed to get signature: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Signature data received:', { 
        timestamp: data.timestamp,
        signature: data.signature ? data.signature.substring(0, 6) + '...' : 'missing',
        api_key: data.api_key ? 'present' : 'missing',
        cloudName: data.cloudName || 'missing'
      });
      
      return data;
    } catch (error) {
      console.error('Error getting upload signature:', error);
      throw error;
    }
  };
  
  // Handle file change
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!acceptedFileTypes.includes(file.type)) {
      setError(`File type not accepted. Please upload: ${acceptedFileTypes.join(', ')}`);
      return;
    }
    
    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxFileSize}MB`);
      return;
    }
    
    setError(null);
    setIsUploading(true);
    setProgress(0);
    
    try {
      // Get signature data from backend
      const signatureData = await getSignature();
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signatureData.api_key);
      formData.append('timestamp', signatureData.timestamp.toString());
      formData.append('signature', signatureData.signature);
      formData.append('folder', folder);
      
      // Log what we're uploading
      console.log('Attempting to upload to Cloudinary:', {
        cloudName,
        fileType: file.type,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        folder,
        hasSignature: !!signatureData.signature,
        hasApiKey: !!signatureData.api_key,
      });

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progressPercent = Math.round((event.loaded / event.total) * 100);
          console.log(`Upload progress: ${progressPercent}%`);
          setProgress(progressPercent);
        }
      });
      
      // Setup completion handler
      xhr.onload = function() {
        console.log('Upload complete with status:', xhr.status);
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            console.log('Cloudinary upload response:', {
              secure_url: response.secure_url ? response.secure_url.substring(0, 30) + '...' : 'missing',
              public_id: response.public_id || 'missing',
            });
            
            // Extract the secure URL from the response
            const uploadedUrl = response.secure_url;
            
            setIsUploading(false);
            setProgress(100);
            
            // Call the onUploadSuccess callback with the URL
            console.log('Calling onUploadSuccess with URL:', uploadedUrl.substring(0, 30) + '...');
            onUploadSuccess(uploadedUrl);
          } catch (error) {
            console.error('Error parsing Cloudinary response:', error, 'Response text:', xhr.responseText);
            setError('Error parsing upload response');
            if (onUploadError) {
              onUploadError(new Error('Failed to parse upload response'));
            }
          }
        } else {
          console.error('Upload failed with HTTP status:', xhr.status, 'Response:', xhr.responseText);
          setError(`Upload failed with status ${xhr.status}`);
          if (onUploadError) {
            onUploadError(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      };
      
      // Setup error handler
      xhr.onerror = function() {
        console.error('Network error during upload');
        setIsUploading(false);
        setError('Upload failed due to network error');
        if (onUploadError) {
          onUploadError(new Error('Network error during upload'));
        }
      };
      
      // Open connection and send data
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      console.log('Opening connection to:', uploadUrl);
      xhr.open('POST', uploadUrl);
      xhr.send(formData);
      
    } catch (error) {
      console.error('Error during upload:', error);
      setIsUploading(false);
      setError(error instanceof Error ? error.message : 'Unknown upload error');
      if (onUploadError && error instanceof Error) {
        onUploadError(error);
      }
    }
  };
  
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <input
        type="file"
        accept={acceptedFileTypes.join(',')}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Button 
        type="button"
        variant={buttonVariant}
        onClick={triggerFileInput}
        disabled={isUploading}
        className="flex items-center gap-2"
      >
        {isUploading ? (
          <>Uploading... <FiUpload className="animate-pulse" /></>
        ) : (
          <>{buttonText} <FiUpload /></>
        )}
      </Button>
      
      {isUploading && (
        <div className="w-full mt-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center mt-1">{progress}%</p>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 flex items-center gap-1 text-sm mt-1">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
