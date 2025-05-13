"use client";

import { useEffect, useState } from "react";
import RoomCard from "@/app/components/RoomCard";
import { useAuth } from "@/app/context/AuthContext";
import Navbar from "@/app/components/normal/navbar";
import { getTopRatedRooms, getCategoryRooms, RoomType } from "@/app/services/roomService";
import ErrorToast from "@/app/components/ErrorToast";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Button from "@/app/components/Button";
import { FaSearch } from "react-icons/fa";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [topRatedRooms, setTopRatedRooms] = useState<RoomType[]>([]);
  const [categoryRooms, setCategoryRooms] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showErrorToast, setShowErrorToast] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const [topRated, byCategory] = await Promise.all([
          getTopRatedRooms(5),
          getCategoryRooms()
        ]);
        
        setTopRatedRooms(topRated);
        setCategoryRooms(byCategory);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError("Failed to load room data. Please try again later.");
        setShowErrorToast(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <main className="w-full min-h-screen overflow-x-hidden pt-0">
      {/* Error Toast */}
      <ErrorToast 
        message={error || "An error occurred"}
        isVisible={showErrorToast && error !== null}
        onClose={() => setShowErrorToast(false)}
      />

      {/* Hero Section */}
      <section
        aria-label="Hero section"
        className="w-full h-[400px] sm:h-[500px] md:h-[600px] relative overflow-hidden"
        style={{
          backgroundImage: `url(https://res.cloudinary.com/ddnxfpziq/image/upload/v1746813924/2_vkjogl.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 z-[5]"></div>

        {/* Content */}
        <div className="absolute inset-0 z-[6]">
          <div className="container mx-auto h-full flex items-center px-4">
            <div className="max-w-full sm:max-w-[693px]">
              <h1 className="font-bold text-2xl sm:text-3xl md:text-[40px] text-white mb-4 font-inter leading-tight">
                Discover elegant stays. Book your perfect room with us today
              </h1>
              <p className="text-white text-base sm:text-lg">
                Experience world-class stays in the heart of the Philippines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section 
        aria-label="Search and booking" 
        className="w-full px-4 mx-auto bg-white shadow-md relative z-[20] -mt-8 sm:-mt-16 max-w-[95%] sm:max-w-6xl"
      >
        <div className="container mx-auto">
          <div className="bg-white rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center justify-between">
            {/* Location Input */}
            <div className="flex-1 min-w-[200px] w-full sm:w-auto">
              <label htmlFor="location-input" className="block text-sm text-[#1C3F32]/70 mb-1">
                Where are you headed?
              </label>
              <input
                id="location-input"
                type="text"
                placeholder="Philippines"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-[#1C3F32]/70"
              />
            </div>
            
            {/* Check-in Date */}
            <div className="flex-1 min-w-[200px] w-full sm:w-auto">
              <label htmlFor="check-in-date" className="block text-sm text-[#1C3F32]/70 mb-1">
                Check in
              </label>
              <input
                id="check-in-date"
                type="date"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-[#1C3F32]/70"
              />
            </div>

            {/* Check-out Date */}
            <div className="flex-1 min-w-[200px] w-full sm:w-auto">
              <label htmlFor="check-out-date" className="block text-sm text-[#1C3F32]/70 mb-1">
                Check out
              </label>
              <input
                id="check-out-date"
                type="date"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-[#1C3F32]/70"
              />
            </div>

            {/* Guests Selection */}
            <div className="flex-1 min-w-[200px] w-full sm:w-auto">
              <label htmlFor="guests-select" className="block text-sm text-[#1C3F32]/70 mb-1">
                Guests
              </label>
              <select 
                id="guests-select"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-[#1C3F32]/70"
              >
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>2 Adults, 1 Child</option>
                <option>2 Adults, 2 Children</option>
              </select>
            </div>

            {/* Book Now Button */}
            <div className="w-full sm:w-auto mt-3 sm:mt-0 flex justify-center sm:justify-start">
              <Button 
                size="md"
                icon={<FaSearch />}
                className="sm:mt-6"
                aria-label="Search for rooms"
              >
                Search Rooms
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Top Rated Rooms Section */}
        <section aria-labelledby="top-rated-heading" className="mb-12">
          <h2 id="top-rated-heading" className="text-2xl font-bold text-[#1C3F32] mb-6">
            Top Rated Rooms
          </h2>
          {isLoading ? (
            <LoadingSpinner size="md" message="Loading top rated rooms..." className="h-60" />
          ) : topRatedRooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {topRatedRooms.map((room, index) => (
                <div key={`${room.title}-${index}`}>
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
              No top rated rooms available at the moment.
            </div>
          )}
        </section>

        {/* Category Section */}
        <section aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="text-2xl font-bold text-[#1C3F32] mb-6">Categories</h2>
          {isLoading ? (
            <LoadingSpinner size="md" message="Loading room categories..." className="h-60" />
          ) : categoryRooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {categoryRooms.map((room, index) => (
                <div key={`${room.title}-${index}`}>
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
              No category rooms available at the moment.
            </div>
          )}
        </section>
      </div>
    </main>
  );
} 