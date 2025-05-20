"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaUsers,
  FaCalendarAlt,
  FaBed,
  FaMoneyBillWave,
  FaChartLine,
} from "react-icons/fa";
import AdminLayout from "@/app/components/layouts/AdminLayout";
import Cookies from "js-cookie";
import { getAdminToken } from "@/app/services/adminService";

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  activeBookings: number;
  totalRooms: number;
  recentBookings: number;
  totalRevenue: number;
}

interface ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;
  code?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalRooms: 0,
    recentBookings: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = () => {
      const user = localStorage.getItem("user");
      if (!user || !getAdminToken()) {
        router.push("/admin-login");
        return false;
      }

      try {
        const userData = JSON.parse(user);
        if (userData.role !== "admin") {
          router.push("/admin-login");
          return false;
        }
        return true;
      } catch {
        router.push("/admin-login");
        return false;
      }
    };

    const fetchDashboardStats = async () => {
      if (!checkAdminAuth()) return;

      try {
        setIsLoading(true);
        setError(null);
        
        const token = getAdminToken();
        const response = await fetch("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            router.push("/admin-login");
            return;
          }

          const data = await response.json();
          const error = new Error(
            data.message || "Failed to fetch dashboard stats",
          ) as ApiError;
          error.status = response.status;
          error.errors = data.errors;
          throw error;
        }

        // Use direct fetch to debug endpoint if needed
        const data = await response.json();
        console.log('Dashboard API response:', data);

        // Safely extract data from various possible response formats
        if (data?.data) {
          // Format: { success: true, data: { ... } }
          console.log('Using data from standard response format');
          setStats(data.data);
        } else if (data?.dashboard) {
          // Format: { success: true, dashboard: { ... } }
          console.log('Transforming dashboard data format');
          setStats({
            totalUsers: data.dashboard.totalUsers || 0,
            totalBookings: data.dashboard.totalBookings || 0,
            activeBookings: data.dashboard.statusCounts?.confirmed || 0,
            totalRooms: data.dashboard.totalRooms || 0,
            recentBookings: data.dashboard.recentBookings?.length || 0,
            totalRevenue: data.dashboard.totalRevenue || 0,
          });
        } else if (data?.success === false) {
          // Error response
          throw new Error(data.message || "Failed to fetch dashboard data");
        } else {
          // Attempt to use the data directly, or fallback to defaults
          console.warn('Using direct data or default values');
          setStats({
            totalUsers: data?.totalUsers || 0,
            totalBookings: data?.totalBookings || 0,
            activeBookings: data?.activeBookings || 0,
            totalRooms: data?.totalRooms || 0,
            recentBookings: data?.recentBookings || 0,
            totalRevenue: data?.totalRevenue || 0,
          });
        }
      } catch (err) {
        console.error("Dashboard stats fetch error:", err);
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [router]);

  // Format number as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1C3F32]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Users Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaUsers className="text-xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Total Users
                </h2>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalUsers}
                </p>
              </div>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaCalendarAlt className="text-xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Total Bookings
                </h2>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalBookings}
                </p>
              </div>
            </div>
          </div>

          {/* Active Bookings Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FaCalendarAlt className="text-xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Active Bookings
                </h2>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.activeBookings}
                </p>
              </div>
            </div>
          </div>

          {/* Rooms Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaBed className="text-xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Total Rooms
                </h2>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalRooms}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Bookings Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <FaChartLine className="text-xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Recent Bookings
                </h2>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.recentBookings}
                </p>
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-[#e9f5f0] text-[#1C3F32]">
                <FaMoneyBillWave className="text-xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Total Revenue
                </h2>
                <p className="text-3xl font-bold text-gray-800">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}