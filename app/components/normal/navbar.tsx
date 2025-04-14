import React from "react";
import Image from "next/image";
import Link from "next/link";
import Home from "@/app/page";
import Button from "@/app/components/ui/buttons";

const Navbar = () => {
  const logo =
    "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744609832/Vintage_and_Luxury_Hotel_Decorative_Ornamental_Logo_3_jm9wzq.png";
  return (
    <nav className="w-full h-24 flex items-center justify-between bg-custom-nav px-8">
      <div className="flex items-center gap-4">
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
      </div>

      <div className="hidden md:flex space-x-8">
        {["Home", "About", "Contact", "Services"].map((item, index) => (
          <Link
            key={index}
            href={item === "Home" ? "/" : `/pages/${item.toLowerCase()}`}
            className="text-white hover:text-gray-200 transition-colors duration-200"
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex gap-4">
        <Button
          label="Sign In"
          className="h-10 w-32 hover:bg-opacity-90 transition-colors duration-200"
        />
        <Button
          variant="secondary"
          label="Register"
          className="h-10 w-32 hover:bg-opacity-90 transition-colors duration-200"
        />
      </div>
    </nav>
  );
};

export default Navbar;
