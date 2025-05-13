import { API_URL } from "./constants";
import Cookies from "js-cookie";

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    profilePic?: string;
  };
  booking: string | {
    _id: string;
    bookingId: string;
    checkIn: string;
    checkOut: string;
    roomImage?: string;
  };
  roomCategory: string;
  roomTitle: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  likes: number;
  status: 'pending' | 'approved' | 'rejected';
  stayDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  averageRating: number;
  ratingDistribution: {
    [key: number]: number;
  }
}

export interface PaginatedReviews {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
  };
  stats?: ReviewStats;
}

export interface CreateReviewData {
  bookingId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
}

// Get headers with authentication token
const getHeaders = () => {
  const token = Cookies.get('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Get reviews for a specific room
export const getRoomReviews = async (
  category: string,
  title: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedReviews> => {
  try {
    const response = await fetch(
      `${API_URL}/api/reviews/room/${encodeURIComponent(category)}/${encodeURIComponent(title)}?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching reviews: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch room reviews:', error);
    throw error;
  }
};

// Get reviews created by the current user
export const getUserReviews = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedReviews> => {
  try {
    const response = await fetch(
      `${API_URL}/api/reviews/user?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching user reviews: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch user reviews:', error);
    throw error;
  }
};

// Create a new review
export const createReview = async (
  reviewData: CreateReviewData
): Promise<Review> => {
  try {
    const response = await fetch(`${API_URL}/api/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error creating review: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to create review:', error);
    throw error;
  }
};

// Update an existing review
export const updateReview = async (
  reviewId: string,
  reviewData: UpdateReviewData
): Promise<Review> => {
  try {
    const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error updating review: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update review:', error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error deleting review: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to delete review:', error);
    throw error;
  }
}; 