import Header from "@/app/components/normal/header";
import Footer from "@/app/components/normal/footer";
import RoomCard from "@/app/components/RoomCard";

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
            <RoomCard
              title="Superior Room"
              price={3200}
              location="Taguig, Metro Manila"
              imageUrl="/rooms/superior-room.jpg"
              href="/rooms/superior"
            />
            <RoomCard
              title="Business Elite Room"
              price={4500}
              location="Taguig, Metro Manila"
              imageUrl="/rooms/business-elite.jpg"
              href="/rooms/business-elite"
            />
            <RoomCard
              title="Family Haven Suite"
              price={8000}
              location="Taguig, Metro Manila"
              imageUrl="/rooms/family-haven.jpg"
              href="/rooms/family-haven"
            />
            <RoomCard
              title="Grand Royale Room"
              price={18000}
              location="Taguig, Metro Manila"
              imageUrl="/rooms/grand-royale.jpg"
              href="/rooms/grand-royale"
            />
            <RoomCard
              title="Imperial Palace Suite"
              price={25000}
              location="Taguig, Metro Manila"
              imageUrl="/rooms/imperial-palace.jpg"
              href="/rooms/imperial-palace"
            />
          </div>
        </section>

        {/* Category Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <RoomCard
              title="Standard Rooms"
              price={2800}
              location="Taguig, Metro Manila"
              imageUrl="/rooms/standard.jpg"
              href="/category/standard"
            />
            <RoomCard
              title="Executive / Business Rooms"
              price={3800}
              location="Taguig, Metro Manila"
              imageUrl="/rooms/executive.jpg"
              href="/category/executive"
            />
            <RoomCard
              title="Family-Friendly Rooms"
              price={9500}
              location="Taguig, Metro Manila"
              imageUrl="/rooms/family.jpg"
              href="/category/family"
            />
            <RoomCard
              title="Luxury Rooms"
              price={15000}
              location="Taguig, Metro Manila"
              imageUrl="/rooms/luxury.jpg"
              href="/category/luxury"
            />
            <RoomCard
              title="Palace-Inspired / Royal Suites"
              price={30000}
              location="Taguig, Metro Manila"
              imageUrl="/rooms/palace.jpg"
              href="/category/palace"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
