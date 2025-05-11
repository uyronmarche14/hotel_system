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
    category: "standard",
    description:
      "Comfortable and well-appointed standard rooms offering essential amenities for a pleasant stay. Includes modern bathroom, TV, and complimentary Wi-Fi.",
    amenities: [
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector-1_tjpgwl.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766965/Vector-2_hhc5s7.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector_vursrq.png",
    ],
    fullDescription:
      "Our Standard Rooms provide a perfect blend of comfort and convenience at great value. These thoughtfully designed spaces feature contemporary décor and all the essential amenities needed for a relaxing stay. Each room offers a comfortable double bed with quality linens, a well-appointed bathroom with shower, and a work desk for those needing to stay productive. The warm lighting and neutral color palette create a welcoming atmosphere for guests to unwind after a day of exploration or business.",
    features: [
      "LCD TV with cable channels",
      "Work desk and chair",
      "Electronic safe",
      "Blackout curtains",
    ],
    maxOccupancy: 2,
    bedType: "1 Double bed",
    roomSize: "28 sq.m",
    viewType: "City view",
    additionalAmenities: [
      "Complimentary WiFi",
      "Daily housekeeping",
      "Tea and coffee making facilities",
      "Hair dryer",
    ],
  },
  {
    title: "Executive / Business Rooms",
    price: 3800,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744678121/Rectangle_4179_1_ccdrgd.png",
    href: "/hotelRoomDetails/executive",
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
    fullDescription:
      "Our Executive / Business Rooms are meticulously designed to meet the needs of today's business travelers. These rooms provide an ideal environment for productivity and relaxation, featuring a dedicated work area with an ergonomic chair and ample desk space. The rooms are equipped with enhanced technological amenities including high-speed WiFi, multiple power outlets, and a multimedia hub. After a productive day, relax in the comfortable king-size bed or unwind in the well-appointed sitting area with views of the business district.",
    features: [
      "Large work desk",
      "Ergonomic office chair",
      "In-room laptop safe",
      "USB charging ports",
    ],
    maxOccupancy: 2,
    bedType: "1 King-size bed",
    roomSize: "36 sq.m",
    viewType: "Business district view",
    additionalAmenities: [
      "Business center access",
      "Express check-in/out",
      "Complimentary shoe shine",
      "Press reader access",
    ],
  },
  {
    title: "Family-Friendly Rooms",
    price: 9500,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677523/Rectangle_4180_1_ucplwd.png",
    href: "/hotelRoomDetails/family-friendly",
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
    fullDescription:
      "Our Family-Friendly Rooms are specially designed to ensure a comfortable and enjoyable stay for guests of all ages. These spacious accommodations feature a master area with a king-size bed for parents and a separate sleeping area with bunk beds or twin beds for children. The rooms include thoughtful amenities such as child-proof electrical outlets, step stools in the bathroom, and a designated play corner with age-appropriate toys and games. Parents will appreciate the convenience of a mini-refrigerator, microwave, and extra storage space for family essentials.",
    features: [
      "Separate sleeping areas",
      "Child play corner",
      "Family entertainment system",
      "Extra storage space",
    ],
    maxOccupancy: 4,
    bedType: "1 King-size bed and bunk beds/twin beds",
    roomSize: "58 sq.m",
    viewType: "Garden view",
    additionalAmenities: [
      "Child-friendly bathroom amenities",
      "Mini-refrigerator",
      "Microwave",
      "Baby cot available on request",
    ],
  },
  {
    title: "Luxury Rooms",
    price: 15000,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4181_1_xvlrwu.png",
    href: "/hotelRoomDetails/luxury",
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
    fullDescription:
      "Our Luxury Rooms represent the epitome of sophisticated comfort and elegance. Each room is meticulously designed with handpicked furnishings, original artwork, and bespoke décor elements that create a sense of refined luxury. The plush king-size bed features premium linens and a pillow menu to ensure the perfect night's sleep. Step onto your private balcony to enjoy spectacular views while sipping a beverage from the premium mini-bar. The marble bathroom offers both a deep soaking tub and a separate rain shower, complemented by luxury toiletries and plush bathrobes.",
    features: [
      "Private furnished balcony",
      "Designer furniture",
      "Marble bathroom",
      "Premium entertainment system",
    ],
    maxOccupancy: 2,
    bedType: "1 King-size bed with pillow menu",
    roomSize: "46 sq.m",
    viewType: "Premium skyline view",
    additionalAmenities: [
      "Spa access",
      "Evening turndown service",
      "Premium mini-bar",
      "Luxury bath amenities",
    ],
  },
  {
    title: "Palace-Inspired / Royal Suites",
    price: 30000,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4182_1_n68tmf.png",
    href: "/hotelRoomDetails/palace-inspired",
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
    fullDescription:
      "Our Palace-Inspired / Royal Suites offer an extraordinary experience of grandeur and sophistication. These magnificent accommodations feature a spacious master bedroom with a custom emperor-size bed, a separate living room with opulent furnishings, and a formal dining area perfect for entertaining. The extravagant bathroom features gold-plated fixtures, a Jacuzzi tub, and a steam shower. Throughout your stay, enjoy the attentive service of your dedicated butler, ready to fulfill your every wish. Each suite is adorned with crystal chandeliers, hand-painted murals, and luxury fabrics that create an atmosphere of regal splendor.",
    features: [
      "Grand living and dining areas",
      "Master bedroom with canopy bed",
      "Crystal chandeliers",
      "Decorative fireplaces",
    ],
    maxOccupancy: 2,
    bedType: "1 Emperor-size bed with luxury linens",
    roomSize: "120 sq.m",
    viewType: "Panoramic city and sea view",
    additionalAmenities: [
      "Dedicated butler service",
      "Chauffeur-driven limousine service",
      "In-suite dining with private chef option",
      "Private check-in/out in suite",
    ],
  },
];

// Helper functions
export const getTopRatedRooms = () =>
  [...rooms].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);

export const getRoomsByCategory = (category: string) => {
  const roomsInCategory = rooms.filter((room) => room.category === category);
  return roomsInCategory;
};

export const getCategoryRooms = () => {
  const categories = [...new Set(rooms.map(room => room.category))];
  return categories.map(category => {
    const roomsInCategory = rooms.filter(room => room.category === category);
    return roomsInCategory.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  });
};

export const getAllRooms = () => rooms;

export { rooms };
