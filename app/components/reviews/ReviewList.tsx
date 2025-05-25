"use client";

import { useState } from 'react';
import StarRating from './StarRating';
import { FaThumbsUp, FaChevronDown, FaChevronUp, FaUser, FaCalendarAlt } from 'react-icons/fa';

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  tags: string[];
  createdAt: string;
  helpfulCount: number;
}

interface ReviewListProps {
  roomId: string;
  reviews?: Review[];
  isLoading?: boolean;
}

// Mock reviews for demo purposes
const mockReviews: Review[] = [
  {
    id: '1',
    bookingId: 'book-123',
    userId: 'user-1',
    userName: 'Maria S.',
    userAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    rating: 5,
    comment: 'Absolutely loved my stay here! The room was immaculate, and the view was breathtaking. The staff went above and beyond to make sure I had everything I needed. Will definitely be coming back!',
    tags: ['Clean', 'Great View', 'Friendly Staff'],
    createdAt: '2025-05-01T14:30:00Z',
    helpfulCount: 12
  },
  {
    id: '2',
    bookingId: 'book-456',
    userId: 'user-2',
    userName: 'John D.',
    userAvatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    rating: 4,
    comment: 'Very comfortable stay. The bed was incredibly soft and the room was spacious. The only minor issue was that the WiFi was a bit slow at times, but otherwise everything was great.',
    tags: ['Comfortable', 'Spacious', 'Value for Money'],
    createdAt: '2025-04-22T09:15:00Z',
    helpfulCount: 8
  },
  {
    id: '3',
    bookingId: 'book-789',
    userId: 'user-3',
    userName: 'Alex T.',
    rating: 5,
    comment: 'Perfect location! Everything we needed was within walking distance. The room itself was modern and well-equipped. The staff was very attentive and accommodating.',
    tags: ['Good Location', 'Modern', 'Friendly Staff'],
    createdAt: '2025-04-15T16:45:00Z',
    helpfulCount: 5
  }
];

const ReviewList = ({ roomId, reviews = mockReviews, isLoading = false }: ReviewListProps) => {
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;
  
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Toggle expanded state for a review
  const toggleExpanded = (reviewId: string) => {
    setExpandedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };
  
  // Mark a review as helpful (demo only)
  const markAsHelpful = (reviewId: string) => {
    // In a real implementation, this would call an API
    console.log(`Marked review ${reviewId} as helpful`);
  };
  
  // Get the reviews to display based on showAllReviews state
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  
  if (isLoading) {
    return (
      <div className="space-y-4 py-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-24 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-gray-500">No reviews yet for this room.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-gray-800">Guest Reviews</h3>
            <div className="px-2 py-1 bg-[#1C3F32] text-white text-sm font-medium rounded-md">
              {averageRating.toFixed(1)}
            </div>
          </div>
          <div className="flex items-center">
            <StarRating initialRating={averageRating} readOnly size="sm" />
            <span className="ml-2 text-sm text-gray-500">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-6">
        {displayedReviews.map((review) => {
          const isExpanded = expandedReviews.includes(review.id);
          const commentLength = review.comment.length;
          const shouldTruncate = commentLength > 200 && !isExpanded;
          const displayedComment = shouldTruncate 
            ? `${review.comment.substring(0, 200)}...` 
            : review.comment;
            
          return (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  {review.userAvatar ? (
                    <img 
                      src={review.userAvatar} 
                      alt={review.userName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1C3F32] text-white">
                      <FaUser />
                    </div>
                  )}
                </div>
                
                {/* Review content */}
                <div className="flex-1">
                  <div className="flex flex-wrap justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800">{review.userName}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-1" size={12} />
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <StarRating initialRating={review.rating} readOnly size="sm" />
                  </div>
                  
                  {/* Tags */}
                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {review.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Comment */}
                  <div className="mb-3">
                    <p className="text-gray-600">{displayedComment}</p>
                    
                    {/* Show more/less button */}
                    {commentLength > 200 && (
                      <button 
                        onClick={() => toggleExpanded(review.id)}
                        className="flex items-center mt-1 text-sm font-medium text-[#1C3F32] hover:underline"
                      >
                        {isExpanded ? (
                          <>
                            <FaChevronUp className="mr-1" size={12} />
                            Show less
                          </>
                        ) : (
                          <>
                            <FaChevronDown className="mr-1" size={12} />
                            Show more
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* Helpful button */}
                  <button 
                    onClick={() => markAsHelpful(review.id)}
                    className="flex items-center text-sm text-gray-500 hover:text-[#1C3F32]"
                  >
                    <FaThumbsUp className="mr-1" size={12} />
                    Helpful ({review.helpfulCount})
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Show more button */}
      {reviews.length > 3 && (
        <div className="text-center pt-2">
          <button
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="px-4 py-2 border border-[#1C3F32] text-[#1C3F32] rounded-lg hover:bg-[#1C3F32] hover:text-white transition-colors"
          >
            {showAllReviews ? 'Show Less Reviews' : `Show All ${reviews.length} Reviews`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
