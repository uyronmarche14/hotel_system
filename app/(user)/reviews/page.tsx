"use client";

import { useState, useEffect } from "react";
import { getUserReviews, deleteReview, Review } from "@/app/lib/reviewService";
import { useAuth } from "@/app/context/AuthContext";
import { FaStar, FaRegStar, FaPencilAlt, FaTrash, FaRegClock } from "react-icons/fa";
import Link from "next/link";
import SafeImage from "@/app/components/ui/SafeImage";
import { format } from "date-fns";

export default function UserReviewsPage() {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserReviews();
    }
  }, [isAuthenticated, currentPage]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const data = await getUserReviews(currentPage, 5);
      setReviews(data.reviews);
      setTotalPages(data.pagination.totalPages);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching user reviews:", err);
      setError("Failed to load your reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const confirmDelete = (reviewId: string) => {
    setDeleteConfirm(reviewId);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      setIsDeleting(true);
      await deleteReview(reviewId);
      setReviews(reviews.filter(review => review._id !== reviewId));
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error("Error deleting review:", err);
      setError("Failed to delete review. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
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

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  // Get room image from booking
  const getRoomImage = (review: Review): string => {
    if (typeof review.booking === 'object' && review.booking !== null) {
      return (review.booking as any).roomImage || '';
    }
    return '';
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-[#1C3F32] mb-6">My Reviews</h1>
        <p className="mb-6">You need to be logged in to view your reviews.</p>
        <Link 
          href="/login?redirect=/reviews" 
          className="bg-[#1C3F32] text-white px-6 py-2 rounded-md hover:bg-[#15332a] transition-colors"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1C3F32] mb-6">My Reviews</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <FaStar className="text-2xl text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No Reviews Yet</h2>
          <p className="text-gray-500 mb-6">
            You haven't submitted any reviews for your stays yet.
          </p>
          <Link 
            href="/bookings" 
            className="bg-[#1C3F32] text-white px-6 py-2 rounded-md hover:bg-[#15332a] transition-colors"
          >
            View Your Bookings
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#1C3F32] mb-1">{review.title}</h2>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        Posted on {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link 
                      href={`/reviews/edit/${review._id}`}
                      className="p-2 text-gray-600 hover:text-[#1C3F32] transition-colors"
                    >
                      <FaPencilAlt />
                    </Link>
                    <button 
                      onClick={() => confirmDelete(review._id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{review.comment}</p>

                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {review.images.map((image, idx) => (
                      <div key={idx} className="w-20 h-20 rounded-md overflow-hidden">
                        <SafeImage
                          src={image}
                          alt={`Review image ${idx+1}`}
                          width={80}
                          height={80}
                          imageType="general"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                      <SafeImage
                        src={getRoomImage(review)}
                        alt="Room"
                        width={48}
                        height={48}
                        imageType="room"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{review.roomTitle}</div>
                      <div className="text-sm text-gray-500">{review.roomCategory}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <FaRegClock className="mr-1" />
                    <span>
                      {review.status === 'approved' 
                        ? 'Approved' 
                        : review.status === 'rejected'
                        ? 'Rejected'
                        : 'Pending Approval'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Delete Confirmation */}
              {deleteConfirm === review._id && (
                <div className="bg-red-50 p-4 border-t border-red-100">
                  <p className="text-red-700 mb-3">Are you sure you want to delete this review?</p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={cancelDelete}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          Deleting...
                        </>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

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
        </div>
      )}
    </div>
  );
} 