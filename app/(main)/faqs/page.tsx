"use client";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

const FAQPage = () => {
  // State to track which FAQ items are expanded
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  // Toggle FAQ expansion
  const toggleItem = (index: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // FAQ data organized by categories
  const faqItems: FAQItem[] = [
    // Booking Issues
    {
      question: "Why can't I book a room for my selected dates?",
      answer: "This may happen if all rooms are fully booked for your selected dates, or if there's a minimum stay requirement that your booking doesn't meet. Try selecting different dates or contact our support team for assistance.",
      category: "Booking Issues"
    },
    {
      question: "I received an error during the booking process. What should I do?",
      answer: "If you encounter an error during booking, please try refreshing the page and attempting your booking again. If the problem persists, clear your browser cache or try using a different browser. For continued issues, please contact our support team with details of the error.",
      category: "Booking Issues"
    },
    {
      question: "Can I modify my booking after confirmation?",
      answer: "Yes, you can modify your booking by logging into your account and navigating to 'My Bookings'. Depending on your room's policy, modifications might incur additional charges. Changes are subject to availability.",
      category: "Booking Issues"
    },

    // Payment Problems
    {
      question: "My payment was declined. What should I do?",
      answer: "Payment declines can happen for various reasons including insufficient funds, card restrictions, or security measures by your bank. Please verify your card details, ensure you have sufficient funds, and that your card is enabled for online transactions. If problems persist, contact your bank or use an alternative payment method.",
      category: "Payment Problems"
    },
    {
      question: "When will my credit card be charged?",
      answer: "Most bookings require an immediate pre-authorization to confirm your reservation. The actual charge may appear on your statement immediately or within a few days, depending on your bank's processing time. Some bookings may only be charged upon check-in or check-out according to the rate policy.",
      category: "Payment Problems"
    },
    {
      question: "How do I get a receipt for my booking?",
      answer: "A booking confirmation with payment details is automatically sent to your email after completing a reservation. You can also find and download receipts from the 'Booking History' section in your account. If you need a formal invoice, please contact our customer service.",
      category: "Payment Problems"
    },

    // System Issues
    {
      question: "The website is slow or unresponsive. How can I fix this?",
      answer: "If you're experiencing slow performance, try refreshing the page, clearing your browser cache, or using a different browser. Check your internet connection, as slow connections can affect site performance. If problems persist, please report the issue to our support team.",
      category: "System Issues"
    },
    {
      question: "Images aren't loading on the room details page. What's wrong?",
      answer: "Image loading issues may be due to slow internet connections or temporary server problems. Try refreshing the page or clearing your browser cache. If images still won't load, you can contact our support team with details of the specific room you're trying to view.",
      category: "System Issues"
    },
    {
      question: "I can't log in to my account. How do I fix this?",
      answer: "If you're having trouble logging in, first check that you're using the correct email and password. You can use the 'Forgot Password' option to reset your password. Make sure cookies are enabled in your browser. If problems persist, contact our support team for assistance.",
      category: "System Issues"
    },

    // Cancellation & Refunds
    {
      question: "What is your cancellation policy?",
      answer: "Our cancellation policy varies depending on the room type and rate you've booked. Generally, cancellations made at least 48 hours before check-in receive a full refund. Cancellations made within 48 hours may be subject to a one-night charge. Always check the specific cancellation policy attached to your booking.",
      category: "Cancellation & Refunds"
    },
    {
      question: "How long does it take to process a refund?",
      answer: "After a cancellation is approved, refunds typically process within 5-10 business days. The actual time it takes for the funds to appear in your account depends on your bank or credit card company's processing times, which can be up to 30 days in some cases.",
      category: "Cancellation & Refunds"
    },
    {
      question: "Can I cancel just part of my stay?",
      answer: "Partial cancellations are possible but subject to our modification policy. Please contact our customer service directly to arrange a partial cancellation, as this option might not be available through the online system.",
      category: "Cancellation & Refunds"
    },

    // Room Features & Amenities
    {
      question: "Do all rooms have Wi-Fi?",
      answer: "Yes, complimentary high-speed Wi-Fi is available in all rooms and public areas of our hotel. Connection details are provided upon check-in.",
      category: "Room Features & Amenities"
    },
    {
      question: "Are pets allowed in the hotel?",
      answer: "We have select pet-friendly rooms available for an additional fee. Pets must be pre-registered before arrival. Please contact us directly to arrange pet accommodation and to review our pet policy.",
      category: "Room Features & Amenities"
    },
    {
      question: "Is breakfast included with my stay?",
      answer: "Breakfast inclusion depends on the rate you've booked. Please check your booking confirmation to see if breakfast is included. If not, you can add breakfast to your stay during the booking process or upon check-in.",
      category: "Room Features & Amenities"
    }
  ];

  // Get unique categories from the FAQ items
  const categories = Array.from(new Set(faqItems.map(item => item.category)));

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-[#1C3F32] mb-8 text-center">Frequently Asked Questions</h1>
      <p className="text-gray-600 mb-12 text-center max-w-3xl mx-auto">
        Find answers to common questions about our hotel booking system, payments, and services. If you can't find what you're looking for, please contact our support team.
      </p>

      {/* FAQ Categories */}
      <div className="mb-16">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-10">
            <h2 className="text-2xl font-semibold text-[#1C3F32] mb-6 border-b border-gray-200 pb-2">{category}</h2>
            <div className="space-y-4">
              {faqItems
                .filter(item => item.category === category)
                .map((item, index) => {
                  const actualIndex = categoryIndex * 100 + index; // Create a unique index for each FAQ item
                  return (
                    <div 
                      key={actualIndex} 
                      className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                    >
                      <button
                        onClick={() => toggleItem(actualIndex)}
                        className={`w-full flex justify-between items-center p-4 text-left font-medium focus:outline-none ${expandedItems[actualIndex] ? 'bg-[#1C3F32] text-white' : 'bg-white text-gray-800'}`}
                      >
                        <span>{item.question}</span>
                        <span className="ml-2">
                          {expandedItems[actualIndex] ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                      </button>
                      {expandedItems[actualIndex] && (
                        <div className="p-4 bg-white border-t border-gray-200">
                          <p className="text-gray-700">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Support Section */}
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-semibold text-[#1C3F32] mb-4">Still Have Questions?</h2>
        <p className="text-gray-600 mb-6">Our support team is here to help you with any questions or issues you might encounter.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="mailto:support@yourhotel.com" 
            className="inline-block bg-[#1C3F32] hover:bg-[#15332a] text-white px-6 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#1C3F32] focus:ring-opacity-50"
          >
            Email Support
          </a>
          <a 
            href="tel:+123456789" 
            className="inline-block bg-white border border-[#1C3F32] text-[#1C3F32] hover:bg-gray-100 px-6 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#1C3F32] focus:ring-opacity-50"
          >
            Call Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
