"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { FaMapMarkerAlt, FaRegCalendar, FaUser } from "react-icons/fa";
import Image from "next/image";
import { topRatedRooms } from "@/app/data/rooms";
import Button from "@/app/components/ui/buttons";
import { IconType } from "react-icons";

const HotelSearchResults = () => {
  const searchParams = useSearchParams();
  const location = searchParams.get("location");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");

  return (
    <main className="w-full min-h-screen overflow-x-hidden bg-gray-50">
      {/* Search Bar Section */}
      <div className="w-full mx-auto relative z-30 mt-[12px]">
        <div className="container mx-auto">
          <div className="w-[1006px] h-[101px] mx-auto bg-white rounded-[4px] border border-gray-200 flex items-center px-6 gap-4">
            <div className="flex-1 flex items-center border-r border-gray-200 pr-4 h-[50px]">
              <div className="text-[#1C3F32] mr-2">
                <FaMapMarkerAlt size={20} />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">Location</div>
                <div className="text-sm font-medium">
                  {location || "Philippines"}
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center border-r border-gray-200 px-4 h-[50px]">
              <div className="text-[#1C3F32] mr-2">
                <FaRegCalendar size={20} />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">Check In</div>
                <div className="text-sm font-medium">
                  {checkIn || "05 April 2025"}
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center border-r border-gray-200 px-4 h-[50px]">
              <div className="text-[#1C3F32] mr-2">
                <FaRegCalendar size={20} />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">Check Out</div>
                <div className="text-sm font-medium">
                  {checkOut || "07 April 2025"}
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center px-4 h-[50px]">
              <div className="text-[#1C3F32] mr-2">
                <FaUser size={20} />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">Guests</div>
                <div className="text-sm font-medium">
                  {guests || "1 Room | 1 Adults"}
                </div>
              </div>
            </div>

            <Button
              label="Search Again"
              variant="primary"
              className="!w-[180px] !h-[40px]"
            />
          </div>
        </div>
      </div>

      {/* Results will be displayed here */}
      <div className="container mx-auto px-4 py-8">
        <div className="px-4 w-full mx-auto flex flex-col items-start justify-center gap-6">
          <div className="flex items-center justify-between w-[1006px] mx-auto">
            <h1 className="text-2xl font-bold text-[#1C3F32]">
              Search Results
            </h1>
            <input
              type="text"
              placeholder="Search by hotel name"
              className="px-4 py-2 border rounded-[5px]"
            />
          </div>

          {topRatedRooms.map((room, index) => (
            <div
              key={index}
              className="w-[1006px] h-[226px] mx-auto flex bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Left side - Image */}
              <div className="w-[320px] h-[226px] relative flex-shrink-0">
                <Image
                  src={room.imageUrl}
                  alt={room.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right side - Content */}
              <div className="flex-1 p-6 flex flex-col">
                {/* Title and rating section */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {room.title}
                    </h2>
                    <p className="text-sm text-gray-600">{room.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                      <span className="bg-[#34A853] text-white px-2 py-0.5 rounded text-sm font-medium">
                        {room.rating || "9.5"}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({room.reviews || "120"} Reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {room.description}
                </p>

                {/* Bottom section with button and price */}
                <div className="flex justify-between items-end mt-auto pt-4">
                  <Button
                    label="Select"
                    variant="primary"
                    className="!w-[120px] !h-[40px]"
                  />
                  <div className="text-right">
                    <div className="text-sm text-gray-500">1 room 1 night</div>
                    <div className="text-2xl font-semibold text-[#1C3F32]">
                      ₱{room.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Taxes incl.</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default HotelSearchResults;
