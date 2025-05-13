"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import RoomCard from "@/app/components/RoomCard";
import Link from "next/link";
import { getRoomsByCategory, RoomType } from "@/app/services/roomService";

const CategoryPage = () => {
  const params = useParams();
  const category = params.category as string;
  const [categoryRooms, setCategoryRooms] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Format category name for display (replace hyphens with spaces and capitalize)
  const formattedCategoryName = category
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const rooms = await getRoomsByCategory(category);
        setCategoryRooms(rooms);
      } catch (error) {
        console.error("Error fetching rooms by category:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [category]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/dashboard"
          className="text-[#1C3F32] hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-[#1C3F32] mb-6">
        {formattedCategoryName} Rooms
      </h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1C3F32]"></div>
        </div>
      ) : categoryRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {categoryRooms.map((room) => (
            <RoomCard key={room.title} room={room} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-500">No rooms found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
