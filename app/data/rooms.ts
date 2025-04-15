import {
  FaSwimmingPool,
  FaWifi,
  FaParking,
  FaUtensils,
  FaCoffee,
  FaDumbbell,
  FaSpa,
  FaCocktail,
  FaBed,
  FaTv,
  FaSnowflake,
  FaCar,
  FaBath,
  FaConciergeBell,
} from "react-icons/fa";

interface Amenity {
  icon: React.ElementType;
  label: string;
}

interface RoomType {
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  href: string;
  rating?: number;
  reviews?: number;
  description?: string;
  size?: string;
  amenities?: Amenity[];
}

export const topRatedRooms: RoomType[] = [
  {
    title: "Prestige Suite",
    price: 15000,
    location: "Singapore",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677524/Rectangle_4170_oxttii.png", // Replace with actual image URL
    href: "/rooms/prestige-suite",
    rating: 5.0,
    reviews: 120,
    description:
      "With a stay at The Fullerton Hotel Singapore, you'll be centrally located in Singapore, steps from Cavenagh Bridge and Anderson Bridge. This 5-star hotel is close to Chinatown Heritage Center and Universal Studios Singapore.",
    size: "285 x 200",
    amenities: [
      { icon: FaSwimmingPool, label: "Pool Access" },
      { icon: FaWifi, label: "Free High-Speed WiFi" },
      { icon: FaParking, label: "Free Parking" },
      { icon: FaUtensils, label: "Fine Dining" },
      { icon: FaSpa, label: "Spa Services" },
      { icon: FaCocktail, label: "Mini Bar" },
      { icon: FaConciergeBell, label: "24/7 Concierge" },
      { icon: FaBath, label: "Luxury Bathroom" },
    ],
  },
  {
    title: "Superior Room",
    price: 3200,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677524/Rectangle_4170_oxttii.png",
    href: "/rooms/superior",
    amenities: [
      { icon: FaWifi, label: "Free WiFi" },
      { icon: FaTv, label: "Smart TV" },
      { icon: FaSnowflake, label: "Air Conditioning" },
      { icon: FaCoffee, label: "Coffee Maker" },
    ],
  },
  {
    title: "Business Elite Room",
    price: 4500,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677523/Rectangle_4179_diz8hh.png",
    href: "/rooms/business-elite",
    amenities: [
      { icon: FaWifi, label: "High-Speed WiFi" },
      { icon: FaParking, label: "Reserved Parking" },
      { icon: FaCoffee, label: "Premium Coffee Bar" },
      { icon: FaUtensils, label: "Room Service" },
      { icon: FaConciergeBell, label: "Business Concierge" },
    ],
  },
  {
    title: "Family Haven Suite",
    price: 8000,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4180_lptud5.png",
    href: "/rooms/family-haven",
    amenities: [
      { icon: FaWifi, label: "Free WiFi" },
      { icon: FaBed, label: "Extra Beds" },
      { icon: FaUtensils, label: "Kitchenette" },
      { icon: FaTv, label: "Multiple TVs" },
      { icon: FaParking, label: "Family Parking" },
    ],
  },
  {
    title: "Grand Royale Room",
    price: 18000,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4181_d5siz2.png",
    href: "/rooms/grand-royale",
    amenities: [
      { icon: FaSwimmingPool, label: "Private Pool" },
      { icon: FaSpa, label: "In-Room Spa" },
      { icon: FaUtensils, label: "Personal Chef" },
      { icon: FaCar, label: "Luxury Transport" },
      { icon: FaConciergeBell, label: "Butler Service" },
      { icon: FaCocktail, label: "Premium Bar" },
    ],
  },
  {
    title: "Imperial Palace Suite",
    price: 25000,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4182_f1afdf.png",
    href: "/rooms/imperial-palace",
    amenities: [
      { icon: FaSwimmingPool, label: "Private Pool & Jacuzzi" },
      { icon: FaSpa, label: "Private Spa" },
      { icon: FaUtensils, label: "Gourmet Kitchen" },
      { icon: FaCar, label: "Chauffeur Service" },
      { icon: FaConciergeBell, label: "24/7 Butler" },
      { icon: FaDumbbell, label: "Private Gym" },
      { icon: FaCocktail, label: "Wine Cellar" },
    ],
  },
];

export const categoryRooms = [
  {
    title: "Standard Rooms",
    price: 2800,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677523/Rectangle_4170_1_rbpgkp.png",
    href: "/category/standard",
  },
  {
    title: "Executive / Business Rooms",
    price: 3800,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744678121/Rectangle_4179_1_ccdrgd.png",
    href: "/category/executive",
  },
  {
    title: "Family-Friendly Rooms",
    price: 9500,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677523/Rectangle_4180_1_ucplwd.png",
    href: "/category/family",
  },
  {
    title: "Luxury Rooms",
    price: 15000,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4181_1_xvlrwu.png",
    href: "/category/luxury",
  },
  {
    title: "Palace-Inspired / Royal Suites",
    price: 30000,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677522/Rectangle_4182_1_n68tmf.png",
    href: "/category/palace",
  },
];
