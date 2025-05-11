"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to request password reset
    setIsSubmitted(true);
  };

  return (
    <div className="w-full flex flex-col md:flex-row h-full">
      {/* Left form section */}
      <div className="flex flex-col w-full md:w-1/2 p-4 md:p-8 lg:p-12 justify-center bg-white">
        <div className="max-w-xl w-full mx-auto">
          {!isSubmitted ? (
            <>
              <h1 className="text-brand-green text-3xl font-medium mb-2">Reset Password.</h1>
              <p className="text-sm text-gray-700 mb-8">
                Enter your email address, and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 text-brand-green border border-brand-green rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green"
                    placeholder="your@email.com"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-brand-green hover:bg-brand-green-hover text-white font-medium rounded-md transition"
                >
                  Send Reset Link <span className="text-xl">→</span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="bg-green-100 p-8 rounded-lg mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h2 className="text-xl font-medium text-green-800 mb-2">Check your email</h2>
                <p className="text-green-700">We've sent a password reset link to {email}</p>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Didn't receive the email? Check your spam folder or{" "}
                <button 
                  onClick={() => setIsSubmitted(false)} 
                  className="text-brand-green hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/login" className="text-brand-green hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>

      {/* Right image section */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <Image
              src="https://res.cloudinary.com/ddnxfpziq/image/upload/v1745569291/Image_ux4eej.png" 
              alt="The Solace Manor"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white text-center">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-md">
                <h2 className="text-2xl font-cinzel mb-2">THE SOLACE MANOR</h2>
                <p className="text-sm opacity-80">Experience luxury beyond comparison</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 