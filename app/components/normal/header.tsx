import React from "react";

const Header = () => {
  const backgroundImage =
    "https://res.cloudinary.com/ddnxfpziq/image/upload/v1744615019/wp12814592-4k-hotel-wallpapers_1_llbit3.png";
  return (
    <div
      className="w-full h-[600px] relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Content */}
      <div className="absolute inset-0 z-20">
        <div className="container mx-auto h-full flex items-center px-4">
          <div className="max-w-[693px]">
            <h1 className="font-bold text-[40px] text-white mb-4 font-inter">
              Discover elegant stays. Book your perfect room with us today
            </h1>
            <p className="text-white text-lg">
              Experience world-class stays in the heart of the Philippines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
