"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FaKey, FaUser, FaLock } from "react-icons/fa";
import Link from "next/link";
import Cookies from "js-cookie";
import Image from "next/image";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const logo =
    "https://res.cloudinary.com/ddnxfpziq/image/upload/v1746767008/preview__1_-removebg-preview_xrlzgr.png";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!username.trim()) {
        throw new Error("Username is required");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      // Use the direct API route to avoid the proxy (fix for JSON parse issue)
      const response = await fetch(`/api/auth/admin-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      // Check for non-JSON responses
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        console.error("Server returned non-JSON response");
        throw new Error("Server error. Please try again later.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid credentials. Please try again.",
        );
      }

      // Store token in cookies
      Cookies.set("token", data.token, { expires: 7 });

      // Store admin user in localStorage with secure info
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data.user,
          isAdmin: true,
          isAuthenticated: true,
        }),
      );

      // Redirect to admin dashboard
      router.push("/admin/dashboard");
    } catch (error: Error | unknown) {
      console.error("Admin login error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to log in. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-pattern">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Image
              src={logo}
              alt="Hotel Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600">
            Enter your credentials to access the dashboard
          </p>
          <p className="text-sm mt-2 text-gray-500">
            Default: admin / admin123
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border-l-4 border-red-600 flex items-start">
            <FaLock className="mr-3 mt-1 text-red-600 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-gray-700"
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaKey className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-gray-700"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1C3F32] text-white py-3 px-4 rounded-md hover:bg-[#1C3F32]/90 focus:outline-none focus:ring-2 focus:ring-[#1C3F32] focus:ring-offset-2 transition duration-200 flex items-center justify-center font-medium"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              "Login to Dashboard"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-[#1C3F32] hover:underline text-sm font-medium"
          >
            Return to guest login
          </Link>
        </div>
      </div>
    </div>
  );
}
