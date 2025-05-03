"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="flex w-full">
      {/* Left form section */}
      <div className="flex flex-col w-full md:w-1/2 p-8 lg:p-12 justify-center">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-brand-green text-2xl font-medium mb-2">Login.</h1>
          <p className="text-sm text-gray-700 mb-6">
            Don't have an account? <Link href="/register" className="text-brand-green hover:underline">Sign up</Link>
          </p>

          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                id="email"
                className="w-full p-2 text-brand-green border border-brand-green rounded focus:outline-none focus:ring-1 focus:ring-brand-green"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full p-2 text-brand-green border border-brand-green rounded focus:outline-none focus:ring-1 focus:ring-brand-green"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-5 h-5 text-gray-500" />
                  ) : (
                    <FaEye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 border border-brand-green rounded accent-green-700"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-brand-green hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-brand-green hover:bg-brand-green-hover text-white font-medium rounded transition"
            >
              Sign In <span className="text-xl">→</span>
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-600 text-sm">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div className="space-y-3">
            <button className="text-brand-green w-full flex items-center justify-center gap-2 py-2 px-4 border border-brand-green rounded transition hover:bg-gray-50">
              <FcGoogle className="text-xl" />
              <span>Sign in with Google</span>
            </button>
            <button className="text-brand-green w-full flex items-center justify-center gap-2 py-2 px-4 border border-brand-green rounded transition hover:bg-gray-50">
              <FaFacebook className="text-xl text-blue-600" />
              <span>Sign in with Facebook</span>
            </button>
          </div>
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
                      e.currentTarget.src ="https://res.cloudinary.com/ddnxfpziq/image/upload/v1744609832/Vintage_and_Luxury_Hotel_Decorative_Ornamental_Logo_3_jm9wzq.png";

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