"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllRooms, RoomType } from "@/app/services/roomService";
import SuggestionCard from "@/app/components/suggestionCard";
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
} from "react-icons/fa";

const RoomDetails = () => {
  const urlLocation =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.802548850809!2d121.04155931482183!3d14.553551689828368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c8efd99f5459%3A0xf26e2c5e8a39bc!2sTaguig%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1629789045693!5m2!1sen!2sph";
  const params = useParams();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const allRooms = await getAllRooms();
        const foundRoom = allRooms.find(
          (r) => r.href === `/pages/hotelRoomDetails/${params.category}/${params.roomId}`
        );
        
        if (foundRoom) {
          setRoom(foundRoom);
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoomData();
  }, [params.category, params.roomId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!room) {
    return <div className="container mx-auto px-4 py-8">Room not found</div>;
  }

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
            <button className="w-[273px] bg-[#1C3F32] text-white py-3 rounded-md hover:bg-[#15332a] transition-colors">
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
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0 flex justify-end items-end">
            {/* Booking Widget */}

            {/* Highlights */}
            <div className="w-[400px] h-[300px] bg-white shadow-lg rounded-lg p-6 gap-y-4">
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
