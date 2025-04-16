import Image from "next/image";
import Link from "next/link";
import { RoomType } from "@/app/data/rooms";

const RoomCard: React.FC<RoomType> = ({
  title,
  price,
  location,
  imageUrl,
  href,
}) => {
  return (
    <Link href={href}>
      <div className="rounded-lg overflow-hidden">
        <div className="relative h-48 w-full">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
        <div className="py-4">
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
