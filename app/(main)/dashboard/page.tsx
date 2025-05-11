import Header from "@/app/components/normal/header";
import RoomCard from "@/app/components/RoomCard";
import { rooms } from "@/app/data/rooms";

export default function Home() {
  // Get top 5 rated rooms
  const topRatedRooms = [...rooms]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  // Get unique categories and highest rated room from each
  const categories = [...new Set(rooms.map(room => room.category))];
  const categoryRooms = categories.map(category => {
    const roomsInCategory = rooms.filter(room => room.category === category);
    return roomsInCategory.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  });

  return (
    <main className="w-full min-h-screen overflow-x-hidden">
      <Header />

      {/* Search Bar Section */}
      <div className="w-full px-4 mx-auto bg-white shadow-md relative z-30 -mt-8 sm:-mt-16 max-w-[95%] sm:max-w-6xl">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center justify-between">
            {/* Location Input */}
            <div className="flex-1 min-w-[200px] w-full sm:w-auto">
              <label className="block text-sm text-[#1C3F32]/70 mb-1">
                Where are you headed?
              </label>
              <input
                type="text"
                placeholder="Philippines"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-[#1C3F32]/70"
              />
            </div>
            
            {/* Check-in Date */}
            <div className="flex-1 min-w-[200px] w-full sm:w-auto">
              <label className="block text-sm text-[#1C3F32]/70 mb-1">
                Check in
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-[#1C3F32]/70"
              />
            </div>

            {/* Check-out Date */}
            <div className="flex-1 min-w-[200px] w-full sm:w-auto">
              <label className="block text-sm text-[#1C3F32]/70 mb-1">
                Check out
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-[#1C3F32]/70"
              />
            </div>

            {/* Guests Selection */}
            <div className="flex-1 min-w-[200px] w-full sm:w-auto">
              <label className="block text-sm text-[#1C3F32]/70 mb-1">
                Guests
              </label>
              <select className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-[#1C3F32]/70">
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>2 Adults, 1 Child</option>
                <option>2 Adults, 2 Children</option>
              </select>
            </div>

            {/* Book Now Button */}
            <div className="w-full sm:w-auto mt-3 sm:mt-0 flex justify-center sm:justify-start">
              <button className="bg-[#1C3F32] text-white w-full sm:w-auto px-8 py-2 rounded-md hover:bg-[#1C3F32]/90 transition-colors sm:mt-6">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Top Rated Rooms Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1C3F32] mb-6">
            Top Rated Rooms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {topRatedRooms.map((room, index) => (
              <RoomCard 
                key={index} 
                title={room.title}
                price={room.price}
                location={room.location}
                imageUrl={room.imageUrl}
                href={`/hotelRoomDetails/${room.category}/${room.title.toLowerCase().replace(/ /g, "-")}`}
              />
            ))}
          </div>
        </section>

        {/* Category Section */}
        <section>
          <h2 className="text-2xl font-bold text-[#1C3F32] mb-6">Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {categoryRooms.map((room, index) => (
              <RoomCard 
                key={index} 
                title={room.title}
                price={room.price}
                location={room.location}
                imageUrl={room.imageUrl}
                href={`/hotelRoomDetails/${room.category}`}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
} 