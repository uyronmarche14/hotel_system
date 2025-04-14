import Header from "@/app/components/normal/header";
import RoomCard from "@/app/components/RoomCard";
import { topRatedRooms, categoryRooms } from "./data/rooms";

export default function Home() {
  return (
    <main className="w-full min-h-screen overflow-x-hidden">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Top Rated Rooms Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1C3F32]">
              Top Rated Rooms
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {topRatedRooms.map((room, index) => (
              <RoomCard
                key={index}
                title={room.title}
                price={room.price}
                location={room.location}
                imageUrl={room.imageUrl}
                href={room.href}
              />
            ))}
          </div>
        </section>

        {/* Category Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoryRooms.map((room, index) => (
              <RoomCard
                key={index}
                title={room.title}
                price={room.price}
                location={room.location}
                imageUrl={room.imageUrl}
                href={room.href}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
