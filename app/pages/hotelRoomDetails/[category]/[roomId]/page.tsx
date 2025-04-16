"use client";
import { useParams } from "next/navigation";
import { rooms, RoomType } from "@/app/data/rooms";

const RoomDetails = () => {
  const params = useParams();
  const room = rooms.find(
    (r) =>
      r.href === `/pages/hotelRoomDetails/${params.category}/${params.roomId}`,
  );

  if (!room) {
    return <div>Room not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1C3F32] mb-6">{room.title}</h1>

      {/* Room details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-lg mb-4">{room.fullDescription}</p>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Room Features</h2>
            <ul className="list-disc pl-5">
              {room.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Room Details</h2>
            <p>Size: {room.roomSize}</p>
            <p>Max Occupancy: {room.maxOccupancy} persons</p>
            <p>Bed Type: {room.bedType}</p>
            <p>View: {room.viewType}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Price</h2>
            <p className="text-2xl font-bold">
              ₱{room.price.toLocaleString()} / night
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
