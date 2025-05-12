"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RoomType } from "@/app/data/rooms";

interface SuggestionCardProps {
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  href: string;
  bedType?: string;
  maxOccupancy?: number;
  description?: string;
  reviews?: number;
}

const SuggestionCard = ({ 
  title, 
  price, 
  location, 
  imageUrl, 
  href, 
  bedType = "1 Room", 
  maxOccupancy = 2, 
  description = "Experience luxury and comfort in our modern accommodations designed for your relaxation.",
  reviews
}: SuggestionCardProps) => {
  
  return (
    <div className="w-full h-64 rounded-xl border border-gray-300 shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="flex flex-row h-full">
        {/* Left: Room Image */}
        <div className="relative w-1/4 h-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        {/* Middle: Room Details */}
        <div className="w-1/2 p-4 justify-between flex flex-col">
          <h2 className="text-xl font-bold text-[#1C3F32] mb-2">
            {title}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>

          {/* Features section */}
          <div className="mt-auto">
            <div className="inline-block border border-[#1C3F32]/30 text-[#1C3F32] px-2 py-1 text-sm rounded">
              Free Cancellation, Breakfast Included
            </div>
            {reviews && (
              <div className="text-gray-500 text-sm mt-2">
                <span className="bg-[#1C3F32]/10 text-[#1C3F32] px-1">
                  {reviews} reviews
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Price and Select Button */}
        <div className="w-1/4 p-4 flex flex-col justify-between">
          <div className="flex justify-end">
            <Link href={href}>
              <button className="w-[200px] py-2 bg-[#1C3F32] text-white font-medium rounded hover:bg-[#1C3F32]/90 transition-colors">
                View Details
              </button>
            </Link>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {bedType} | {maxOccupancy} Guests
            </p>
            <p className="text-xl font-bold text-[#1C3F32]">
              ₱{price.toLocaleString()}
              <span className="text-sm font-normal">/Night</span>
            </p>
            <p className="text-xs text-gray-500">{location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component that displays multiple suggestion cards
export const SuggestionCardGroup = () => {
  // Import rooms data only in this component
  const { rooms } = require("@/app/data/rooms") as { rooms: RoomType[] };
  const [isExpanded, setExpanded] = React.useState(false);

  const toggle = () => {
    setExpanded((prevState) => !prevState);
  };

  const moreContent = isExpanded ? rooms : rooms.slice(0, 3);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex items-end justify-between w-full mb-4">
        <h1 className="text-2xl font-bold text-black">Suggested Rooms</h1>
      </div>
      <div className="w-full rounded-lg space-y-8 pb-10">
        {moreContent.map((room: RoomType, index: number) => (
          <SuggestionCard
            key={index}
            title={room.title}
            price={room.price}
            location={room.location}
            imageUrl={room.imageUrl}
            href={`/hotelRoomDetails/${room.category}/${room.title.toLowerCase().replace(/ /g, "-")}`}
            bedType={room.bedType}
            maxOccupancy={room.maxOccupancy}
            description={room.description}
            reviews={room.reviews}
          />
        ))}
      </div>
      <button
        className="h-10 w-32 bg-[#1C3F32] hover:bg-[#1C3F32]/90 rounded-lg text-white mt-4"
        onClick={toggle}
      >
        {isExpanded ? "View Less" : "View More"}
      </button>
    </div>
  );
};

export default SuggestionCard;
