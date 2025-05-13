"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaRegCalendar,
  FaUser,
  FaStar,
  FaStarHalf,
  FaRegStar,
  FaSearch,
} from "react-icons/fa";
import Image from "next/image";
import { RoomType, getAllRooms, getCategoryRooms, getRoomsByCategory } from "@/app/services/roomService";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const location = searchParams.get("location") || "Philippines";
  const checkIn = searchParams.get("checkIn") || "05 April 2025";
  const checkOut = searchParams.get("checkOut") || "07 April 2025";
  const guests = searchParams.get("guests") || "1 Room | 1 Adults";
  const category = searchParams.get("category");

  // Local state for search form
  const [searchLocation, setSearchLocation] = useState(location);
  const [searchCheckIn, setSearchCheckIn] = useState(checkIn);
  const [searchCheckOut, setSearchCheckOut] = useState(checkOut);
  const [searchGuests, setSearchGuests] = useState(guests);

  // Add state management
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [starRating, setStarRating] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    category ? [category] : []
  );
  const [filteredRooms, setFilteredRooms] = useState<RoomType[]>([]);
  const [allRooms, setAllRooms] = useState<RoomType[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      try {
        const rooms = await getAllRooms();
        setAllRooms(rooms);

        // If category is provided in URL, filter by it
        if (category) {
          const categoryRooms = await getRoomsByCategory(category);
          setFilteredRooms(categoryRooms);
        } else {
          setFilteredRooms(rooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        // Fall back to empty arrays if there's an error
        setAllRooms([]);
        setFilteredRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [category]);

  // Get unique categories from rooms data
  const getCategories = (): { id: string; name: string; count: number }[] => {
    if (allRooms.length === 0) return [];
    
    const categories = [...new Set(allRooms.map(room => room.category))];
    return categories.map(cat => ({
      id: cat,
      name: cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      count: allRooms.filter(room => room.category === cat).length
    }));
  };

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

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) 
        ? prev.filter((c) => c !== category) 
        : [...prev, category]
    );
  };

  const handleImageError = (roomId: string) => {
    setImageError(prev => ({
      ...prev,
      [roomId]: true
    }));
  };

  // Search again handler
  const handleSearchAgain = () => {
    // Build the new search params
    const params = new URLSearchParams();
    if (searchLocation) params.set("location", searchLocation);
    if (searchCheckIn) params.set("checkIn", searchCheckIn);
    if (searchCheckOut) params.set("checkOut", searchCheckOut);
    if (searchGuests) params.set("guests", searchGuests);
    if (selectedCategories.length === 1) params.set("category", selectedCategories[0]);
    
    // Navigate to the same page with updated params
    router.push(`/services?${params.toString()}`);
  };

  // Handle room selection
  const handleSelectRoom = (room: RoomType) => {
    router.push(room.href);
  };

  // Filter logic
  useEffect(() => {
    let filtered = [...allRooms];

    // Filter by search query (title, description, and category)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((room) =>
        room.title.toLowerCase().includes(query) || 
        room.description?.toLowerCase().includes(query) ||
        room.category.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    if (priceRange.length > 0) {
      filtered = filtered.filter((room) => {
        return priceRange.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return room.price >= min && room.price <= (max || Infinity);
        });
      });
    }

    // Filter by star rating
    if (starRating.length > 0) {
      filtered = filtered.filter((room) =>
        room.rating && starRating.includes(Math.floor(room.rating))
      );
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((room) =>
        selectedCategories.includes(room.category)
      );
    }

    setFilteredRooms(filtered);
  }, [searchQuery, priceRange, starRating, selectedCategories, allRooms]);

  return (
    <main className="w-full min-h-screen overflow-x-hidden bg-gray-50">
      {/* Search Bar at top - integrated with layout */}
      <div className="w-full mx-auto bg-[#1C3F32] py-3">
        <div className="container mx-auto">
          <div className="w-full max-w-6xl mx-auto bg-white rounded-md shadow-sm flex flex-col md:flex-row items-center">
            {/* Location */}
            <div className="w-full md:w-1/4 flex items-center border-b md:border-b-0 md:border-r border-gray-200 p-4">
              <div className="text-[#1C3F32] mr-3">
                <FaMapMarkerAlt size={20} />
              </div>
              <div className="w-full">
                <div className="text-xs text-gray-600 mb-1 font-medium">Location</div>
                <input 
                  type="text" 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="text-sm font-medium text-gray-800 w-full focus:outline-none"
                  placeholder="Philippines"
                />
              </div>
            </div>

            {/* Check In */}
            <div className="w-full md:w-1/4 flex items-center border-b md:border-b-0 md:border-r border-gray-200 p-4">
              <div className="text-[#1C3F32] mr-3">
                <FaRegCalendar size={20} />
              </div>
              <div className="w-full">
                <div className="text-xs text-gray-600 mb-1 font-medium">Check In</div>
                <input 
                  type="text" 
                  value={searchCheckIn}
                  onChange={(e) => setSearchCheckIn(e.target.value)}
                  className="text-sm font-medium text-gray-800 w-full focus:outline-none"
                  placeholder="05 April 2025"
                />
              </div>
            </div>

            {/* Check Out */}
            <div className="w-full md:w-1/4 flex items-center border-b md:border-b-0 md:border-r border-gray-200 p-4">
              <div className="text-[#1C3F32] mr-3">
                <FaRegCalendar size={20} />
              </div>
              <div className="w-full">
                <div className="text-xs text-gray-600 mb-1 font-medium">Check Out</div>
                <input 
                  type="text" 
                  value={searchCheckOut}
                  onChange={(e) => setSearchCheckOut(e.target.value)}
                  className="text-sm font-medium text-gray-800 w-full focus:outline-none"
                  placeholder="07 April 2025"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="w-full md:w-1/4 flex items-center border-b md:border-b-0 md:border-r border-gray-200 p-4">
              <div className="text-[#1C3F32] mr-3">
                <FaUser size={20} />
              </div>
              <div className="w-full">
                <div className="text-xs text-gray-600 mb-1 font-medium">Guests</div>
                <input 
                  type="text" 
                  value={searchGuests}
                  onChange={(e) => setSearchGuests(e.target.value)}
                  className="text-sm font-medium text-gray-800 w-full focus:outline-none"
                  placeholder="1 Room | 1 Adults"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="w-full md:w-auto p-4 md:pl-2 md:pr-4">
              <button 
                onClick={handleSearchAgain}
                className="w-full md:w-auto bg-[#1C3F32] text-white py-3 px-6 rounded-md hover:bg-[#2A5A4A] transition-colors font-medium"
              >
                Search Again
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results and Filters Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full py-2 px-4 bg-brand-green text-white rounded-md flex items-center justify-center gap-2"
            >
              <span>{isFilterOpen ? "Hide Filters" : "Show Filters"}</span>
            </button>
          </div>

          {/* Filter Sidebar */}
          <div className={`w-full lg:w-72 bg-white rounded-lg border border-gray-200 p-4 shadow-sm ${isFilterOpen ? 'block' : 'hidden lg:block'} self-start sticky top-4`}>
            {/* Search field in filter section */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-800 text-lg">Search</h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by room name"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green text-gray-700"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Room Categories */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-800 text-lg">Room Type</h3>
              <div className="space-y-2">
                {getCategories().map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center mb-2 text-gray-700 hover:text-gray-900 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="mr-2 text-brand-green focus:ring-brand-green h-4 w-4"
                    />
                    {category.name} <span className="ml-1 text-gray-500 text-sm">({category.count})</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-800 text-lg">Price Range</h3>
              {[
                { label: "₱2,000 - ₱5,000", value: "2000-5000" },
                { label: "₱5,001 - ₱10,000", value: "5001-10000" },
                { label: "₱10,001 - ₱15,000", value: "10001-15000" },
                { label: "₱15,001 - ₱25,000", value: "15001-25000" },
                { label: "₱25,001 and above", value: "25001-999999" },
              ].map((range) => (
                <label
                  key={range.value}
                  className="flex items-center mb-2 text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={priceRange.includes(range.value)}
                    onChange={() => handlePriceRangeChange(range.value)}
                    className="mr-2 text-brand-green focus:ring-brand-green h-4 w-4"
                  />
                  {range.label}
                </label>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-800 text-lg">Star Rating</h3>
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={starRating.includes(rating)}
                    onChange={() => handleStarRatingChange(rating)}
                    className="mr-2 text-brand-green focus:ring-brand-green h-4 w-4"
                  />
                  <div className="flex items-center">
                    {Array(rating)
                      .fill(null)
                      .map((_, i) => (
                        <FaStar key={i} className="text-[#F2994A]" />
                      ))}
                    {Array(5 - rating)
                      .fill(null)
                      .map((_, i) => (
                        <FaRegStar key={i} className="text-[#F2994A]" />
                      ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    ({allRooms.filter(room => room.rating && Math.floor(room.rating) === rating).length})
                  </span>
                </label>
              ))}
            </div>

            <Button
              label="Clear Filters"
              variant="primary"
              className="w-full !h-[40px] mt-4"
              onClick={() => {
                setSearchQuery("");
                setPriceRange([]);
                setStarRating([]);
                setSelectedCategories([]);
              }}
            />
          </div>

          {/* Results Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1C3F32]">
                Results found ({filteredRooms.length})
              </h1>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-64 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1C3F32] mb-4"></div>
                <p className="text-gray-600">Loading rooms...</p>
              </div>
            )}

            {!isLoading && filteredRooms.length === 0 ? (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
                <p className="text-gray-700 mb-4">No rooms found matching your criteria.</p>
                <Button
                  label="Clear Filters"
                  variant="primary"
                  className="!w-[150px] !h-[40px]"
                  onClick={() => {
                    setSearchQuery("");
                    setPriceRange([]);
                    setStarRating([]);
                    setSelectedCategories([]);
                  }}
                />
              </div>
            ) : !isLoading && (
              <div className="flex flex-col gap-6">
                {filteredRooms.map((room, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow"
                  >
                    <div className="md:w-64 h-48 md:h-full relative flex-shrink-0">
                      {!imageError[room.title] ? (
                        <Image
                          src={room.imageUrl}
                          alt={room.title}
                          fill
                          className="object-cover"
                          onError={() => handleImageError(room.title)}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                          <p className="text-sm">Image not available</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 md:p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 mb-1">{room.title}</h2>
                          <div className="flex items-center gap-1 mb-2">
                            <StarRating rating={room.rating || 0} />
                            <span className="text-sm text-gray-600">({room.reviews || 0} reviews)</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-[#1C3F32]">₱{room.price.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">per night</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {room.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                        {room.bedType && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {room.bedType}
                          </span>
                        )}
                        {room.maxOccupancy && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            Max: {room.maxOccupancy} People
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-auto">
                        <Button
                          label="View Details"
                          variant="primary"
                          className="!w-full md:!w-[180px] !h-[40px]"
                          onClick={() => handleSelectRoom(room)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

// Loading component to show while the SearchResultsContent is loading
const SearchResultsLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-lg font-medium text-gray-800">Loading search results...</p>
      </div>
    </div>
  );
};

// Main component that wraps the content with Suspense
const HotelSearchResults = () => {
  return (
    <Suspense fallback={<SearchResultsLoading />}>
      <SearchResultsContent />
    </Suspense>
  );
};

export default HotelSearchResults;
