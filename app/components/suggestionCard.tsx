"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllRooms, type RoomType } from "@/app/services/roomService";

const SuggestionCard = () => {
  const [isExpanded, setExpanded] = useState(false);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await getAllRooms();
        setRooms(roomsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const toggle = () => {
    setExpanded((prevState) => !prevState);
  };

  const moreContent = isExpanded ? rooms : rooms.slice(0, 2);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex items-end justify-end mb-4 ml-auto">
        <h1 className="text-2xl font-bold text-black">Rooms</h1>
      </div>
      <div className="w-full rounded-lg space-y-8 pb-10">
        {moreContent.map((room) => (
          <div
            key={room.id}
            className="w-full h-64 rounded-xl border border-gray-300 shadow-md overflow-hidden"
          >
            <div className="flex flex-row h-full">
              {/* Left: Room Image */}
              <div className="relative w-1/4 h-full">
                <Image
                  src={room.imageUrl}
                  alt={room.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Middle: Room Details */}
              <div className="w-1/2 p-4 justify-between flex flex-col">
                <h2 className="text-xl font-bold text-[#1C3F32] mb-2">
                  {room.title}
                </h2>
                <p className="text-gray-600 mb-4">{room.description}</p>
                <div className="mt-auto">
                  <div className="inline-block border border-blue-300 text-blue-600 px-2 py-1 text-sm rounded">
                    Max Occupancy: {room.maxOccupancy} guests
                  </div>
                </div>
              </div>

              {/* Right: Price and Select Button */}
              <div className="w-1/4 p-4 flex flex-col justify-between">
                <Link
                  href={`/hotelRoomDetails/${room.category}/${room.id}`}
                  className="flex justify-end"
                >
                  <button className="w-[200px] py-2 bg-green-800 text-white font-medium rounded hover:bg-green-700 transition-colors">
                    Select
                  </button>
                </Link>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-800">
                    ₱{room.price.toLocaleString()}
                    <span className="text-sm font-normal">/Night</span>
                  </p>
                  <p className="text-xs text-gray-500">Taxes incl.</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {rooms.length > 2 && (
        <div className="flex justify-start items-start w-full">
          <button
            className="h-10 w-32 bg-gray-500 hover:bg-gray-600 rounded-lg text-white mt-2"
            onClick={toggle}
          >
            {isExpanded ? "View Less" : "View More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SuggestionCard;
