'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDashboardStats, DashboardStats } from '@/app/lib/adminService';
import { FaUsers, FaBed, FaMoneyBillWave, FaCalendarCheck, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        setError('');
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
        setError('Failed to load dashboard statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg">
        <div className="flex items-center">
          <FaExclamationTriangle className="text-red-500 w-6 h-6 mr-3" />
          <h3 className="text-lg font-medium text-red-800">Error Loading Dashboard</h3>
        </div>
        <div className="mt-2 text-red-700">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900">No data available</h3>
        <p className="mt-2 text-gray-600">Unable to load dashboard statistics.</p>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users Stat */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.users.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaUsers className="text-blue-500 w-6 h-6" />
            </div>
          </div>
          <div className="flex justify-between mt-4 text-sm">
            <span className="text-gray-600">Active this month: {stats.users.activeThisMonth}</span>
            <span className="text-green-600">New: +{stats.users.newThisWeek}</span>
          </div>
        </div>

        {/* Rooms Stat */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.rooms.total}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FaBed className="text-green-500 w-6 h-6" />
            </div>
          </div>
          <div className="flex justify-between mt-4 text-sm">
            <span className="text-gray-600">Available: {stats.rooms.available}</span>
            <span className="text-amber-600">Occupied: {stats.rooms.occupied}</span>
          </div>
        </div>

        {/* Bookings Stat */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.bookings.total}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <FaCalendarCheck className="text-amber-500 w-6 h-6" />
            </div>
          </div>
          <div className="flex justify-between mt-4 text-sm">
            <span className="text-gray-600">Pending: {stats.bookings.pending}</span>
            <span className="text-green-600">Completed: {stats.bookings.completed}</span>
          </div>
        </div>

        {/* Revenue Stat */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.revenue.thisMonth)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaMoneyBillWave className="text-purple-500 w-6 h-6" />
            </div>
          </div>
          <div className="flex justify-between mt-4 text-sm">
            <span className="text-gray-600">Last Month: {formatCurrency(stats.revenue.lastMonth)}</span>
            <span className="text-green-600">Growth: {stats.revenue.growth}%</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/admin/users')}
            className="flex items-center justify-center py-3 px-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FaUsers className="text-blue-500 w-5 h-5 mr-2" />
            <span className="font-medium text-blue-700">Manage Users</span>
          </button>
          <button
            onClick={() => router.push('/admin/rooms')}
            className="flex items-center justify-center py-3 px-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FaBed className="text-green-500 w-5 h-5 mr-2" />
            <span className="font-medium text-green-700">Manage Rooms</span>
          </button>
          <button
            onClick={() => router.push('/admin/stats')}
            className="flex items-center justify-center py-3 px-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <FaMoneyBillWave className="text-amber-500 w-5 h-5 mr-2" />
            <span className="font-medium text-amber-700">View Statistics</span>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-900 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <FaCheckCircle className="text-green-500 w-5 h-5 mr-3" />
            <div>
              <p className="font-medium text-green-700">Database Connection</p>
              <p className="text-sm text-green-600">Healthy</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <FaCheckCircle className="text-green-500 w-5 h-5 mr-3" />
            <div>
              <p className="font-medium text-green-700">API Services</p>
              <p className="text-sm text-green-600">All systems operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
 