export interface RoomType {
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  href: string;
  rating?: number;
  reviews?: number;
  description?: string;
  size?: string;
  amenities?: string[];
  category: string; // Change to string to allow more flexibility
  fullDescription?: string;
  features?: string[];
  maxOccupancy?: number;
  bedType?: string;
  roomSize?: string;
  viewType?: string;
  additionalAmenities?: string[];
}

const rooms: RoomType[] = [
  {
    title: "Superior Room",
    price: 3200,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677524/Rectangle_4170_oxttii.png",
    href: "/pages/hotelRoomDetails/standard/superior-room",
    rating: 4.0,
    reviews: 85,
    description:
      "Modern comfort meets functionality in our Superior Room. Featuring a plush queen-size bed, work desk, and city views. Perfect for business travelers and couples seeking quality accommodation.",
    category: "standard",
    amenities: [
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector-1_tjpgwl.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766965/Vector-2_hhc5s7.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector_vursrq.png",
    ],
    fullDescription:
      "Experience modern luxury in our Superior Room. This thoughtfully designed space combines comfort with functionality, perfect for both business and leisure travelers. Wake up to stunning city views through floor-to-ceiling windows, work comfortably at the ergonomic desk, and enjoy a peaceful night's sleep on our premium queen-size bed.",
    features: [
      "Floor-to-ceiling windows",
      "Work desk",
      "Seating area",
      "Mini bar",
    ],
    maxOccupancy: 2,
    bedType: "1 Queen-size bed",
    roomSize: "32 sq.m",
    viewType: "City view",
    additionalAmenities: [
      "24/7 room service",
      "Daily housekeeping",
      "High-speed WiFi",
      "Smart TV",
    ],
  },
  {
    title: "Business Elite Room",
    price: 4500,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677523/Rectangle_4179_diz8hh.png",
    href: "/pages/hotelRoomDetails/executive/business-elite",
    rating: 4.5,
    reviews: 95,
    description:
      "Designed for the discerning business traveler, our Business Elite Room offers enhanced amenities including a dedicated workspace, high-speed internet, and complimentary breakfast.",
    category: "executive",
    amenities: [
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector-1_tjpgwl.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766965/Vector-2_hhc5s7.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector_vursrq.png",
    ],
  },
  {
    title: "Family Haven Suite",
    price: 8000,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4180_lptud5.png",
    href: "/pages/hotelRoomDetails/family-friendly/family-haven",
    rating: 4.8,
    reviews: 110,
    description:
      "Spacious suite perfect for families, featuring two bedrooms, a living area, and child-friendly amenities. Enjoy panoramic views and access to family entertainment options.",
    category: "family-friendly",
    amenities: [
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector-1_tjpgwl.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766965/Vector-2_hhc5s7.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector_vursrq.png",
    ],
  },
  {
    title: "Grand Royale Room",
    price: 18000,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4181_d5siz2.png",
    href: "/rooms/grand-royale",
    rating: 4.9,
    reviews: 150,
    description:
      "Experience luxury at its finest in our Grand Royale Room. Featuring premium furnishings, a private balcony, and exclusive access to our VIP lounge with panoramic city views.",
    category: "luxury",
    amenities: [
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector-1_tjpgwl.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766965/Vector-2_hhc5s7.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector_vursrq.png",
    ],
  },
  {
    title: "Imperial Palace Suite",
    price: 25000,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4182_f1afdf.png",
    href: "/rooms/imperial-palace",
    rating: 5.0,
    reviews: 200,
    description:
      "Our most prestigious accommodation, the Imperial Palace Suite offers unparalleled luxury with a master bedroom, dining room, and private butler service. The epitome of elegant living.",
    category: "palace-inspired",
    amenities: [
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector-1_tjpgwl.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766965/Vector-2_hhc5s7.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector_vursrq.png",
    ],
  },
  {
    title: "Standard Rooms",
    price: 2800,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677523/Rectangle_4170_1_rbpgkp.png",
    href: "/category/standard",
    rating: 4.0,
    reviews: 75,
    category: "standard",
    description:
      "Comfortable and well-appointed standard rooms offering essential amenities for a pleasant stay. Includes modern bathroom, TV, and complimentary Wi-Fi.",
    amenities: [
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector-1_tjpgwl.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766965/Vector-2_hhc5s7.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector_vursrq.png",
    ],
  },
  {
    title: "Executive / Business Rooms",
    price: 3800,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744678121/Rectangle_4179_1_ccdrgd.png",
    href: "/category/executive",
    rating: 4.3,
    reviews: 90,
    category: "executive",
    description:
      "Our Executive / Business Rooms are designed for professionals. Featuring a spacious work area, ergonomic chair, and high-speed internet to ensure productivity during your stay.",
    amenities: [
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector-1_tjpgwl.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766965/Vector-2_hhc5s7.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector_vursrq.png",
    ],
  },
  {
    title: "Family-Friendly Rooms",
    price: 9500,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677523/Rectangle_4180_1_ucplwd.png",
    href: "/category/family",
    rating: 4.6,
    reviews: 120,
    category: "family-friendly",
    description:
      "Ideal for families, these rooms offer extra space and child-friendly amenities. Enjoy a comfortable stay with a king-size bed, bunk beds for kids, and a play area.",
    amenities: [
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector-1_tjpgwl.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766965/Vector-2_hhc5s7.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector_vursrq.png",
    ],
  },
  {
    title: "Luxury Rooms",
    price: 15000,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4181_1_xvlrwu.png",
    href: "/category/luxury",
    rating: 4.8,
    reviews: 180,
    category: "luxury",
    description:
      "Indulge in our Luxury Rooms, featuring elegant decor, premium bedding, and a private balcony. Enjoy exclusive access to our spa and wellness center.",
    amenities: [
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector-1_tjpgwl.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766965/Vector-2_hhc5s7.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector_vursrq.png",
    ],
  },
  {
    title: "Palace-Inspired / Royal Suites",
    price: 30000,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4182_1_n68tmf.png",
    href: "/category/palace",
    rating: 5.0,
    reviews: 220,
    category: "palace-inspired",
    description:
      "Experience royal treatment in our Palace-Inspired / Royal Suites. Featuring opulent furnishings, a grand living area, and personalized butler service.",
    amenities: [
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector-1_tjpgwl.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766965/Vector-2_hhc5s7.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector_vursrq.png",
    ],
  },
];

// Helper functions
export const getTopRatedRooms = () =>
  [...rooms].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);

export const getRoomsByCategory = (category: string) => {
  const roomsInCategory = rooms.filter((room) => room.category === category);
  // Return only the highest rated room for each category
  return roomsInCategory
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 1);
};

export const getAllRooms = () => rooms;

export { rooms };
