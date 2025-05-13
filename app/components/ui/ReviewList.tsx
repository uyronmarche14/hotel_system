"use client";

import { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaUserCircle, FaThumbsUp } from 'react-icons/fa';
import { Review, ReviewStats, getRoomReviews } from '@/app/lib/reviewService';
import SafeImage from './SafeImage';
import { format } from 'date-fns';

interface ReviewListProps {
  category: string;
  roomTitle: string;
}

const ReviewList = ({ category, roomTitle }: ReviewListProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, [category, roomTitle, currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getRoomReviews(category, roomTitle, currentPage, 5);
      setReviews(data.reviews);
      setStats(data.stats || null);
      setTotalPages(data.pagination.totalPages);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch reviews:', err);
      setError('Unable to load reviews at this time');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Generate star rating display
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-yellow-400" />
            )}
          </span>
        ))}
      </div>
    );
  };

  // Rating percentage bar for the stats
  const RatingBar = ({ rating, count, total }: { rating: number; count: number; total: number }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
      <div className="flex items-center mb-2">
        <div className="w-10 text-sm font-medium mr-2">{rating} ★</div>
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-yellow-400 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="w-10 text-sm text-right pl-2">{count}</div>
      </div>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // If there are no reviews yet
  if (!loading && reviews.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-[#1C3F32] mb-2">Guest Reviews</h2>
        <div className="py-8 text-center">
          <p className="text-gray-500 mb-4">No reviews yet for this room</p>
          <p className="text-gray-700">Be the first to share your experience!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold text-[#1C3F32] mb-6">Guest Reviews</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <>
          {/* Review Summary */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-6 border-b">
              {/* Left column - Overall Rating */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-[#1C3F32] mb-2">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="flex mb-2">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <p className="text-gray-500">
                  Based on {Object.values(stats.ratingDistribution).reduce((a, b) => a + b, 0)} reviews
                </p>
              </div>
              
              {/* Right column - Rating Distribution */}
              <div>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <RatingBar 
                    key={rating}
                    rating={rating}
                    count={stats.ratingDistribution[rating] || 0}
                    total={Object.values(stats.ratingDistribution).reduce((a, b) => a + b, 0)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-6 last:border-b-0">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      {'name' in review.user ? (
                        <SafeImage
                          src={review.user.profilePic}
                          alt={review.user.name}
                          width={40}
                          height={40}
                          imageType="profile"
                          className="object-cover"
                        />
                      ) : (
                        <FaUserCircle className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{'name' in review.user ? review.user.name : 'Anonymous'}</div>
                      <div className="text-sm text-gray-500">
                        {review.stayDate ? `Stayed on ${formatDate(review.stayDate)}` : `Posted on ${formatDate(review.createdAt)}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                <h3 className="font-bold text-lg mb-2">{review.title}</h3>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                
                {/* Review images if any */}
                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {review.images.map((image, i) => (
                      <div key={i} className="w-24 h-24 rounded-md overflow-hidden">
                        <SafeImage
                          src={image}
                          alt={`Review image ${i+1}`}
                          width={96}
                          height={96}
                          imageType="general"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Like button */}
                <button className="text-sm text-gray-500 flex items-center hover:text-[#1C3F32]">
                  <FaThumbsUp className="mr-1" /> Helpful ({review.likes})
                </button>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="mx-4">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewList; 