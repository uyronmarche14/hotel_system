"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaCheckCircle,
  FaTimes,
  FaUserShield,
} from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";

function LoginFormContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { login, loading, error } = useAuth();
  const searchParams = useSearchParams();

  // Get redirect URL, session expired flag, and registration success flag from query params
  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect) {
      setRedirectUrl(redirect);
    }

    const expired = searchParams.get("session_expired");
    if (expired === "true") {
      setSessionExpired(true);
    }

    const registrationSuccess = searchParams.get("registration_success");
    if (registrationSuccess === "true") {
      setShowSuccessModal(true);

      // Remove the registration_success parameter from URL to avoid showing
      // the modal again if the page is refreshed
      const url = new URL(window.location.href);
      url.searchParams.delete("registration_success");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log(`Submitting login form for: ${email}`);

      // Skip validation if already logged in or fields already filled out
      if (email && password) {
        // Pass the redirectUrl to the login function
        const success = await login(email, password, redirectUrl || undefined);

        console.log(`Login attempt result: ${success ? "Success" : "Failed"}`);

        if (success) {
          console.log(
            `Login successful, redirecting to: ${redirectUrl || "/dashboard"}`,
          );
        }
      } else {
        // Validation only if needed
        if (!email.trim()) {
          console.error("Email is required");
        }

        if (!password) {
          console.error("Password is required");
        }
      }
    } catch (error) {
      console.error("Error during login form submission:", error);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      {/* Registration Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={closeSuccessModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-brand-green mb-2">
                Registration Successful!
              </h3>
              <p className="text-gray-600 mb-4">
                Congratulations! Your account has been created successfully. You
                can now log in with your credentials.
              </p>
              <button
                onClick={closeSuccessModal}
                className="w-full py-3 bg-brand-green text-white rounded-md hover:bg-brand-green-hover transition-colors"
              >
                Continue to Login
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        <h1 className="text-brand-green text-3xl font-medium mb-2">Login.</h1>
        <p className="text-sm text-gray-800 mb-8">
          Don&apos;t have an account?{" "}
          <Link
            href={
              redirectUrl
                ? `/register?redirect=${encodeURIComponent(redirectUrl)}`
                : "/register"
            }
            className="text-brand-green font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>

        {sessionExpired && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-md">
            Your session has expired or you were logged out. Please log in again
            to continue.
          </div>
        )}

        {redirectUrl && !sessionExpired && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md">
            You&apos;ll be redirected to complete your booking after login.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 text-gray-900 border border-brand-green rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green"
              placeholder="your@email.com" style={{color: '#333333'}}
              required
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 text-gray-900 border border-brand-green rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green"
                placeholder="••••••••" style={{color: '#333333'}}
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
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm font-medium text-gray-800"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-brand-green hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-3 px-4 bg-brand-green hover:bg-brand-green-hover text-white font-medium rounded-md transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}{" "}
            {!loading && <span className="text-xl">→</span>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          <Link
            href={
              redirectUrl
                ? `/register?redirect=${encodeURIComponent(redirectUrl)}`
                : "/register"
            }
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-brand-green font-medium rounded-md transition"
          >
            New user? Create an account <FaArrowRight className="text-sm" />
          </Link>

          <Link
            href="/admin-login"
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-md transition"
          >
            <FaUserShield className="text-lg" /> Admin Login
          </Link>
        </div>
      </div>
    </>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1C3F32]"></div></div>}>
      <LoginFormContent />
    </Suspense>
  );
}
