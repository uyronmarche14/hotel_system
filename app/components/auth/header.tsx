import React from "react";
import Image from "next/image";
import Link from "next/link";

const AuthHeader = () => {
  const logo = "https://res.cloudinary.com/ddnxfpziq/image/upload/v1746767008/preview__1_-removebg-preview_xrlzgr.png";

  return (
    <header className="cinzel w-full h-auto py-3 sm:h-24 flex flex-wrap items-center bg-brand-green shadow-md px-4 sm:px-8">
      <div className="max-w-screen-2xl mx-auto w-full">
        <Link href="/main" className="flex items-center gap-2 sm:gap-4 hover:opacity-90 transition-opacity">
          <Image
            alt="logo"
            src={logo}
            width={50}
            height={50}
            className="object-contain sm:w-[70px] sm:h-[70px]"
          />
          <h1 className="font-cinzel text-xl sm:text-2xl md:text-3xl text-white font-bold">
            THE SOLAS MANOR
          </h1>
        </Link>
      </div>
    </header>
  );
};

export default AuthHeader; 