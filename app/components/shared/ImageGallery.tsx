/**
 * Image Gallery Component
 * Displays a responsive gallery of images with Cloudinary optimization
 */

'use client';

import React, { useState } from 'react';
import { 
  optimizeCloudinaryImage, 
  isCloudinaryUrl, 
  getResponsiveImageUrl 
} from '@/app/utils/cloudinaryImage';
import OptimizedImage from './OptimizedImage';
import { ROOM_IMAGE_FALLBACK } from '@/app/lib/constants';

interface ImageGalleryProps {
  images: string[];
  mainImage?: string;
  fallbackImage?: string;
  onImageClick?: (imageUrl: string, index: number) => void;
  className?: string;
  imageType?: 'room' | 'profile' | 'general';
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'auto';
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images = [],
  mainImage,
  fallbackImage = ROOM_IMAGE_FALLBACK,
  onImageClick,
  className = '',
  imageType = 'room',
  aspectRatio = 'landscape'
}) => {
  // If mainImage is provided, use it as the first image, otherwise use the first image from images array
  const allImages = mainImage 
    ? [mainImage, ...images.filter(img => img !== mainImage)]
    : images;
  
  // If no images provided, use fallback
  const displayImages = allImages.length > 0 ? allImages : [fallbackImage];
  
  // State for current selected image
  const [selectedImage, setSelectedImage] = useState<string>(displayImages[0]);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  
  // Calculate dimensions based on aspect ratio
  const getDimensions = () => {
    switch (aspectRatio) {
      case 'square': 
        return { width: 400, height: 400 };
      case 'portrait': 
        return { width: 400, height: 600 };
      case 'landscape': 
        return { width: 600, height: 400 };
      case 'auto':
      default: 
        return { width: 600, height: undefined };
    }
  };
  
  const { width, height } = getDimensions();
  
  // Handle thumbnail click
  const handleThumbnailClick = (image: string, index: number) => {
    setSelectedImage(image);
    if (onImageClick) {
      onImageClick(image, index);
    }
  };
  
  // Open lightbox
  const openLightbox = (image: string) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };
  
  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  
  return (
    <div className={`image-gallery ${className}`}>
      {/* Main selected image */}
      <div 
        className="main-image-container mb-4 cursor-pointer" 
        onClick={() => openLightbox(selectedImage)}
      >
        <OptimizedImage 
          src={selectedImage}
          fallbackSrc={fallbackImage}
          type={imageType}
          width={width}
          height={height}
          alt="Selected image"
          className="rounded-lg object-cover w-full"
          quality="auto"
          format="auto"
        />
      </div>
      
      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="thumbnails-container flex overflow-x-auto gap-2 pb-2">
          {displayImages.map((image, index) => (
            <div 
              key={`thumb-${index}`}
              className={`thumbnail-item flex-shrink-0 cursor-pointer transition-all duration-200 ${
                selectedImage === image ? 'ring-2 ring-primary' : 'opacity-80 hover:opacity-100'
              }`}
              onClick={() => handleThumbnailClick(image, index)}
            >
              <OptimizedImage 
                src={image}
                fallbackSrc={fallbackImage}
                type={imageType}
                width={100}
                height={100}
                alt={`Thumbnail ${index + 1}`}
                className="rounded object-cover"
                crop="fill"
                quality="auto"
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="lightbox fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            ✕
          </button>
          
          <div 
            className="lightbox-content max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <OptimizedImage 
              src={selectedImage}
              fallbackSrc={fallbackImage}
              type={imageType}
              width={1200}
              height={800}
              alt="Lightbox image"
              className="max-h-[90vh] w-auto object-contain"
              quality="auto"
              format="auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
