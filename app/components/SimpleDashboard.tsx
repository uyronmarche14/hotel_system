'use client';

import Link from 'next/link';

export default function SimpleDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to The Solace Manor</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="View Rooms" 
          description="Browse our luxurious accommodations"
          link="/hotelRoomDetails/all"
        />
        <DashboardCard 
          title="My Bookings" 
          description="View your booking history"
          link="/bookings/history"
        />
        <DashboardCard 
          title="New Reservation" 
          description="Book a new stay with us"
          link="/bookings/new"
        />
        <DashboardCard 
          title="Services" 
          description="Explore our premium services"
          link="/services"
        />
        <DashboardCard 
          title="Contact Us" 
          description="Get in touch with our staff"
          link="/contact"
        />
        <DashboardCard 
          title="My Profile" 
          description="Manage your account"
          link="/profile"
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, description, link }: { title: string; description: string; link: string }) {
  return (
    <Link href={link}>
      <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 bg-white h-full">
        <h2 className="text-xl font-semibold mb-2 text-[#1C3F32]">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
