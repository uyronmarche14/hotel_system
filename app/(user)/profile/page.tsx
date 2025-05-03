import Image from "next/image";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaCreditCard } from "react-icons/fa";

export default function ProfilePage() {
  // Example user data - in a real app, this would come from your backend
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (123) 456-7890",
    joined: "January 2023",
    address: "123 Main Street, New York, NY 10001",
    membershipLevel: "Gold",
    profilePic: "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744609832/user-profile-default.jpg",
    upcomingBookings: 1,
    pastBookings: 3,
    loyaltyPoints: 1250
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-[#1C3F32] mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Profile Info */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#1C3F32] mb-4">
                <Image
                  src={user.profilePic}
                  alt={user.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/150";
                  }}
                />
              </div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-[#1C3F32] font-medium">{user.membershipLevel} Member</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-[#1C3F32]" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaPhone className="text-[#1C3F32]" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{user.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-[#1C3F32]" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p>{user.joined}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-[#1C3F32]" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{user.address}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="w-full bg-[#1C3F32] text-white py-2 rounded-md hover:bg-[#1C3F32]/90 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-[#1C3F32] mb-4">Loyalty Program</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Your Points</p>
              <p className="text-3xl font-bold text-[#1C3F32]">{user.loyaltyPoints}</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">You need 750 more points to reach Platinum status</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[#1C3F32] h-2.5 rounded-full" style={{ width: "62%" }}></div>
            </div>
            <button className="w-full mt-4 border border-[#1C3F32] text-[#1C3F32] py-2 rounded-md hover:bg-gray-50 transition-colors">
              View Benefits
            </button>
          </div>
        </div>
        
        {/* Right column - Bookings & Settings */}
        <div className="col-span-1 md:col-span-2">
          {/* Bookings Summary */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-xl font-bold text-[#1C3F32] mb-4">Your Bookings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-3xl font-bold text-[#1C3F32]">{user.upcomingBookings}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Past Stays</p>
                <p className="text-3xl font-bold text-[#1C3F32]">{user.pastBookings}</p>
              </div>
            </div>
            <a href="/(user)/bookings" className="block w-full text-center bg-white border border-[#1C3F32] text-[#1C3F32] py-2 rounded-md hover:bg-gray-50 transition-colors">
              View All Bookings
            </a>
          </div>
          
          {/* Payment Methods */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#1C3F32]">Payment Methods</h3>
              <button className="text-[#1C3F32] hover:underline">+ Add New</button>
            </div>
            
            <div className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FaCreditCard className="text-xl text-[#1C3F32]" />
                  <div>
                    <p className="font-medium">Visa ending in 1234</p>
                    <p className="text-sm text-gray-500">Expires 09/25</p>
                  </div>
                </div>
                <div>
                  <span className="inline-block px-2 py-1 text-xs bg-[#1C3F32] text-white rounded">Default</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FaCreditCard className="text-xl text-[#1C3F32]" />
                  <div>
                    <p className="font-medium">Mastercard ending in 5678</p>
                    <p className="text-sm text-gray-500">Expires 11/26</p>
                  </div>
                </div>
                <div>
                  <button className="text-[#1C3F32] hover:underline text-sm">Set as default</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Account Settings */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-[#1C3F32] mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Email Notifications</p>
                  <div className="relative inline-block w-12 h-6">
                    <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                    <span className="absolute cursor-pointer inset-0 bg-[#1C3F32] rounded-full"></span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Receive updates about your bookings and special offers</p>
              </div>
              
              <div className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Two-Factor Authentication</p>
                  <div className="relative inline-block w-12 h-6">
                    <input type="checkbox" className="opacity-0 w-0 h-0" />
                    <span className="absolute cursor-pointer inset-0 bg-gray-300 rounded-full"></span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Language Preference</p>
                  <select className="border rounded p-1 text-sm">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 