"use client";

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { getSafeImageUrl } from '@/app/lib/utils';

interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src?: string;
  fallbackSrc?: string;
  imageType?: 'profile' | 'room' | 'general';
}

/**
 * A wrapper around Next.js Image component that automatically handles errors
 * and provides fallback images when the original source fails to load.
 */
const SafeImage = ({
  src,
  fallbackSrc,
  imageType = 'general',
  alt,
  ...props
}: SafeImageProps) => {
  // Get safe source URL with built-in fallback
  const safeSource = getSafeImageUrl(src, fallbackSrc, imageType);
  
  // Local state to track if the image has errored
  const [imgSrc, setImgSrc] = useState(safeSource);
  const [hasError, setHasError] = useState(false);
  
  // Handle image loading error
  const handleError = () => {
    // Only handle fallback once to avoid infinite loops
    if (!hasError) {
      console.warn(`Image failed to load: ${imgSrc}. Using fallback image.`);
      setHasError(true);
      
      // Use appropriate fallback based on image type
      const fallback = {
        'profile': '/images/default-user.png',
        'room': '/images/room-placeholder.jpg',
        'general': '/images/hotel-logo.png'
      }[imageType];
      
      setImgSrc(fallbackSrc || fallback);
    }
  };
  
  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || 'Image'}
      onError={handleError}
    />
  );
};

export default SafeImage; 