"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import AdminLayout from "@/app/components/layouts/AdminLayout";
import RoomImageManager from "@/app/components/admin/RoomImageManager";
import { getAdminData } from "@/app/utils/admin-api-helper";
import { API_URL } from "@/app/lib/constants";

interface RoomData {
  id: string;
  title: string;
  imageUrl: string;
  images: string[];
}

export default function ManageRoomImages() {
  const [room, setRoom] = useState<RoomData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  // Use explicit type assertion since Next.js guarantees params in dynamic routes
  const params = useParams() as { id: string };
  const roomId = params.id;

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) {
        setError("Room ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Use the admin API helper utility
        const roomData = await getAdminData<RoomData>(`rooms/${roomId}`);
        
        if (roomData) {
          console.log('Successfully fetched room data:', roomData);
          setRoom(roomData);
        } else {
          setError("Room not found");
        }
      } catch (error: unknown) {
        console.error("Error fetching room:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching room data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId]);

  const handleImageUpdate = async (mainImage: string, images: string[]) => {
    setSuccess("Images updated successfully!");
    
    // Update local state
    setRoom(prev => prev ? {
      ...prev,
      imageUrl: mainImage,
      images: images
    } : null);
    
    // Clear success message after a delay
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Manage Room Images
          </h1>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={() => router.push('/admin/rooms')}
          >
            Back to Rooms
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : room ? (
          <>
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{room.title}</h2>
              <p className="text-gray-600 mb-4">ID: {room.id}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
              <RoomImageManager
                roomId={roomId}
                initialMainImage={room.imageUrl}
                initialImages={room.images || []}
                onUpdate={handleImageUpdate}
              />
            </div>
          </>
        ) : (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Room not found
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
