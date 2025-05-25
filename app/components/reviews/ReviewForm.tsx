"use client";

import { useState } from 'react';
import StarRating from './StarRating';
import { FaSmile, FaComment, FaPaperPlane, FaTimes } from 'react-icons/fa';

interface ReviewFormProps {
  bookingId: string;
  roomTitle: string;
  checkOutDate: string;
  onSubmit?: (reviewData: ReviewData) => void;
  onCancel?: () => void;
}

export interface ReviewData {
  bookingId: string;
  rating: number;
  comment: string;
  recommendationScore: number;
  tags: string[];
  createdAt: string;
}

const ReviewForm = ({
  bookingId,
  roomTitle,
  checkOutDate,
  onSubmit,
  onCancel
}: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [recommendationScore, setRecommendationScore] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const suggestedTags = [
    'Clean', 'Comfortable', 'Friendly Staff', 'Good Location', 
    'Value for Money', 'Quiet', 'Spacious', 'Modern', 'Great View',
    'Excellent Amenities', 'Fast WiFi', 'Delicious Food'
  ];

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Create review data object
    const reviewData: ReviewData = {
      bookingId,
      rating,
      comment,
      recommendationScore,
      tags: selectedTags,
      createdAt: new Date().toISOString()
    };
    
    // Simulate API call delay
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(reviewData);
      }
      
      // Reset form and show success message
      setSubmitSuccess(true);
      setSubmitting(false);
      
      // After showing success message, reset form
      setTimeout(() => {
        setRating(0);
        setComment('');
        setRecommendationScore(0);
        setSelectedTags([]);
        setSubmitSuccess(false);
        
        // If onCancel is provided, call it to close the form
        if (onCancel) {
          onCancel();
        }
      }, 2000);
    }, 1000);
  };

  if (submitSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <FaSmile className="text-green-500 text-3xl" />
        </div>
        <h3 className="text-green-800 font-medium text-lg mb-2">Thank you for your feedback!</h3>
        <p className="text-green-700">Your review has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-black">Share Your Experience</h3>
        {onCancel && (
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close review form"
          >
            <FaTimes />
          </button>
        )}
      </div>
      
      <div className="mb-4">
        <p className="text-gray-800 mb-1">Your stay at:</p>
        <p className="font-medium text-black">{roomTitle}</p>
        <p className="text-sm text-gray-700">Check-out: {checkOutDate}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Overall Rating */}
          <div>
            <label className="block text-gray-900 font-medium mb-2">
              Overall Rating
            </label>
            <StarRating 
              initialRating={rating} 
              onChange={setRating} 
              size="lg" 
              className="mb-1"
            />
            <p className="text-sm text-gray-500">
              {rating === 0 ? 'Click to rate' : 
               rating <= 2 ? 'We\'re sorry about your experience' : 
               rating === 3 ? 'Thanks for your feedback' : 
               'We\'re glad you enjoyed your stay!'}
            </p>
          </div>
          
          {/* Recommendation Score */}
          <div>
            <label className="block text-gray-900 font-medium mb-2">
              How likely are you to recommend us to a friend?
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <button
                  key={score}
                  type="button"
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm 
                           ${recommendationScore === score 
                             ? 'bg-[#1C3F32] text-white' 
                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setRecommendationScore(score)}
                >
                  {score}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {recommendationScore === 0 ? 'Select a score' : 
               recommendationScore >= 9 ? 'Excellent! Thank you!' : 
               recommendationScore >= 7 ? 'Great!' : 
               recommendationScore >= 5 ? 'Thank you for your feedback' : 
               'We appreciate your honesty'}
            </p>
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-gray-900 font-medium mb-2">
              What did you like about your stay? (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                           ${selectedTags.includes(tag) 
                             ? 'bg-[#1C3F32] text-white' 
                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          {/* Comments */}
          <div>
            <label htmlFor="review-comment" className="block text-gray-900 font-medium mb-2">
              Your Review
            </label>
            <div className="relative">
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this property..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C3F32] focus:border-[#1C3F32] transition-all min-h-[120px] text-gray-900 placeholder:text-gray-500"
                rows={4}
              />
              <div className="absolute right-3 bottom-3 text-gray-400">
                <FaComment />
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2
                        ${rating === 0 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-[#1C3F32] text-white hover:bg-[#15302A] transition-colors'}`}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
