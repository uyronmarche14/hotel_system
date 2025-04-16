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
}

const topRatedRooms: RoomType[] = [
  {
    title: "Superior Room",
    price: 3200,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677524/Rectangle_4170_oxttii.png",
    href: "/rooms/superior",
    rating: 4.0,
    reviews: 85,
    amenities: [
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector-1_tjpgwl.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766965/Vector-2_hhc5s7.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector_vursrq.png",
    ],
  },
  {
    title: "Business Elite Room",
    price: 4500,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677523/Rectangle_4179_diz8hh.png",
    href: "/rooms/business-elite",
    rating: 4.5,
    reviews: 95,
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
    href: "/rooms/family-haven",
    rating: 4.8,
    reviews: 110,
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
    amenities: [
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector-1_tjpgwl.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766965/Vector-2_hhc5s7.png",
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744766963/Vector_vursrq.png",
    ],
  },
];

const categoryRooms: RoomType[] = [
  {
    title: "Standard Rooms",
    price: 2800,
    location: "Taguig, Metro Manila",
    imageUrl:
      "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744677523/Rectangle_4170_1_rbpgkp.png",
    href: "/category/standard",
    rating: 4.0,
    reviews: 75,
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
  },
];

export { topRatedRooms, categoryRooms };
