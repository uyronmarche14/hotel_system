"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaStar, FaImage, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { updateReview, getUserReviews } from '@/app/lib/reviewService';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import SafeImage from '@/app/components/ui/SafeImage';

export default function EditReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const reviewId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [roomInfo, setRoomInfo] = useState<{title: string, category: string, image?: string}>({
    title: '',
    category: ''
  });

  // Fetch the review data
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent(`/reviews/edit/${reviewId}`));
      return;
    }

    const fetchReview = async () => {
      try {
        setIsLoading(true);
        // Get user reviews and find the one matching this ID
        const data = await getUserReviews(1, 50); // Get all reviews with a high limit
        const review = data.reviews.find(r => r._id === reviewId);
        
        if (!review) {
          setError('Review not found');
          return;
        }
        
        // Set form data
        setRating(review.rating);
        setTitle(review.title);
        setComment(review.comment);
        setImages(review.images || []);
        
        // Set room info
        setRoomInfo({
          title: review.roomTitle,
          category: review.roomCategory,
          image: typeof review.booking === 'object' && review.booking ? 
            (review.booking as any).roomImage : undefined
        });
        
      } catch (err: any) {
        console.error('Error fetching review:', err);
        setError(err.message || 'Failed to load review');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReview();
  }, [reviewId, isAuthenticated, router]);

  // Currently we're passing the image URLs directly
  // In a real implementation, we would upload the images to a server first
  const handleAddImage = (url: string) => {
    if (images.length < 5) {
      setImages([...images, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!title.trim()) {
      setError('Please enter a review title');
      return;
    }
    
    if (!comment.trim()) {
      setError('Please enter your review comment');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await updateReview(reviewId, {
        rating,
        title,
        comment,
        images,
      });
      
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/reviews');
      }, 2000);
      
    } catch (err: any) {
      console.error('Failed to update review:', err);
      setError(err.message || 'Failed to update review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-[#1C3F32] mb-4">Edit Review</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
          <Link 
            href="/reviews" 
            className="inline-flex items-center text-[#1C3F32] hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Back to My Reviews
          </Link>
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <FaStar className="text-3xl text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#1C3F32] mb-2">Review Updated!</h3>
            <p className="text-gray-600 mb-6">
              Your review has been updated and is pending approval. We appreciate your feedback!
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Redirecting you to your reviews...
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link 
          href="/reviews" 
          className="inline-flex items-center text-[#1C3F32] hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to My Reviews
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-[#1C3F32] mb-4">Edit Review</h1>
        
        <div className="mb-6 flex items-center">
          <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
            <SafeImage
              src={roomInfo.image}
              alt={roomInfo.title}
              width={64}
              height={64}
              imageType="room"
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h2 className="font-bold text-xl">{roomInfo.title}</h2>
            <p className="text-gray-600">{roomInfo.category}</p>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl focus:outline-none"
                >
                  <FaStar 
                    className={`
                      ${(hoverRating || rating) >= star 
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                      }
                      hover:text-yellow-400 transition-colors
                    `}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {rating > 0 ? (
                  ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]
                ) : 'Select a rating'}
              </span>
            </div>
          </div>
          
          {/* Review Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Review Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32]"
              placeholder="Summarize your experience in a few words"
            />
          </div>
          
          {/* Review Comment */}
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              maxLength={500}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32]"
              placeholder="Tell others about your experience"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">{500 - comment.length} characters remaining</p>
          </div>
          
          {/* Image Upload (mock functionality) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Add Photos (optional)</label>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20">
                  <img src={img} alt={`Review image ${idx+1}`} className="w-full h-full object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              ))}
              
              {images.length < 5 && (
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleAddImage(`https://source.unsplash.com/random/200x200?sig=${Math.random()}`)}
                    className="text-gray-500 flex flex-col items-center"
                  >
                    <FaImage className="mb-1" />
                    <span className="text-xs">Add</span>
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">You can add up to 5 photos</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/reviews"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#1C3F32] text-white rounded-md hover:bg-[#1C3F32]/90 transition-colors disabled:opacity-70 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
        <p><strong>Note:</strong> Editing your review will send it back for approval. It may take some time before your updated review appears on the site.</p>
      </div>
    </div>
  );
} 