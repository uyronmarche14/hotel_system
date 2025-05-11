"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/normal/header";
import RoomCard from "@/app/components/RoomCard";
import { getTopRatedRooms, getCategoryRooms } from "../data/rooms";

export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.push("/dashboard");
  }, [router]);

  const topRatedRooms = getTopRatedRooms();
  const categoryRooms = getCategoryRooms();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-center">
        <h1 className="text-xl text-[#1C3F32]">Redirecting to Dashboard...</h1>
      </div>
    </div>
  );
} 