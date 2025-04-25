"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Correctly define Button component import or create a custom button
const Button = ({ label, onClick, variant = "primary", className = "" }) => {
  const baseClasses = "px-4 py-2 rounded font-medium";
  const variantClasses =
    variant === "primary"
      ? "bg-[#1C3F32F0] border-1 border-white text-white"
      : "bg-white  text-[#1C3F32F0]";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {label}
    </button>
  );
};

const Navbar = () => {
  const router = useRouter();
  const logo =
    "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744609832/Vintage_and_Luxury_Hotel_Decorative_Ornamental_Logo_3_jm9wzq.png";

  // Handle navigation properly
  const handleLogin = () => {
    router.push("/pages/auth/login");
  };

  const handleRegister = () => {
    router.push("/pages/auth/register");
  };

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
          THE SOLACE MANOR
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
          onClick={handleLogin}
          label="Register"
          className="h-10 w-32 hover:bg-opacity-90  duration-200"
        />
        <Button
          variant="secondary"
          label="Sign In"
          onClick={handleRegister}
          className="h-10 w-32 hover:bg-opacity-90 duration-200"
        />
      </div>
    </nav>
  );
};

export default Navbar;
