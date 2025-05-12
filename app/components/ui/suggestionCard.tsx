"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaLocationArrow } from "react-icons/fa";

interface SuggestionCardProps {
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  href: string;
}

const SuggestionCard = ({
  title,
  price,
  location,
  imageUrl,
  href
}: SuggestionCardProps) => {
  return (
    <Link href={href} className="block h-full">
      <div className="group h-full rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 flex flex-col">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-4 bg-white flex-grow flex flex-col justify-between">
          <h3 className="font-semibold text-lg text-[#1C3F32] mb-2 group-hover:text-[#2A5A4A] transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
          <div className="space-y-1 mt-auto">
            <p className="text-xl font-bold text-[#1C3F32] group-hover:text-[#2A5A4A] transition-colors duration-300">
              ₱{price.toLocaleString()}{" "}
              <span className="text-sm text-[#1C3F32]/70">/Night</span>
            </p>
            <p className="text-sm text-[#1C3F32]/70 flex items-center">
              <FaLocationArrow className="w-3 h-3 min-w-3 mr-1" />
              <span className="truncate">{location}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SuggestionCard;
