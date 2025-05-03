import Image from "next/image";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCheck, FaExclamationCircle } from "react-icons/fa";

export default function BookingsPage() {
  // Example booking data - in a real app, this would come from your backend
  const bookings = [
    {
      id: "BK-12345",
      roomType: "Superior Room",
      checkIn: "2023-08-15",
      checkOut: "2023-08-20",
      nights: 5,
      guests: 2,
      totalPrice: 16000,
      location: "Taguig, Metro Manila",
      status: "upcoming",
      image: "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677524/Rectangle_4170_oxttii.png"
    },
    {
      id: "BK-12256",
      roomType: "Business Elite Room",
      checkIn: "2023-10-05",
      checkOut: "2023-10-08",
      nights: 3,
      guests: 1,
      totalPrice: 13500,
      location: "Taguig, Metro Manila",
      status: "upcoming",
      image: "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677523/Rectangle_4179_diz8hh.png"
    },
    {
      id: "BK-10987",
      roomType: "Family Haven Suite",
      checkIn: "2023-05-01",
      checkOut: "2023-05-04",
      nights: 3,
      guests: 4,
      totalPrice: 24000,
      location: "Taguig, Metro Manila",
      status: "completed",
      image: "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4180_lptud5.png"
    },
    {
      id: "BK-10456",
      roomType: "Superior Room",
      checkIn: "2023-03-20",
      checkOut: "2023-03-22",
      nights: 2,
      guests: 2,
      totalPrice: 6400,
      location: "Taguig, Metro Manila",
      status: "completed",
      image: "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677524/Rectangle_4170_oxttii.png"
    }
  ];

  // Separate upcoming and past bookings
  const upcomingBookings = bookings.filter(booking => booking.status === "upcoming");
  const pastBookings = bookings.filter(booking => booking.status === "completed");

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format price function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(price);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-[#1C3F32] mb-8">My Bookings</h1>
      
      {/* Upcoming Bookings */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#1C3F32] mb-6">Upcoming Stays</h2>
        
        {upcomingBookings.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-600">You don't have any upcoming bookings.</p>
            <button className="mt-4 bg-[#1C3F32] text-white px-6 py-2 rounded-md hover:bg-[#1C3F32]/90 transition-colors">
              Book a Room
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Room Image */}
                  <div className="w-full md:w-1/4">
                    <div className="relative w-full h-32 md:h-full rounded-lg overflow-hidden">
                      <Image
                        src={booking.image}
                        alt={booking.roomType}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/300x200";
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Booking Details */}
                  <div className="w-full md:w-2/4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Upcoming
                      </span>
                      <span className="text-sm text-gray-500">Booking ID: {booking.id}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3">{booking.roomType}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#1C3F32]" />
                        <div>
                          <p className="text-sm text-gray-500">Check-in</p>
                          <p>{formatDate(booking.checkIn)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#1C3F32]" />
                        <div>
                          <p className="text-sm text-gray-500">Check-out</p>
                          <p>{formatDate(booking.checkOut)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-[#1C3F32]" />
                        <div>
                          <p className="text-sm text-gray-500">Guests</p>
                          <p>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#1C3F32]" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p>{booking.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price and Actions */}
                  <div className="w-full md:w-1/4 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Price</p>
                      <p className="text-2xl font-bold text-[#1C3F32]">{formatPrice(booking.totalPrice)}</p>
                      <p className="text-sm text-gray-500">{booking.nights} {booking.nights === 1 ? 'night' : 'nights'}</p>
                    </div>
                    
                    <div className="space-y-2 mt-4 md:mt-0">
                      <button className="w-full bg-[#1C3F32] text-white py-2 rounded-md hover:bg-[#1C3F32]/90 transition-colors">
                        Manage Booking
                      </button>
                      <button className="w-full border border-[#1C3F32] text-[#1C3F32] py-2 rounded-md hover:bg-gray-50 transition-colors">
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Past Bookings */}
      <div>
        <h2 className="text-2xl font-bold text-[#1C3F32] mb-6">Past Stays</h2>
        
        {pastBookings.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-600">You don't have any past bookings.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pastBookings.map((booking) => (
              <div key={booking.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Room Image */}
                  <div className="w-full md:w-1/4">
                    <div className="relative w-full h-32 md:h-full rounded-lg overflow-hidden">
                      <Image
                        src={booking.image}
                        alt={booking.roomType}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/300x200";
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Booking Details */}
                  <div className="w-full md:w-2/4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        Completed
                      </span>
                      <span className="text-sm text-gray-500">Booking ID: {booking.id}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3">{booking.roomType}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#1C3F32]" />
                        <div>
                          <p className="text-sm text-gray-500">Check-in</p>
                          <p>{formatDate(booking.checkIn)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#1C3F32]" />
                        <div>
                          <p className="text-sm text-gray-500">Check-out</p>
                          <p>{formatDate(booking.checkOut)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-[#1C3F32]" />
                        <div>
                          <p className="text-sm text-gray-500">Guests</p>
                          <p>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#1C3F32]" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p>{booking.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price and Actions */}
                  <div className="w-full md:w-1/4 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Price</p>
                      <p className="text-2xl font-bold text-[#1C3F32]">{formatPrice(booking.totalPrice)}</p>
                      <p className="text-sm text-gray-500">{booking.nights} {booking.nights === 1 ? 'night' : 'nights'}</p>
                    </div>
                    
                    <div className="space-y-2 mt-4 md:mt-0">
                      <button className="w-full bg-[#1C3F32] text-white py-2 rounded-md hover:bg-[#1C3F32]/90 transition-colors">
                        View Receipt
                      </button>
                      <button className="w-full border border-[#1C3F32] text-[#1C3F32] py-2 rounded-md hover:bg-gray-50 transition-colors">
                        Book Again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 