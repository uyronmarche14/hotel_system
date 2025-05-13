'use client';

import { useState, useEffect } from 'react';
import { getDashboardStats, DashboardStats } from '@/app/lib/adminService';
import { FaChartBar, FaChartLine, FaChartPie, FaExclamationTriangle } from 'react-icons/fa';

export default function AdminStatsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        setError('');
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
        setError('Failed to load statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
          <h3 className="text-lg font-medium text-red-800">Error Loading Statistics</h3>
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
        <p className="mt-2 text-gray-600">Unable to load statistics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Hotel Statistics</h1>
      
      {/* Revenue Overview */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <FaChartLine className="text-[#1C3F32] w-5 h-5 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Revenue Overview</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="text-gray-700 font-medium mb-2">This Month</h3>
            <p className="text-2xl font-bold text-[#1C3F32]">{formatCurrency(stats.revenue.thisMonth)}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-gray-700 font-medium mb-2">Last Month</h3>
            <p className="text-2xl font-bold text-blue-700">{formatCurrency(stats.revenue.lastMonth)}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-md">
            <h3 className="text-gray-700 font-medium mb-2">Growth</h3>
            <p className="text-2xl font-bold text-purple-700">+{stats.revenue.growth}%</p>
          </div>
        </div>
        
        {/* Placeholder for Chart - in a real app, you would use a chart library */}
        <div className="mt-6 bg-gray-100 h-64 rounded-md flex items-center justify-center">
          <p className="text-gray-500">Revenue Chart Placeholder</p>
        </div>
      </div>
      
      {/* Booking Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <FaChartBar className="text-[#1C3F32] w-5 h-5 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Booking Analysis</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-gray-700 font-medium mb-1">Total</h3>
            <p className="text-xl font-bold text-gray-800">{stats.bookings.total}</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-md">
            <h3 className="text-gray-700 font-medium mb-1">Pending</h3>
            <p className="text-xl font-bold text-yellow-700">{stats.bookings.pending}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="text-gray-700 font-medium mb-1">Completed</h3>
            <p className="text-xl font-bold text-green-700">{stats.bookings.completed}</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-md">
            <h3 className="text-gray-700 font-medium mb-1">Canceled</h3>
            <p className="text-xl font-bold text-red-700">{stats.bookings.canceled}</p>
          </div>
        </div>
        
        {/* Placeholder for Chart */}
        <div className="mt-6 bg-gray-100 h-64 rounded-md flex items-center justify-center">
          <p className="text-gray-500">Booking Distribution Chart Placeholder</p>
        </div>
      </div>
      
      {/* Room Occupancy */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <FaChartPie className="text-[#1C3F32] w-5 h-5 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Room Occupancy</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="text-gray-700 font-medium mb-2">Available</h3>
            <p className="text-2xl font-bold text-green-700">{stats.rooms.available}</p>
            <p className="text-sm text-gray-500">{Math.round(stats.rooms.available / stats.rooms.total * 100)}% of total</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-gray-700 font-medium mb-2">Occupied</h3>
            <p className="text-2xl font-bold text-blue-700">{stats.rooms.occupied}</p>
            <p className="text-sm text-gray-500">{Math.round(stats.rooms.occupied / stats.rooms.total * 100)}% of total</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-md">
            <h3 className="text-gray-700 font-medium mb-2">Maintenance</h3>
            <p className="text-2xl font-bold text-yellow-700">{stats.rooms.maintenance}</p>
            <p className="text-sm text-gray-500">{Math.round(stats.rooms.maintenance / stats.rooms.total * 100)}% of total</p>
          </div>
        </div>
        
        {/* Placeholder for Chart */}
        <div className="mt-6 bg-gray-100 h-64 rounded-md flex items-center justify-center">
          <p className="text-gray-500">Room Occupancy Chart Placeholder</p>
        </div>
      </div>
    </div>
  );
} 
 