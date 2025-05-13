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
  category: string;
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
    href: "/hotelRoomDetails/standard/superior-room",
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
    href: "/hotelRoomDetails/executive/business-elite",
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
    fullDescription:
      "Our Business Elite Room is thoughtfully designed for the discerning professional. This spacious accommodation provides an ideal environment for work and relaxation. The room features a large executive desk with ergonomic chair, high-speed WiFi, and multiple charging ports. After a productive day, unwind on the premium king-size bed or enjoy the panoramic views of the bustling business district.",
    features: [
      "Executive work desk",
      "Ergonomic office chair",
      "Multiple charging ports",
      "LED desk lamp",
    ],
    maxOccupancy: 2,
    bedType: "1 King-size bed",
    roomSize: "38 sq.m",
    viewType: "Business district view",
    additionalAmenities: [
      "Complimentary breakfast",
      "Express check-in/out",
      "Nespresso coffee machine",
      "Evening turndown service",
    ],
  },
  {
    title: "Family Haven Suite",
    price: 8000,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4180_lptud5.png",
    href: "/hotelRoomDetails/family-friendly/family-haven",
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
    fullDescription:
      "The Family Haven Suite offers the perfect retreat for families seeking comfort and convenience. This spacious two-bedroom suite provides ample space for everyone to relax and enjoy. The master bedroom features a king-size bed, while the second bedroom comes with two twin beds ideal for children. The separate living area includes a comfortable sofa, dining table, and entertainment center to create lasting family memories.",
    features: [
      "Two separate bedrooms",
      "Spacious living area",
      "Child-friendly furniture",
      "Family entertainment system",
    ],
    maxOccupancy: 4,
    bedType: "1 King-size bed and 2 Twin beds",
    roomSize: "65 sq.m",
    viewType: "Park view",
    additionalAmenities: [
      "Children's welcome kit",
      "Baby cot available on request",
      "Family board games",
      "Kid-friendly menu options",
    ],
  },
  {
    title: "Grand Royale Room",
    price: 18000,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4181_d5siz2.png",
    href: "/hotelRoomDetails/luxury/grand-royale-room",
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
    fullDescription:
      "The Grand Royale Room represents the pinnacle of luxury accommodation. Each detail has been meticulously designed to create an atmosphere of opulence and refinement. The room features hand-selected furnishings, premium bedding, and floor-to-ceiling windows that frame spectacular city views. Step onto your private balcony to savor the panoramic vistas, or unwind in the marble-clad bathroom with deep soaking tub and separate rain shower.",
    features: [
      "Private balcony",
      "Marble bathroom",
      "Deep soaking tub",
      "Walk-in closet",
    ],
    maxOccupancy: 2,
    bedType: "1 King-size bed with premium linens",
    roomSize: "52 sq.m",
    viewType: "Premium city skyline view",
    additionalAmenities: [
      "VIP lounge access",
      "Personal concierge service",
      "Premium toiletries",
      "Complimentary champagne",
    ],
  },
  {
    title: "Imperial Palace Suite",
    price: 25000,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4182_f1afdf.png",
    href: "/hotelRoomDetails/palace-inspired/imperial-palace-suite",
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
    fullDescription:
      "The Imperial Palace Suite represents the pinnacle of luxury accommodation, offering an unparalleled experience of opulence and sophistication. This magnificent suite features a grand master bedroom with a custom king-size bed, a separate living room with designer furnishings, and a formal dining area that can seat up to eight guests. The palatial bathroom includes a Jacuzzi tub, steam shower, and dual vanities with premium fixtures. Throughout your stay, enjoy the attentive service of your dedicated butler, available 24/7 to fulfill your every request.",
    features: [
      "Separate living and dining areas",
      "Master bedroom with walk-in wardrobe",
      "Palatial bathroom with Jacuzzi",
      "Kitchenette with premium appliances",
    ],
    maxOccupancy: 2,
    bedType: "1 Custom king-size bed with Egyptian cotton sheets",
    roomSize: "98 sq.m",
    viewType: "360° panoramic view",
    additionalAmenities: [
      "24/7 private butler service",
      "In-suite dining experience",
      "Luxury car airport transfer",
      "Exclusive access to all hotel facilities",
    ],
  },
  {
    title: "Standard Rooms",
    price: 2800,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677523/Rectangle_4170_1_rbpgkp.png",
    href: "/hotelRoomDetails/standard",
    rating: 4.0,
    reviews: 75,
    description:
      "Our Standard Room category offers comfortable accommodation with modern amenities. Choose from a variety of options to suit your stay.",
    category: "standard",
    amenities: [
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector-1_tjpgwl.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766965/Vector-2_hhc5s7.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector_vursrq.png",
    ],
  },
  {
    title: "Executive Rooms",
    price: 4200,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677523/Rectangle_4179_1_vd53oe.png",
    href: "/hotelRoomDetails/executive",
    rating: 4.6,
    reviews: 90,
    description:
      "Premium accommodation for business travelers with enhanced amenities, dedicated workspace, and exclusive access to the Executive Lounge.",
    category: "executive",
    amenities: [
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector-1_tjpgwl.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766965/Vector-2_hhc5s7.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector_vursrq.png",
    ],
  },
  {
    title: "Family-Friendly Suites",
    price: 7500,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677523/Rectangle_4180_1_kq6cya.png",
    href: "/hotelRoomDetails/family-friendly",
    rating: 4.7,
    reviews: 105,
    description:
      "Specially designed suites for families with children, featuring spacious accommodations, child-friendly amenities, and thoughtful touches for a memorable family vacation.",
    category: "family-friendly",
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
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4181_1_ksdwx0.png",
    href: "/hotelRoomDetails/luxury",
    rating: 4.8,
    reviews: 120,
    description:
      "Indulge in our collection of luxury rooms offering premium amenities, sophisticated design, and personalized service for an extraordinary stay experience.",
    category: "luxury",
    amenities: [
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector-1_tjpgwl.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766965/Vector-2_hhc5s7.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector_vursrq.png",
    ],
  },
  {
    title: "Palace-Inspired Suites",
    price: 22000,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677523/Rectangle_4182_1_uu8kk7.png",
    href: "/hotelRoomDetails/palace-inspired",
    rating: 4.9,
    reviews: 180,
    description:
      "Our most exquisite accommodations inspired by royal residences, featuring opulent décor, expansive spaces, and white-glove butler service for an unforgettable luxury experience.",
    category: "palace-inspired",
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
  return rooms.filter((room) => room.category === category);
};

export const getCategoryRooms = () => {
  const categories = [...new Set(rooms.map((room) => room.category))];
  return categories.map((category) => {
    return rooms.find((room) => room.category === category);
  });
};

export const getAllRooms = () => rooms;

export { rooms };
