"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUsers, FaCalendarAlt, FaBed, FaMoneyBillWave } from 'react-icons/fa';
import AdminLayout from '@/app/components/layouts/AdminLayout';
import { API_URL } from '@/app/lib/constants';
import Cookies from 'js-cookie';

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  activeBookings: number;
  totalRooms: number;
  recentBookings: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = () => {
      const user = localStorage.getItem('user');
      if (!user || !Cookies.get('token')) {
        router.push('/admin-login');
        return false;
      }
      
      try {
        const userData = JSON.parse(user);
        if (userData.role !== 'admin') {
          router.push('/admin-login');
          return false;
        }
        return true;
      } catch (e) {
        router.push('/admin-login');
        return false;
      }
    };

    const fetchDashboardStats = async () => {
      if (!checkAdminAuth()) return;
      
      try {
        const response = await fetch(`${API_URL}/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            router.push('/admin-login');
            return;
          }
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setStats(data.data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [router]);

  // Stat card component to avoid repetition
  const StatCard = ({ title, value, icon, color }: { title: string, value: number | string, icon: React.ReactNode, color: string }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
      <div className={`rounded-full p-4 mr-4 ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1C3F32]"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200 mb-4">
          {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Users" 
            value={stats?.totalUsers || 0} 
            icon={<FaUsers className="text-white text-xl" />} 
            color="bg-blue-500"
          />
          
          <StatCard 
            title="Active Bookings" 
            value={stats?.activeBookings || 0} 
            icon={<FaCalendarAlt className="text-white text-xl" />} 
            color="bg-green-500"
          />
          
          <StatCard 
            title="Total Rooms" 
            value={stats?.totalRooms || 0} 
            icon={<FaBed className="text-white text-xl" />} 
            color="bg-purple-500"
          />
          
          <StatCard 
            title="Total Revenue" 
            value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`} 
            icon={<FaMoneyBillWave className="text-white text-xl" />} 
            color="bg-yellow-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="mb-4">
            <p className="text-gray-600"><span className="font-medium">{stats?.recentBookings || 0}</span> new bookings in the last 30 days</p>
            <p className="text-gray-600"><span className="font-medium">{stats?.totalBookings || 0}</span> total bookings</p>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => router.push('/admin/bookings')}
              className="px-4 py-2 bg-[#1C3F32] text-white rounded hover:bg-[#1C3F32]/90 transition"
            >
              View All Bookings
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 