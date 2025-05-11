"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get redirect URL from query params
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      setRedirectUrl(redirect);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Pass the redirectUrl to the login function
      const success = await login(email, password, redirectUrl || undefined);
      
      if (!success) {
        setError("Invalid email or password");
      }
      // No need to handle navigation here, the login function now handles it
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row h-full">
      {/* Left form section */}
      <div className="flex flex-col w-full md:w-1/2 p-4 md:p-8 lg:p-12 justify-center bg-white">
        <div className="max-w-xl w-full mx-auto">
          <h1 className="text-brand-green text-3xl font-medium mb-2">Login.</h1>
          <p className="text-sm text-gray-700 mb-8">
            Don't have an account? <Link href={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"} className="text-brand-green font-medium hover:underline">Sign up</Link>
          </p>

          {redirectUrl && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md">
              You'll be redirected to complete your booking after login.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 text-brand-green border border-brand-green rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 text-brand-green border border-brand-green rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green"
                  placeholder="••••••••"
                  required
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
              disabled={isLoading}
              className={`w-full flex justify-center items-center gap-2 py-3 px-4 bg-brand-green hover:bg-brand-green-hover text-white font-medium rounded-md transition ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Signing in..." : "Sign In"} {!isLoading && <span className="text-xl">→</span>}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-600 text-sm">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div className="space-y-4">
            <button 
              type="button" 
              className="text-brand-green w-full flex items-center justify-center gap-2 py-3 px-4 border border-brand-green rounded-md transition hover:bg-gray-50"
            >
              <FcGoogle className="text-xl" />
              <span>Sign in with Google</span>
            </button>
            <button 
              type="button" 
              className="text-brand-green w-full flex items-center justify-center gap-2 py-3 px-4 border border-brand-green rounded-md transition hover:bg-gray-50"
            >
              <FaFacebook className="text-xl text-blue-600" />
              <span>Sign in with Facebook</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"} className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-brand-green font-medium rounded-md transition">
              New user? Create an account <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </div>

      {/* Right image section */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <Image
              src="https://res.cloudinary.com/ddnxfpziq/image/upload/v1746813924/2_vkjogl.jpg" 
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