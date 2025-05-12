import Image from "next/image";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Auth form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      
      {/* Right side - Hotel image */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <Image
              src="https://res.cloudinary.com/ddnxfpziq/image/upload/v1746813924/2_vkjogl.jpg" 
              alt="The Solace Manor"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white text-center">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-md">
                <h2 className="text-2xl font-cinzel mb-2">THE SOLACE MANOR</h2>
                <p className="text-sm opacity-80">Experience luxury beyond comparison</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 