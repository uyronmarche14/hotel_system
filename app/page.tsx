"use client";
import { useRouter } from "next/navigation";
import Header from "@/app/components/normal/header";
import RoomCard from "@/app/components/RoomCard";
import { topRatedRooms, categoryRooms } from "./data/rooms";
import { useState } from "react";
import HotelSearchResults from "@/app/pages/publicView/page";

export default function Home() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: "1 Adult",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const queryString = new URLSearchParams(searchData).toString();
    router.push(`/pages/publicView?${queryString}`);
  };

  return (
    <main className="w-full min-h-screen overflow-x-hidden">
      <Header />

      {/* Search Bar Section */}
      <div className="w-full max-w-6xl mx-auto bg-white shadow-lg relative z-30 -mt-16 rounded-lg">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg p-4 flex flex-wrap gap-4 items-center justify-between">
            {/* Location Input */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-[#1C3F32]/70 mb-1">
                Where are you headed?
              </label>
              <input
                type="text"
                name="location"
                value={searchData.location}
                onChange={handleInputChange}
                placeholder="Philippines"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-[#1C3F32]/70"
              />
            </div>

            {/* Check-in Date */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-[#1C3F32]/70 mb-1">
                Check in
              </label>
              <input
                type="date"
                name="checkIn"
                value={searchData.checkIn}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-[#1C3F32]/70"
              />
            </div>

            {/* Check-out Date */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-[#1C3F32]/70 mb-1">
                Check out
              </label>
              <input
                type="date"
                name="checkOut"
                value={searchData.checkOut}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-[#1C3F32]/70"
              />
            </div>

            {/* Guests Selection */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-[#1C3F32]/70 mb-1">
                Guests
              </label>
              <select
                name="guests"
                value={searchData.guests}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-[#1C3F32]/70"
              >
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>2 Adults, 1 Child</option>
                <option>2 Adults, 2 Children</option>
              </select>
            </div>

            {/* Book Now Button */}
            <div className="flex-none">
              <button
                onClick={handleSearch}
                className="bg-[#1C3F32] text-white px-8 py-2 rounded-md hover:bg-[#1C3F32]/90 transition-colors mt-6"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Top Rated Rooms Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1C3F32] pb-2 border-b-2 border-[#1C3F32] inline-block">
              Top Rated Rooms
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {topRatedRooms.map((room, index) => (
              <RoomCard key={index} {...room} />
            ))}
          </div>
        </section>

        {/* Category Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1C3F32] pb-2 border-b-2 border-[#1C3F32] inline-block">
              Category
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoryRooms.map((room, index) => (
              <RoomCard key={index} {...room} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
