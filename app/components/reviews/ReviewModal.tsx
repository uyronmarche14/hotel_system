"use client";

import { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import ReviewForm, { ReviewData } from './ReviewForm';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  roomTitle: string;
  checkOutDate: string;
  onSubmit: (reviewData: ReviewData) => void;
}

const ReviewModal = ({
  isOpen,
  onClose,
  bookingId,
  roomTitle,
  checkOutDate,
  onSubmit
}: ReviewModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  // Handle keyboard navigation and accessibility
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>
        
        <div className="p-6">
          <h2 id="review-modal-title" className="text-2xl font-bold text-black mb-4">
            Rate & Review Your Stay
          </h2>
          
          <ReviewForm
            bookingId={bookingId}
            roomTitle={roomTitle}
            checkOutDate={checkOutDate}
            onSubmit={(data) => {
              onSubmit(data);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
