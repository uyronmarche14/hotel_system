"use client";
import { useParams } from "next/navigation";
import { rooms } from "@/app/data/rooms";
import {
  FaStar,
  FaStarHalf,
  FaRegStar,
  FaLocationArrow,
  FaSwimmingPool,
} from "react-icons/fa";

const RoomDetails = () => {
  const params = useParams();
  const room = rooms.find(
    (r) =>
      r.href === `/pages/hotelRoomDetails/${params.category}/${params.roomId}`,
  );

  if (!room) {
    return <div>Room not found</div>;
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative h-[446px] w-full mb-6">
        <img
          src={room.imageUrl}
          alt={room.title}
          className="object-cover h-full w-full"
        />
      </div>
      <div className="mb-6">
        <h1 className="text-[40px] font-bold inter text-black ">
          {room.title}
        </h1>
        <StarRating rating={room.rating || 9.5} />
      </div>
      <div className="flex flex-row items-center justify-start gap-2 my-4">
        <FaLocationArrow className="text-[#1C3F32] h-5 w-5" />
        <p className="text-lg text-black">
          123 Acacia Street, Central Signal Village, Taguig City, Metro Manila,
          1630, Philippines
        </p>
      </div>

      {/* Room details */}
      <div className="w-full h-full flex flex-row items-start justify-between gap-8">
        <div className="max-w-4xl w-full">
          <p className="text-2xl font-bold text-black mb-2">Overview</p>
          <p className="text-[17px] mb-4 text-black">{room.fullDescription}</p>
          <div>
            <p className="text-2xl font-bold text-black mb-2">Amenities</p>
            <div className="w-[257px] h-[62px] flex flex-row items-center justify-center bg-white shadow-xl gap-2 rounded-md">
              <FaSwimmingPool className="text-[#1C3F32] h-5 w-5" />
              <p className="text-sm text-black">Swimming</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 bg-amber-300 h-[451px] w-[458px]"></div>
      </div>
    </div>
  );
};

export default RoomDetails;
