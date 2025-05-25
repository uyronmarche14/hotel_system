"use client";

import { useState, useEffect } from 'react';
import ReviewForm, { ReviewData } from './ReviewForm';
import ReviewList, { Review } from './ReviewList';
import { FaStar, FaRegStar, FaPen } from 'react-icons/fa';
import { format } from 'date-fns';

interface ReviewSectionProps {
  bookingId: string;
  roomId: string;
  roomTitle: string;
  checkOutDate: string;
}

const ReviewSection = ({
  bookingId,
  roomId,
  roomTitle,
  checkOutDate
}: ReviewSectionProps) => {
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewsVisible, setReviewsVisible] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [checkoutDatePassed, setCheckoutDatePassed] = useState(false);
  
  // Check if checkout date has passed
  useEffect(() => {
    const checkout = new Date(checkOutDate);
    const today = new Date();
    setCheckoutDatePassed(today > checkout);
  }, [checkOutDate]);
  
  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };
  
  const toggleReviews = () => {
    setReviewsVisible(!reviewsVisible);
  };
  
  const handleReviewSubmit = (reviewData: ReviewData) => {
    // In a real app, this would send the data to an API
    console.log('Review submitted:', reviewData);
    
    // Create a new review object
    const newReview: Review = {
      id: `review-${Date.now()}`,
      bookingId: reviewData.bookingId,
      userId: 'current-user-id',
      userName: 'You',
      rating: reviewData.rating,
      comment: reviewData.comment,
      tags: reviewData.tags,
      createdAt: reviewData.createdAt,
      helpfulCount: 0
    };
    
    // Update state
    setUserReview(newReview);
    setHasReviewed(true);
    setShowReviewForm(false);
  };
  
  // Format the date for display
  const formattedCheckOutDate = format(new Date(checkOutDate), 'MMMM d, yyyy');
  
  // Don't show anything if checkout date hasn't passed yet
  if (!checkoutDatePassed) {
    return null;
  }
  
  return (
    <div className="mt-10 border-t pt-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Ratings & Reviews</h2>
        <p className="text-gray-600">
          Share your experience to help other travelers make better choices.
        </p>
      </div>
      
      {!hasReviewed && !showReviewForm ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-gray-200 rounded-full p-3 mr-4">
              <FaRegStar className="text-gray-400 text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">Rate your stay</h3>
              <p className="text-gray-600 mb-4">
                Your stay at {roomTitle} ended on {formattedCheckOutDate}. How was your experience?
              </p>
              <button
                onClick={toggleReviewForm}
                className="flex items-center px-4 py-2 bg-[#1C3F32] text-white rounded-lg hover:bg-[#15302A] transition-colors"
              >
                <FaPen className="mr-2" />
                Write a Review
              </button>
            </div>
          </div>
        </div>
      ) : hasReviewed && userReview ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-[#1C3F32] rounded-full p-3 mr-4">
              <FaStar className="text-white text-xl" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">Your Review</h3>
                <span className="text-sm text-gray-500">
                  {format(new Date(userReview.createdAt), 'MMMM d, yyyy')}
                </span>
              </div>
              <div className="mb-2">
                {Array(5).fill(0).map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < userReview.rating ? 'text-yellow-400 inline-block mr-1' : 'text-gray-300 inline-block mr-1'} 
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-2">{userReview.comment}</p>
              {userReview.tags && userReview.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {userReview.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <button
                onClick={toggleReviewForm}
                className="text-[#1C3F32] hover:underline text-sm font-medium"
              >
                Edit Review
              </button>
            </div>
          </div>
        </div>
      ) : null}
      
      {showReviewForm && (
        <div className="mb-8">
          <ReviewForm 
            bookingId={bookingId}
            roomTitle={roomTitle}
            checkOutDate={formattedCheckOutDate}
            onSubmit={handleReviewSubmit}
            onCancel={toggleReviewForm}
          />
        </div>
      )}
      
      {/* Review list toggle */}
      <div className="mb-4">
        <button 
          onClick={toggleReviews}
          className="flex items-center text-[#1C3F32] font-medium hover:underline"
        >
          {reviewsVisible ? (
            <>
              <span className="mr-2">Hide all reviews</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 15l-6-6-6 6"/>
              </svg>
            </>
          ) : (
            <>
              <span className="mr-2">See all reviews</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </>
          )}
        </button>
      </div>
      
      {/* Review list */}
      {reviewsVisible && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <ReviewList 
            roomId={roomId} 
            reviews={userReview ? [userReview, ...mockReviews] : mockReviews}
          />
        </div>
      )}
    </div>
  );
};

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

export default ReviewSection;
