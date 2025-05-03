"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would make an API call to send a password reset email
    setEmailSent(true);
  };

  return (
    <div className="flex w-full">
      {/* Left form section */}
      <div className="flex flex-col w-full md:w-1/2 p-8 lg:p-12 justify-center">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-brand-green text-2xl font-medium mb-2">Reset your password</h1>
          <p className="text-sm text-gray-700 mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {!emailSent ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 text-brand-green border border-brand-green rounded focus:outline-none focus:ring-1 focus:ring-brand-green"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-brand-green hover:bg-brand-green-hover text-white font-medium rounded transition"
              >
                Send reset link <span className="text-xl">→</span>
              </button>

              <div className="text-center mt-4">
                <Link href="/login" className="text-sm text-brand-green hover:underline">
                  Return to login
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-brand-green rounded-md">
                <p className="text-brand-green">
                  If an account exists with this email, we've sent a password reset link. Please check your inbox.
                </p>
              </div>
              
              <div className="text-center mt-6">
                <Link 
                  href="/login" 
                  className="text-brand-green hover:underline font-medium"
                >
                  Return to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right image section */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0 flex flex-col">
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src="https://res.cloudinary.com/ddnxfpziq/image/upload/v1745569291/Image_ux4eej.png" 
              alt="The Anetos Palace"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white text-center">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded">
                <div className="flex justify-center mb-3">
                  <img 
                    src="/logo.png" 
                    alt="Anetos Palace Logo" 
                    className="h-16 w-16"
                    onError={(e) => {
                      e.currentTarget.src = "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744609832/Vintage_and_Luxury_Hotel_Decorative_Ornamental_Logo_3_jm9wzq.png";
                    }}
                  />
                </div>
                <h2 className="text-2xl font-cinzel mb-2">THE ANETOS PALACE</h2>
                <p className="text-sm opacity-80">Experience luxury beyond comparison</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 