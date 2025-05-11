"use client";
import { useParams } from "next/navigation";
import { rooms, getRoomsByCategory } from "@/app/data/rooms";
import RoomCard from "@/app/components/RoomCard";
import Link from "next/link";

const CategoryPage = () => {
  const params = useParams();
  const category = params.category as string;
  
  // Filter rooms by the current category
  const categoryRooms = getRoomsByCategory(category);
  
  // Format category name for display (replace hyphens with spaces and capitalize)
  const formattedCategoryName = category
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

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
      
      {categoryRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryRooms.map((room, index) => (
            <RoomCard
              key={index}
              title={room.title}
              price={room.price}
              location={room.location}
              imageUrl={room.imageUrl}
              href={`/hotelRoomDetails/${category}/${room.title.toLowerCase().replace(/ /g, "-")}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            No rooms found in this category.
          </p>
          <Link 
            href="/dashboard" 
            className="mt-4 inline-block bg-[#1C3F32] text-white px-6 py-2 rounded-md hover:bg-[#1C3F32]/90 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
