import Link from "next/link";
import { useState } from "react";
import { RoomType } from "../services/roomService";
import OptimizedImage from "./shared/OptimizedImage";
import { isCloudinaryUrl } from "../utils/cloudinaryImage";

interface RoomCardProps {
  room: RoomType;
}

const RoomCard = ({ room }: RoomCardProps) => {
  const { title, price, location, imageUrl, href } = room;
  // We'll handle image loading state but let the OptimizedImage handle errors and fallbacks
  const [imageLoading, setImageLoading] = useState(true);

  // We'll handle fallback in OptimizedImage component

  return (
    <Link href={href} className="block h-full">
      <div className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
        <div className="relative h-48 w-full bg-gray-200" style={{ minHeight: '192px' }}>
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <OptimizedImage
            src={imageUrl}
            alt={title || 'Room image'}
            fill={true}
            type="room"
            cloudinaryQuality="auto"
            format="auto"
            priority={true} // Load images with priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            style={{ height: '100%', width: '100%' }} // Ensure parent has dimensions
            fallbackSrc="https://placehold.co/600x400/png?text=Room+Image" // Explicit fallback
            onLoad={() => {
              // Use setTimeout to avoid React state update warnings
              setTimeout(() => setImageLoading(false), 100);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-5 bg-white flex-grow flex flex-col justify-between">
          <h3 className="font-semibold text-lg text-[#1C3F32] mb-2 group-hover:text-[#2A5A4A] transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
          <div className="space-y-1 mt-auto">
            <p className="text-xl font-bold text-[#1C3F32] group-hover:text-[#2A5A4A] transition-colors duration-300">
              ₱{price.toLocaleString()}{" "}
              <span className="text-sm text-[#1C3F32]/70">/Night</span>
            </p>
            <p className="text-sm text-[#1C3F32]/70 flex items-center">
              <svg
                className="w-4 h-4 min-w-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate">{location}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;
