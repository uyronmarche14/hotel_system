"use client";

import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  initialRating?: number;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  className?: string;
}

const StarRating = ({
  initialRating = 0,
  size = 'md',
  onChange,
  readOnly = false,
  className = '',
}: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState<number | null>(null);
  
  // Update internal rating if initialRating prop changes
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  // Determine star size based on the size prop
  const getStarSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-8 h-8';
      case 'md':
      default: return 'w-6 h-6';
    }
  };
  
  const starSize = getStarSize();

  const handleRatingChange = (newRating: number) => {
    if (readOnly) return;
    
    setRating(newRating);
    if (onChange) {
      onChange(newRating);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        
        return (
          <button
            type="button"
            key={index}
            className={`${starSize} ${!readOnly ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'} focus:outline-none mx-0.5`}
            onClick={() => handleRatingChange(ratingValue)}
            onMouseEnter={() => !readOnly && setHover(ratingValue)}
            onMouseLeave={() => !readOnly && setHover(null)}
            aria-label={`Rate ${ratingValue} out of 5 stars`}
            disabled={readOnly}
          >
            <FaStar 
              className={`${(hover || rating) >= ratingValue ? 'text-yellow-500' : 'text-gray-400'} 
                         transition-colors duration-200 w-full h-full`}
            />
          </button>
        );
      })}
      
      {!readOnly && (
        <span className="ml-2 text-sm text-gray-900 font-medium">
          {rating > 0 ? rating : ''} {rating === 1 ? 'Star' : rating > 1 ? 'Stars' : ''}
        </span>
      )}
    </div>
  );
};

export default StarRating;
