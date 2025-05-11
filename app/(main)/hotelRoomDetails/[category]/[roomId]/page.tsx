"use client";
import { useParams, useRouter } from "next/navigation";
import { rooms } from "@/app/data/rooms";
import SuggestionCard from "@/app/components/ui/suggestionCard";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
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
  FaArrowLeft,
} from "react-icons/fa";

const RoomDetails = () => {
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
          <p className="text-gray-600 mb-6">The room you're looking for doesn't exist or has been removed.</p>
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
        <img
          src={room.imageUrl}
          alt={room.title}
          className="object-cover h-full w-full"
        />
      </div>

      {/* Room Title and Rating */}
      <div className="space-y-4">
        <div className="mb-6">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-4xl font-bold text-black">{room.title}</h1>
            <button 
              onClick={handleCheckAvailability}
              className="w-[273px] bg-[#1C3F32] text-white py-3 rounded-md hover:bg-[#15332a] transition-colors"
            >
              See Room Availability
            </button>
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
                Whether you've here for a romantic escape or a high-end business
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center p-4 bg-white shadow-md rounded-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-row items-center gap-2">
                      {amenity.icon}
                      <p className="text-sm text-black">{amenity.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Booking Widget & Highlights */}
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0 flex flex-col">
            {/* Booking Widget */}
            <div className="w-full bg-white shadow-lg rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-black mb-4">Book This Room</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Price per night:</span>
                  <span className="text-2xl font-bold text-[#1C3F32]">${room.price || 199}</span>
                </div>
                <button
                  onClick={handleBookNow}
                  className="w-full bg-[#1C3F32] text-white py-3 rounded-md hover:bg-[#15332a] transition-colors"
                >
                  {isAuthenticated ? "Book Now" : "Login to Book"}
                </button>
                {!isAuthenticated && (
                  <p className="text-sm text-gray-600 text-center mt-2">
                    You need to be logged in to book a room.
                  </p>
                )}
              </div>
            </div>

            {/* Highlights */}
            <div className="w-full bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-bold text-black mb-4">Highlights</h3>
              <div className="space-y-4">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1">{highlight.icon}</div>
                    <p className="text-gray-700">{highlight.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <SuggestionCard />
        </div>
        <div className="bg-background/50 p-4 rounded-2xl shadow-lg backdrop-blur-sm border border-primary/10">
          <h2 className="text-2xl font-bold mb-8 text-black border-b border-primary/10 pb-4">
            Visit Us
          </h2>
          <a
            href="https://maps.google.com/?q=Taguig+City,+Philippines"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <iframe
              src={urlLocation}
              className="w-full h-[600px] rounded-xl shadow-md hover:shadow-lg transition-shadow"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails; 