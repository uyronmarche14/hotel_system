import Image from "next/image";
import Link from "next/link";

interface RoomCardProps {
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  href: string;
}

const RoomCard = ({
  title,
  price,
  location,
  imageUrl,
  href,
}: RoomCardProps) => {
  return (
    <Link href={href}>
      <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <div className="relative h-48 w-full">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-[#1C3F32]">{title}</h3>
          <div className="mt-2">
            <p className="text-lg font-bold text-[#1C3F32]">
              ₱{price.toLocaleString()}{" "}
              <span className="text-sm text-[#1C3F32]/70">/Night</span>
            </p>
            <p className="text-sm text-[#1C3F32]/70">{location}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;
