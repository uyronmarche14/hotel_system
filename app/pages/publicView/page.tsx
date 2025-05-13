"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaRegCalendar,
  FaUser,
  FaStar,
  FaStarHalf,
  FaRegStar,
} from "react-icons/fa";
import Image from "next/image";
import { getAllRooms, RoomType } from "@/app/services/roomService";
import Button from "@/app/components/ui/buttons";

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`star-${i}`} className="text-[#F2994A]" />);
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(<FaStarHalf key="half-star" className="text-[#F2994A]" />);
  }

  // Add empty stars
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <FaRegStar key={`empty-star-${i}`} className="text-[#F2994A]" />,
    );
  }

  return <div className="flex gap-0.5">{stars}</div>;
};

// This component uses useSearchParams and will be wrapped in Suspense
const SearchResultsContent = () => {
  const searchParams = useSearchParams();
  const location = searchParams.get("location");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");

  // Add state management
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [starRating, setStarRating] = useState<number[]>([]);
  const [allRooms, setAllRooms] = useState<RoomType[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const rooms = await getAllRooms();
        setAllRooms(rooms);
        setFilteredRooms(rooms);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, []);

  // Filter handlers
  const handlePriceRangeChange = (range: string) => {
    setPriceRange((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range],
    );
  };

  const handleStarRatingChange = (rating: number) => {
    setStarRating((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating],
    );
  };

  // Filter logic
  useEffect(() => {
    if (allRooms.length === 0) return;
    
    let filtered = [...allRooms];

    if (searchQuery) {
      filtered = filtered.filter((room) =>
        room.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (priceRange.length > 0) {
      filtered = filtered.filter((room) => {
        return priceRange.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return room.price >= min && room.price <= (max || Infinity);
        });
      });
    }

    if (starRating.length > 0) {
      filtered = filtered.filter((room) =>
        starRating.includes(Math.floor(room.rating || 0)),
      );
    }

    setFilteredRooms(filtered);
  }, [searchQuery, priceRange, starRating, allRooms]);

  return (
    <>
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

      {/* Results Section with Sidebar */}
      <div className="flex flex-col items-start pl-32 px-4 py-8">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <div className="w-[295px] h-[400px] p-4 rounded-lg border border-gray-200">
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-black">Price Range</h3>
              {[
                { label: "₱2,000 - ₱5,000", value: "2000-5000" },
                { label: "₱5,001 - ₱10,000", value: "5001-10000" },
                { label: "₱10,001 - ₱15,000", value: "10001-15000" },
                { label: "₱15,001 - ₱25,000", value: "15001-25000" },
                { label: "₱25,001 and above", value: "25001-999999" },
              ].map((range) => (
                <label
                  key={range.value}
                  className="flex items-center mb-2 text-black"
                >
                  <input
                    type="checkbox"
                    checked={priceRange.includes(range.value)}
                    onChange={() => handlePriceRangeChange(range.value)}
                    className="mr-2 text-black"
                  />
                  {range.label}
                </label>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-black">Star Rating</h3>
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={starRating.includes(rating)}
                    onChange={() => handleStarRatingChange(rating)}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    {Array(rating)
                      .fill(null)
                      .map((_, i) => (
                        <FaStar key={i} className="text-[#F2994A]" />
                      ))}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Results Content */}
          <div className="">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#1C3F32]">
                Search Results ({filteredRooms.length})
              </h1>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hotel name"
                className="px-4 py-2 border rounded-[5px]"
              />
            </div>

            <div className="flex flex-col gap-6">
              {filteredRooms.map((room, index) => (
                <div
                  key={index}
                  className="w-[1006px] h-[226px] mx-auto flex bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Left side - Image */}
                  <div className="w-[320px] h-[226px] relative flex-shrink-0 flex items-center justify-center">
                    <div className="relative w-[90%] h-[90%]">
                      <Image
                        src={room.imageUrl}
                        alt={room.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Right side - Content */}
                  <div className="flex-1 p-2 flex flex-col">
                    {/* Title and rating section */}
                    <div className="flex justify-between items-start">
                      <div className="flex flex-row items-center justify-between gap-2">
                        <h2 className="text-[20px] font-semibold text-gray-900 mb-1">
                          {room.title}
                        </h2>
                        <span className="bg-[#34A853] text-white px-2 py-0.5 rounded text-sm font-medium">
                          {room.rating}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {room.amenities?.map((amenity, i) => (
                          <div key={i} className="relative w-6 h-6">
                            <Image
                              src={amenity}
                              alt={`Amenity ${i + 1}`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={room.rating || 9.5} />
                      <span className="text-sm text-gray-500">
                        {room.rating}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({room.reviews || "120"} Reviews)
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-black my-4">
                      {room.description}
                    </p>

                    {/* Bottom section with button and price */}
                    <div className="flex justify-between items-end mt-auto pt-4">
                      <Button
                        label="Select"
                        variant="primary"
                        className="!w-[158px] !h-[40px]"
                      />
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          1 room 1 night
                        </div>
                        <div className="text-2xl font-semibold text-[#1C3F32]">
                          ₱{room.price.toLocaleString()} /{" "}
                          <span className="text-sm text-[#1C3F32]/70">
                            Night
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Taxes incl.</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Loading component to show while the SearchResultsContent is loading
const SearchResultsLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-lg font-medium">Loading search results...</p>
      </div>
    </div>
  );
};

// Main component that wraps the content with Suspense
const HotelSearchResults = () => {
  return (
    <main className="w-full min-h-screen overflow-x-hidden bg-gray-50">
      <Suspense fallback={<SearchResultsLoading />}>
        <SearchResultsContent />
      </Suspense>
    </main>
  );
};

export default HotelSearchResults;
