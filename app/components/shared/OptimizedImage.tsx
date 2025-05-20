/**
 * Optimized Image Component
 * A wrapper component that automatically optimizes images using Cloudinary
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { optimizeCloudinaryImage, isCloudinaryUrl } from '@/app/utils/cloudinaryImage';
import { ROOM_IMAGE_FALLBACK, PROFILE_IMAGE_FALLBACK } from '@/app/lib/constants';

// Define standard image types
type ImageType = 'room' | 'profile' | 'general';
type ImageFormat = 'auto' | 'webp' | 'jpg' | 'png';
type CropMode = 'fill' | 'scale' | 'fit' | 'thumb' | 'crop';

// Props for our component
interface OptimizedImageProps {
  src: string | null | undefined;
  alt?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  type?: ImageType;
  cloudinaryQuality?: number | 'auto';
  quality?: number;
  format?: ImageFormat;
  crop?: CropMode;
  unoptimized?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  fill?: boolean;
  placeholder?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt = 'Image',
  width = 800,
  height,
  fallbackSrc,
  type = 'general',
  cloudinaryQuality = 'auto',
  quality = 80,
  format = 'auto',
  crop = 'fill',
  unoptimized = false,
  className,
  sizes,
  priority = false,
  style,
  onLoad,
  fill = false,
  placeholder,
  ...props
}) => {
  // Determine the fallback image based on type
  const defaultFallback = 
    type === 'room' ? ROOM_IMAGE_FALLBACK :
    type === 'profile' ? PROFILE_IMAGE_FALLBACK :
    'https://placehold.co/600x400/png?text=Image';
  
  // Use provided fallback or default
  const fallbackImage = fallbackSrc || defaultFallback;
  
  // Process the initial image source with appropriate handling for null/undefined
  const processImageSrc = (sourceImg: string | null | undefined): string => {
    // Handle null or undefined src
    const sourceSrc = sourceImg || fallbackImage;
    
    // Skip Cloudinary processing if the unoptimized flag is set
    if (unoptimized) return sourceSrc;
    
    // Optimize image if it's a Cloudinary URL
    return isCloudinaryUrl(sourceSrc) 
      ? optimizeCloudinaryImage(sourceSrc, { 
          width: typeof width === 'number' ? width : undefined, 
          height: typeof height === 'number' ? height : undefined, 
          quality: cloudinaryQuality, 
          format, 
          crop 
        })
      : sourceSrc;
  };
  
  // Initialize the image source state with proper processing
  const [imgSrc, setImgSrc] = useState<string>(processImageSrc(src));
  
  // Use a default height if not provided (only if width is specified and not using fill mode)
  const autoHeight = !height && !fill && typeof width === 'number' ? Math.round(width * 0.75) : height;
  
  const handleError = () => {
    // Use fallback image on error
    if (imgSrc !== fallbackImage) {
      console.log('Image load error, using fallback:', fallbackImage);
      setImgSrc(fallbackImage);
    }
  };
  
  // Create the Image props object with correct TypeScript typing
  const imageProps: any = {
    src: imgSrc,
    alt: alt,
    quality: quality,
    sizes: sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    onError: handleError,
    unoptimized: unoptimized || !isCloudinaryUrl(imgSrc),
    className,
    style,
    onLoad,
    priority,
    placeholder
  };

  // Set dimensions based on fill mode
  if (fill) {
    imageProps.fill = true;
  } else {
    imageProps.width = width;
    imageProps.height = autoHeight;
  }

  return <Image {...imageProps} />;
};

export default OptimizedImage;
