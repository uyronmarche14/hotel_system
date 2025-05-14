import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { RoomType } from "../services/roomService";

interface RoomCardProps {
  room: RoomType;
}

const RoomCard = ({ room }: RoomCardProps) => {
  const { title, price, location, imageUrl, href } = room;
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Always use Cloudinary placeholder as fallback
  const cloudinaryFallback =
    "https://res.cloudinary.com/ddnxfpziq/image/upload/v1747146600/room-placeholder_mnyxqz.jpg";

  // Determine image source
  const imgSrc =
    imageError || !imageUrl?.includes("cloudinary.com")
      ? cloudinaryFallback
      : imageUrl;

  return (
    <Link href={href} className="block h-full">
      <div className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
        <div className="relative h-48 w-full bg-gray-200">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            src={imgSrc}
            alt={title}
            fill
            unoptimized={true}
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              console.log("Image failed to load:", imgSrc);
              setImageError(true);
              setImageLoading(false);
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
