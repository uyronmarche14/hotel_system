import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/app/components/ui/buttons";

const Navbar = () => {
  const logo =
    "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744609832/Vintage_and_Luxury_Hotel_Decorative_Ornamental_Logo_3_jm9wzq.png";
  return (
    <nav className="w-full h-24 flex items-center justify-between bg-custom-nav px-8">
      <div className="flex items-center gap-4">
        <Link href="/main" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
          <Image
            alt="logo"
            src={logo}
            width={70}
            height={70}
            className="object-contain"
          />
          <h1 className="cinzel text-3xl text-white font-bold">
            THE ANETOS PALACE
          </h1>
        </Link>
      </div>

      <div className="hidden md:flex space-x-8">
        {[
          { name: "Home", path: "/main" },
          { name: "About", path: "/about" },
          { name: "Rooms", path: "/rooms" },
          { name: "Contact", path: "/contact" },
          { name: "Services", path: "/services" }
        ].map((item, index) => (
          <Link
            key={index}
            href={item.path}
            className="text-white hover:text-gray-200 transition-colors duration-200 font-medium hover:underline"
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="flex gap-4">
        <Link href="/login">
          <Button
            label="Sign In"
            className="h-10 w-32 hover:bg-opacity-90 transition-colors duration-200"
          />
        </Link>
        <Link href="/register">
          <Button
            variant="secondary"
            label="Register"
            className="h-10 w-32 hover:bg-opacity-90 transition-colors duration-200"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
