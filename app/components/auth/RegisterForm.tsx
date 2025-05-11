"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/app/context/AuthContext";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
    general: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get redirect URL from query params
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      setRedirectUrl(redirect);
    }
  }, [searchParams]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }
    
    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    
    // Validate terms agreement
    if (!agreeTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await register(
        `${formData.firstName} ${formData.lastName}`,
        formData.email,
        formData.password,
        redirectUrl || undefined
      );
      
      if (!success) {
        setErrors({
          ...errors,
          general: "Registration failed. Please try again.",
        });
      }
      // No need to handle navigation here, it's now handled in the register function
    } catch (err) {
      setErrors({
        ...errors,
        general: "An error occurred during registration.",
      });
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
          <h1 className="text-brand-green text-3xl font-medium mb-2">Create an account.</h1>
          <p className="text-sm text-gray-700 mb-8">
            Already have an account? <Link href={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"} className="text-brand-green font-medium hover:underline">Sign in</Link>
          </p>

          {redirectUrl && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md">
              You'll be redirected to complete your booking after registration.
            </div>
          )}

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {errors.general}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm text-gray-700 mb-1">First name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${errors.firstName ? 'border-red-500' : 'border-brand-green'} rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green`}
                  placeholder="John"
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm text-gray-700 mb-1">Last name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${errors.lastName ? 'border-red-500' : 'border-brand-green'} rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-brand-green'} rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-brand-green'} rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green`}
                  placeholder="••••••••"
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
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-brand-green'} rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green`}
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="w-5 h-5 text-gray-500" />
                  ) : (
                    <FaEye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                  className="w-4 h-4 border border-brand-green rounded accent-green-700"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the <a href="#" className="text-brand-green hover:underline">Terms and Conditions</a> and <a href="#" className="text-brand-green hover:underline">Privacy Policy</a>
                </label>
                {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center gap-2 py-3 px-4 bg-brand-green hover:bg-brand-green-hover text-white font-medium rounded-md transition ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-600 text-sm">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div className="space-y-4">
            <button type="button" className="text-brand-green w-full flex items-center justify-center gap-2 py-3 px-4 border border-brand-green rounded-md transition hover:bg-gray-50">
              <FcGoogle className="text-xl" />
              <span>Sign up with Google</span>
            </button>
            <button type="button" className="text-brand-green w-full flex items-center justify-center gap-2 py-3 px-4 border border-brand-green rounded-md transition hover:bg-gray-50">
              <FaFacebook className="text-xl text-blue-600" />
              <span>Sign up with Facebook</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"} className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-brand-green font-medium rounded-md transition">
              <FaArrowLeft className="text-sm" /> Back to Login
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