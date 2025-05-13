"use client";
import { useParams, useRouter } from "next/navigation";
import { rooms } from "@/app/data/rooms";
import SuggestionCard from "@/app/components/ui/suggestionCard";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import { useState } from "react";
import {
  FaStar,
  FaStarHalf,
  FaRegStar,
  FaLocationArrow,
  FaSwimmingPool,
  FaWifi,
  FaCoffee,
  FaParking,
  FaBriefcase,
  FaTshirt,
  FaPlug,
  FaSnowflake,
  FaShower,
  FaTv,
  FaVoicemail,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";

const RoomDetails = () => {
  const [showMoreSuggestions, setShowMoreSuggestions] = useState(false);
  const urlLocation =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.802548850809!2d121.04155931482183!3d14.553551689828368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c8efd99f5459%3A0xf26e2c5e8a39bc!2sTaguig%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1629789045693!5m2!1sen!2sph";
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const category = params.category as string;
  const roomId = params.roomId as string;
  
  // Find room that matches either by title slug or by roomId
  const room = rooms.find(
    (r) => {
      const titleSlug = r.title.toLowerCase().replace(/ /g, "-");
      return r.category === category && (titleSlug === roomId || r.href.includes(roomId));
    }
  );

  const handleBookNow = () => {
    if (isAuthenticated) {
      // Proceed with booking if authenticated - use the path in the user route group
      router.push(`/bookings/new?roomId=${roomId}&category=${category}`);
    } else {
      // Redirect to login if not authenticated
      router.push(`/login?redirect=/bookings/new?roomId=${roomId}&category=${category}`);
    }
  };

  const handleCheckAvailability = () => {
    // This is available to all users, authenticated or not
    router.push(`/hotelRoomDetails/${category}/${roomId}/availability`);
  };

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Room not found</h1>
          <p className="text-gray-600 mb-6">The room you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link 
            href={`/hotelRoomDetails/${category}`} 
            className="inline-block bg-[#1C3F32] text-white px-6 py-2 rounded-md hover:bg-[#1C3F32]/90 transition-colors mr-4"
          >
            Back to Category
          </Link>
          <Link 
            href="/dashboard" 
            className="inline-block bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Format category name for breadcrumb
  const formattedCategoryName = category
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

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

  // Amenities data with icons
  const amenities = [
    {
      icon: <FaSnowflake className="text-[#1C3F32] h-5 w-5" />,
      name: "Air Conditioning",
    },
    {
      icon: <FaBriefcase className="text-[#1C3F32] h-5 w-5" />,
      name: "Business Center",
    },
    {
      icon: <FaTshirt className="text-[#1C3F32] h-5 w-5" />,
      name: "Clothing Iron",
    },
    { icon: <FaPlug className="text-[#1C3F32] h-5 w-5" />, name: "Data Ports" },
    {
      icon: <FaShower className="text-[#1C3F32] h-5 w-5" />,
      name: "Dry Cleaning",
    },

    {
      icon: <FaBriefcase className="text-[#1C3F32] h-5 w-5" />,
      name: "Meeting Rooms",
    },
    {
      icon: <FaSwimmingPool className="text-[#1C3F32] h-5 w-5" />,
      name: "Outdoor Pool",
    },
    {
      icon: <FaParking className="text-[#1C3F32] h-5 w-5" />,
      name: "Parking Garage",
    },
    { icon: <FaShieldAlt className="text-[#1C3F32] h-5 w-5" />, name: "Safe" },

    { icon: <FaTv className="text-[#1C3F32] h-5 w-5" />, name: "TV in Room" },
    {
      icon: <FaVoicemail className="text-[#1C3F32] h-5 w-5" />,
      name: "Voicemail",
    },
  ];

  // Highlights data
  const highlights = [
    {
      icon: <FaLocationArrow className="text-green-600 h-5 w-5" />,
      text: "The location of this hotel has a rating score of 9.6",
    },
    {
      icon: <FaCoffee className="text-green-600 h-5 w-5" />,
      text: "This hotel has a wellness rating score of 9.5",
    },
    {
      icon: <FaWifi className="text-green-600 h-5 w-5" />,
      text: "The WiFi service this hotel provides has a rating score of 9.7",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center text-sm text-[#1C3F32] mb-4">
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <span className="mx-2">›</span>
        <Link href={`/hotelRoomDetails/${category}`} className="hover:underline">
          {formattedCategoryName} Rooms
        </Link>
        <span className="mx-2">›</span>
        <span className="font-medium">{room.title}</span>
      </div>

      {/* Hero Image */}
      <div className="relative h-[446px] w-full mb-6 rounded-lg overflow-hidden shadow-lg">
        <Image
          src={room.imageUrl}
          alt={room.title}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 75vw"
          priority
        />
      </div>

      {/* Room Title and Rating */}
      <div className="space-y-4">
        <div className="mb-6">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-4xl font-bold text-black">{room.title}</h1>
           
          </div>

          <div className="flex items-center gap-2">
            <StarRating rating={room.rating || 4.8} />
            <span className="text-gray-600">({room.rating || 4.8}/5)</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-row items-center justify-start gap-2 my-4">
          <FaLocationArrow className="text-[#1C3F32] h-5 w-5" />
          <p className="text-lg text-black">
            123 Acacia Street, Central Signal Village, Taguig City, Metro
            Manila, 1630, Philippines
          </p>
        </div>

        {/* Main Content Area */}
        <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8">
          {/* Left Column - Room Details */}
          <div className="w-full lg:w-2/3">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-black mb-4">Overview</h2>
              <p className="text-base text-gray-700 leading-relaxed">
                {room.fullDescription || room.description || `Experience unmatched elegance in our ${room.title}, where every
                detail is crafted for discerning travelers. These suites boast
                expansive spaces with floor-to-ceiling windows that reveal
                breathtaking city or garden views. Sophisticated interiors,
                premium linens, and artisan furnishings elevate your stay, while
                modern comforts like high-speed Wi-Fi, OLED TVs, and luxurious
                bathrooms with heated tiles ensure convenience meets indulgence.`}
              </p>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                Whether you&apos;re here for a romantic escape or a high-end business
                retreat, our luxury accommodations promise serenity and
                refinement. Guests staying in these rooms also enjoy priority
                access to exclusive lounges, personalized services, and an
                ambiance that blends timeless sophistication with contemporary
                design. Each room offers a retreat—a sanctuary and a home—in an
                exquisite setting.
              </p>
            </section>

            {/* Amenities Section */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 border border-green-100 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <div className="flex-shrink-0">{item.icon}</div>
                    <span className="text-[#1C3F32]">{item.name}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Booking and Highlights */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Booking Box */}
            <div className="border border-green-200 rounded-lg p-6 bg-white shadow-md">
              <h3 className="text-xl font-bold text-[#1C3F32] mb-4">
                Plan Your Stay
              </h3>
              <div className="flex justify-between mb-4 border-b border-green-100 pb-4">
                <span className="text-gray-600">Price per night</span>
                <span className="text-xl font-bold text-[#1C3F32]">
                  ₱{room.price.toLocaleString()}
                </span>
              </div>
              <button
                onClick={handleBookNow}
                className="w-full bg-[#1C3F32] text-white py-3 rounded-md hover:bg-[#15332a] transition-colors mb-4"
              >
                Book Now
              </button>
              <button
                onClick={handleCheckAvailability}
                className="w-full border border-[#1C3F32] text-[#1C3F32] py-3 rounded-md hover:bg-green-50 transition-colors"
              >
                Check Availability
              </button>
            </div>

            {/* Highlights */}
            <div className="border border-green-200 rounded-lg p-6 bg-white shadow-md">
              <h3 className="text-xl font-bold text-[#1C3F32] mb-4">
                Highlights
              </h3>
              <ul className="space-y-4">
                {highlights.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">{item.icon}</div>
                    <span className="text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Map Section - Full Width */}
        <section className="mt-8 mb-12">
          <div className="border border-green-200 rounded-lg p-6 bg-white shadow-md">
            <h3 className="text-2xl font-bold text-[#1C3F32] mb-4">
              Location
            </h3>
            <div className="w-full h-[400px] bg-gray-200 mb-4 overflow-hidden rounded-md">
              <iframe
                src={urlLocation}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Location Map"
              />
            </div>
            <p className="text-gray-600">
              123 Acacia Street, Central Signal Village, Taguig City, Metro Manila, 1630, Philippines
            </p>
          </div>
        </section>

        {/* Related Rooms Section */}
        <section className="my-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">
              You May Also Like
            </h2>
            <Link
              href={`/hotelRoomDetails/${category}`}
              className="text-[#1C3F32] font-medium hover:underline flex items-center"
            >
              View All {formattedCategoryName} Rooms
              <FaArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms
              .filter(
                (r) => r.category === room.category && r.title !== room.title,
              )
              .slice(0, showMoreSuggestions ? 12 : 6)
              .map((relatedRoom, index) => (
                <div key={index} className="h-full">
                  <SuggestionCard
                    title={relatedRoom.title}
                    price={relatedRoom.price}
                    location={relatedRoom.location}
                    imageUrl={relatedRoom.imageUrl}
                    href={`/hotelRoomDetails/${category}/${relatedRoom.title
                      .toLowerCase()
                      .replace(/ /g, "-")}`}
                  />
                </div>
              ))}
          </div>
          
          {/* Show More Button */}
          {rooms.filter((r) => r.category === room.category && r.title !== room.title).length > 6 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowMoreSuggestions(!showMoreSuggestions)}
                className="bg-[#1C3F32] text-white px-6 py-3 rounded-md hover:bg-[#15332a] transition-colors flex items-center"
              >
                {showMoreSuggestions ? "Show Less" : "Show More Suggestions"}
                {!showMoreSuggestions && <FaArrowRight className="ml-2 h-3 w-3" />}
              </button>
            </div>
          )}
        </section>

        {/* Popular Choices Section */}
        <section className="my-12 pt-12 border-t border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">
              Popular Choices
            </h2>
            <Link
              href="/dashboard"
              className="text-[#1C3F32] font-medium hover:underline flex items-center"
            >
              Explore All Rooms
              <FaArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms
              .filter(
                (r) => r.category !== room.category && r.rating && r.rating >= 4.5
              )
              .slice(0, 3)
              .map((popularRoom, index) => (
                <div key={index} className="h-full">
                  <SuggestionCard
                    title={popularRoom.title}
                    price={popularRoom.price}
                    location={popularRoom.location}
                    imageUrl={popularRoom.imageUrl}
                    href={`/hotelRoomDetails/${popularRoom.category}/${popularRoom.title
                      .toLowerCase()
                      .replace(/ /g, "-")}`}
                  />
                </div>
              ))}
          </div>
        </section>
        
        {/* Special Offers Section */}
        <section className="my-12 pt-12 border-t border-gray-200 bg-green-50 p-8 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1C3F32]">
                Special Offers
              </h2>
              <p className="text-sm text-gray-600 mt-1">Limited time deals on select rooms</p>
            </div>
            <Link
              href="/specials"
              className="text-[#1C3F32] font-medium hover:underline flex items-center"
            >
              View All Offers
              <FaArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms
              .filter((r) => r.price > 5000) // Assuming higher priced rooms can have discounts
              .slice(0, 3)
              .map((specialRoom, index) => (
                <div key={index} className="h-full relative">
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1 rounded-full z-10 font-bold">
                    20% OFF
                  </div>
                  <SuggestionCard
                    title={specialRoom.title}
                    price={Math.round(specialRoom.price * 0.8)} // Apply 20% discount
                    location={specialRoom.location}
                    imageUrl={specialRoom.imageUrl}
                    href={`/hotelRoomDetails/${specialRoom.category}/${specialRoom.title
                      .toLowerCase()
                      .replace(/ /g, "-")}`}
                  />
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RoomDetails; 