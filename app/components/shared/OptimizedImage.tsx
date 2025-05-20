/**
 * Optimized Image Component
 * A wrapper component that automatically optimizes images using Cloudinary
 */

'use client';

import React from 'react';
import Image, { ImageProps } from 'next/image';
import { optimizeCloudinaryImage, generateSrcSet, isCloudinaryUrl } from '@/app/utils/cloudinaryImage';
import { ROOM_IMAGE_FALLBACK, PROFILE_IMAGE_FALLBACK } from '@/app/lib/constants';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallbackSrc?: string;
  type?: 'room' | 'profile' | 'general';
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'crop';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  fallbackSrc,
  type = 'general',
  width = 800,
  height,
  quality = 'auto',
  format = 'auto',
  crop = 'fill',
  alt,
  ...props
}) => {
  // Determine the fallback image based on type
  const defaultFallback = 
    type === 'room' ? ROOM_IMAGE_FALLBACK :
    type === 'profile' ? PROFILE_IMAGE_FALLBACK :
    '/images/placeholder.jpg';
  
  // Use provided fallback or default
  const fallback = fallbackSrc || defaultFallback;
  
  // Handle null or undefined src
  const imageSrc = src || fallback;
  
  // Optimize image if it's a Cloudinary URL
  const optimizedSrc = isCloudinaryUrl(imageSrc) 
    ? optimizeCloudinaryImage(imageSrc, { width, height, quality, format, crop })
    : imageSrc;
  
  // Generate srcSet for responsive images if using Cloudinary
  const srcSet = isCloudinaryUrl(imageSrc) ? generateSrcSet(imageSrc) : undefined;
  
  return (
    <Image
      src={optimizedSrc}
      alt={alt || 'Image'}
      width={width || 800}
      height={height || 600}
      sizes={props.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      quality={typeof quality === 'number' ? quality : 80}
      onError={(e) => {
        // Fallback to default image on error
        const imgElement = e.currentTarget as HTMLImageElement;
        imgElement.src = fallback;
      }}
      {...props}
    />
  );
};

export default OptimizedImage;
