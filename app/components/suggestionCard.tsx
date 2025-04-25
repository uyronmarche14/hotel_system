"use client";
import React, { useState } from "react";
import Image from "next/image";
import { rooms } from "@/app/data/rooms";

const SuggestionCard = () => {
  const [isExpanded, setExpanded] = useState(false);

  const toggle = () => {
    setExpanded((prevState) => !prevState);
  };

  const moreContent = isExpanded ? rooms : rooms.slice(0, 2);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex items-end justify-end mb-4 ml-auto">
        <h1 className="text-2xl font-bold text-black">Rooms</h1>
      </div>
      <div className="w-full rounded-lg space-y-8 pb-10">
        {moreContent.map((room, index) => (
          <div
            key={index}
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
                <h2 className="text-xl font-bold text-blue-800 mb-2">
                  {room.title}
                </h2>
                <p className="text-gray-600 mb-4">{room.description}</p>

                {/* Features section - like "Free Cancellation, Breakfast Included" */}
                <div className="mt-auto">
                  <div className="inline-block border border-blue-300 text-blue-600 px-2 py-1 text-sm rounded">
                    Free Cancellation, Breakfast Included
                  </div>
                  <div className="text-gray-500 text-sm mt-2">
                    <span className="bg-blue-100 text-blue-600 px-1">
                      279 × 20
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Price and Select Button */}
              <div className="w-1/4 p-4 flex flex-col justify-between">
                <div className="flex justify-end">
                  <button className="w-[200px] py-2 bg-green-800 text-white font-medium rounded hover:bg-green-700 transition-colors">
                    Select
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    2 Room | 7 Adults, 3 Children
                  </p>
                  <p className="text-xl font-bold text-blue-800">
                    ₱{room.price ? room.price.toLocaleString() : "15,000"}
                    <span className="text-sm font-normal">/Night</span>
                  </p>
                  <p className="text-xs text-gray-500">Taxes incl.</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="h-10 w-32 bg-gray-500 hover:bg-gray-600 rounded-lg text-white mt-4"
        onClick={toggle}
      >
        {isExpanded ? "View Less" : "View More"}
      </button>
    </div>
  );
};

export default SuggestionCard;
