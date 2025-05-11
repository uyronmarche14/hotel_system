"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/app/components/ui/buttons";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logo ="https://res.cloudinary.com/ddnxfpziq/image/upload/v1746767008/preview__1_-removebg-preview_xrlzgr.png";
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const navLinks = [
    { name: "Home", path: "/main" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="w-full h-auto py-3 sm:h-24 flex flex-wrap items-center justify-between bg-custom-nav px-4 sm:px-8">
      <div className="flex items-center gap-2 sm:gap-4">
        <Link href="/main" className="flex items-center gap-2 sm:gap-4 hover:opacity-90 transition-opacity">
          <Image
            alt="logo"
            src={logo}
            width={50}
            height={50}
            className="object-contain sm:w-[70px] sm:h-[70px]"
          />
          <h1 className="cinzel text-xl sm:text-2xl md:text-3xl text-white font-bold truncate">
            THE SOLAS MANOR
          </h1>
        </Link>
      </div>

      {/* Mobile menu button */}
      <div className="flex md:hidden items-center ml-auto mr-2">
        <button 
          onClick={toggleMobileMenu}
          className="text-white hover:text-gray-200 transition-colors p-2"
        >
          {mobileMenuOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-8">
        {navLinks.map((item, index) => (
          <Link
            key={index}
            href={item.path}
            className="text-white hover:text-gray-200 transition-colors duration-200 font-medium hover:underline"
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Authentication Buttons */}
      <div className="hidden md:flex gap-4">
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="w-full md:hidden mt-4 pb-3">
          <div className="flex flex-col space-y-4">
            {navLinks.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className="text-white hover:text-gray-200 transition-colors duration-200 font-medium hover:underline px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="flex mt-4 gap-2 px-2">
              <Link href="/login" className="flex-1">
                <Button
                  label="Sign In"
                  className="h-10 w-full hover:bg-opacity-90 transition-colors duration-200"
                />
              </Link>
              <Link href="/register" className="flex-1">
                <Button
                  variant="secondary"
                  label="Register"
                  className="h-10 w-full hover:bg-opacity-90 transition-colors duration-200"
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
