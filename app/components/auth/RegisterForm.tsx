"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
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
  
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });
  
  const { register, loading, error } = useAuth();
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
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...formErrors };
    
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
    
    setFormErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await register(
      `${formData.firstName} ${formData.lastName}`,
      formData.email,
      formData.password,
      formData.confirmPassword,
      redirectUrl || undefined
    );
    
    // No need to handle navigation here, it's now handled in the register function
  };

  return (
    <div className="w-full">
      <h1 className="text-brand-green text-3xl font-medium mb-2">Create an account.</h1>
      <p className="text-sm text-gray-700 mb-8">
        Already have an account? <Link href={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"} className="text-brand-green font-medium hover:underline">Sign in</Link>
      </p>

      {redirectUrl && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md">
          You'll be redirected to complete your booking after registration.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
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
              className={`w-full p-3 border ${formErrors.firstName ? 'border-red-500' : 'border-brand-green'} rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green`}
              placeholder="John"
            />
            {formErrors.firstName && <p className="mt-1 text-xs text-red-500">{formErrors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm text-gray-700 mb-1">Last name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full p-3 border ${formErrors.lastName ? 'border-red-500' : 'border-brand-green'} rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green`}
              placeholder="Doe"
            />
            {formErrors.lastName && <p className="mt-1 text-xs text-red-500">{formErrors.lastName}</p>}
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
            className={`w-full p-3 border ${formErrors.email ? 'border-red-500' : 'border-brand-green'} rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green`}
            placeholder="your@email.com"
          />
          {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
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
              className={`w-full p-3 border ${formErrors.password ? 'border-red-500' : 'border-brand-green'} rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green`}
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
          {formErrors.password && <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-1">Confirm password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full p-3 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-brand-green'} rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green`}
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
          {formErrors.confirmPassword && <p className="mt-1 text-xs text-red-500">{formErrors.confirmPassword}</p>}
        </div>

        {/* Terms and Conditions */}
        <div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={() => {
                  setAgreeTerms(!agreeTerms);
                  if (formErrors.terms) {
                    setFormErrors({
                      ...formErrors,
                      terms: "",
                    });
                  }
                }}
                className="w-4 h-4 rounded border-gray-300 accent-green-700"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-700">
                I agree to the <a href="/terms" className="text-brand-green hover:underline">Terms and Conditions</a> and <a href="/privacy" className="text-brand-green hover:underline">Privacy Policy</a>
              </label>
              {formErrors.terms && <p className="mt-1 text-xs text-red-500">{formErrors.terms}</p>}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 bg-brand-green hover:bg-brand-green-hover text-white font-medium rounded-md transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <div className="text-center mt-4">
          <Link 
            href={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"} 
            className="inline-flex items-center text-brand-green hover:underline"
          >
            <FaArrowLeft className="mr-2 text-xs" /> Back to login
          </Link>
        </div>
      </form>
    </div>
  );
} 