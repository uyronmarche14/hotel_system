"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  FaBed,
  FaDoorOpen,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import AdminLayout from "@/app/components/layouts/AdminLayout";
import Cookies from "js-cookie";
import Image from "next/image";

interface ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;
  code?: string;
}

interface Room {
  id: string;
  title: string;
  roomNumber: string;
  type: string;
  category: string;
  price: number;
  location: string;
  description: string;
  fullDescription?: string;
  capacity: number;
  maxOccupancy?: number;
  amenities: string[];
  additionalAmenities?: string[];
  features?: string[];
  images: string[];
  imageUrl?: string;
  href?: string;
  rating?: number;
  reviews?: number;
  bedType?: string;
  roomSize?: string;
  viewType?: string;
  isAvailable: boolean;
}

interface FormRoom {
  id?: string;
  title: string;
  roomNumber: string;
  type: string;
  category: string;
  price: number;
  location: string;
  description: string;
  fullDescription: string;
  capacity: number;
  maxOccupancy: number;
  amenities: string; // String for form input
  additionalAmenities: string; // String for form input
  features: string; // String for form input
  imageUrl: string;
  imageUrls: string[]; // Array of image URLs
  uploadedImages: File[]; // Array of uploaded image files
  href: string;
  rating: number;
  reviews: number;
  bedType: string;
  roomSize: string;
  viewType: string;
  isAvailable: boolean;
}

export default function RoomsManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<FormRoom>({
    title: "",
    roomNumber: "",
    type: "standard",
    category: "standard-room",
    price: 0,
    location: "Taguig, Metro Manila",
    description: "",
    fullDescription: "",
    capacity: 1,
    maxOccupancy: 2,
    amenities: "",
    additionalAmenities: "",
    features: "",
    imageUrl: "",
    imageUrls: [],
    uploadedImages: [],
    href: "",
    rating: 4.0,
    reviews: 0,
    bedType: "Queen",
    roomSize: "",
    viewType: "City view",
    isAvailable: true,
  });
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = () => {
      const user = localStorage.getItem("user");
      if (!user || !Cookies.get("token")) {
        router.push("/admin-login");
        return false;
      }

      try {
        const userData = JSON.parse(user);
        if (userData.role !== "admin") {
          router.push("/admin-login");
          return false;
        }
        return true;
      } catch {
        router.push("/admin-login");
        return false;
      }
    };

    const fetchRooms = async () => {
      if (!checkAdminAuth()) return;

      try {
        // Use the Next.js API route instead of direct API call
        const response = await fetch(`/api/admin/rooms`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            router.push("/admin-login");
            return;
          }
          throw new Error("Failed to fetch rooms");
        }

        const data = await response.json();
        setRooms(data.data);
      } catch (error: ApiError) {
        console.error("Error fetching rooms:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching rooms",
        );
        console.error("Rooms fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [router]);

  const openCreateModal = () => {
    setCurrentRoom({
      title: "",
      roomNumber: "",
      type: "standard",
      category: "standard-room",
      price: 0,
      location: "Taguig, Metro Manila",
      description: "",
      fullDescription: "",
      capacity: 1,
      maxOccupancy: 2,
      amenities: "",
      additionalAmenities: "",
      features: "",
      imageUrl: "",
      imageUrls: [],
      uploadedImages: [],
      href: "",
      rating: 4.0,
      reviews: 0,
      bedType: "Queen",
      roomSize: "",
      viewType: "City view",
      isAvailable: true,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setCurrentRoom({
      id: room.id,
      title: room.title || "",
      roomNumber: room.roomNumber,
      type: room.type,
      category: room.category || "standard-room",
      price: room.price,
      location: room.location || "Taguig, Metro Manila",
      description: room.description || "",
      fullDescription: room.fullDescription || "",
      capacity: room.capacity,
      maxOccupancy: room.maxOccupancy || 2,
      amenities: room.amenities.join(", "),
      additionalAmenities: room.additionalAmenities?.join(", ") || "",
      features: room.features?.join(", ") || "",
      imageUrl: room.imageUrl || "",
      imageUrls: room.images || [],
      uploadedImages: [],
      href: room.href || "",
      rating: room.rating || 4.0,
      reviews: room.reviews || 0,
      bedType: room.bedType || "Queen",
      roomSize: room.roomSize || "",
      viewType: room.viewType || "City view",
      isAvailable: room.isAvailable,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    setCurrentRoom((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? parseFloat(value)
            : value,
    }));
  };

  // Handle file upload changes
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setCurrentRoom((prev) => ({
        ...prev,
        uploadedImages: [...prev.uploadedImages, ...newFiles],
      }));
    }
  };

  // Handle adding a new image URL to the list
  const handleAddImageUrl = () => {
    if (currentRoom.imageUrl.trim()) {
      setCurrentRoom((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, prev.imageUrl.trim()],
        imageUrl: "", // Clear the input field after adding
      }));
    }
  };

  // Handle removing an image URL from the list
  const handleRemoveImageUrl = (index: number) => {
    setCurrentRoom((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // Handle removing an uploaded file
  const handleRemoveFile = (index: number) => {
    setCurrentRoom((prev) => ({
      ...prev,
      uploadedImages: prev.uploadedImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setError(null);
      setIsSuccess(false);

      // Format the room data to match the backend model exactly
      const formattedRoom = {
        ...(currentRoom.id && { id: currentRoom.id }), // Only include id if it exists (for edits)
        title: currentRoom.title,
        roomNumber: currentRoom.roomNumber,
        type: currentRoom.type,
        category: currentRoom.category,
        price: currentRoom.price,
        location: currentRoom.location,
        description: currentRoom.description,
        fullDescription: currentRoom.fullDescription,
        capacity: currentRoom.capacity,
        maxOccupancy: currentRoom.maxOccupancy,
        amenities: currentRoom.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        additionalAmenities: currentRoom.additionalAmenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        features: currentRoom.features
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        imageUrl: currentRoom.imageUrl,
        href:
          currentRoom.href ||
          `/hotelRoomDetails/${currentRoom.category}/${currentRoom.title.toLowerCase().replace(/\s+/g, "-")}`,
        rating: currentRoom.rating,
        reviews: currentRoom.reviews,
        bedType: currentRoom.bedType,
        roomSize: currentRoom.roomSize,
        viewType: currentRoom.viewType,
        isAvailable: currentRoom.isAvailable,
        // Use the image URLs array for images
        images: currentRoom.imageUrls,
      };

      // Use the Next.js API route instead of direct API call
      const url = isEditing
        ? `/api/admin/rooms/${currentRoom.id}`
        : `/api/admin/rooms`;

      const method = isEditing ? "PUT" : "POST";

      console.log("Submitting room data:", formattedRoom);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(formattedRoom),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push("/admin-login");
          return;
        }

        const error = new Error(
          data.message || "Something went wrong",
        ) as ApiError;
        error.status = response.status;
        error.errors = data.errors;
        throw error;
      }

      // Show success message
      setIsSuccess(true);
      setError(
        isEditing ? "Room updated successfully" : "Room created successfully",
      );
      setTimeout(() => {
        setError(null);
        setIsSuccess(false);
      }, 3000);

      // Refresh the room list
      const roomsResponse = await fetch(`/api/admin/rooms`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json();
        setRooms(roomsData.data);
      }

      closeModal();
    } catch (error) {
      setIsSuccess(false);
      if (error instanceof Error) {
        const apiError = error as ApiError;
        setError(
          apiError.errors
            ? Object.values(apiError.errors).flat().join(", ")
            : apiError.message,
        );
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Room operation error:", error);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      setError(null);
      setIsSuccess(false);

      // Use the Next.js API route instead of direct API call
      const response = await fetch(`/api/admin/rooms/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete room");
      }

      // Show success message
      setIsSuccess(true);
      setError("Room deleted successfully");
      setTimeout(() => {
        setError(null);
        setIsSuccess(false);
      }, 3000);

      // Update room list by filtering out the deleted room
      setRooms(rooms.filter((room) => room.id !== id));
    } catch (error: ApiError | unknown) {
      setIsSuccess(false);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the room",
      );
      console.error("Room delete error:", error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1C3F32]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Room Management</h1>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#1C3F32] text-white rounded-md flex items-center"
          >
            <FaPlus className="mr-2" />
            Add New Room
          </button>
        </div>

        {error && (
          <div
            className={`${isSuccess ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"} p-4 rounded-md border mb-4`}
          >
            {error}
            <button
              onClick={() => {
                setError(null);
                setIsSuccess(false);
              }}
              className="float-right"
            >
              <FaTimes />
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                            {room.imageUrl ? (
                              <Image
                                src={room.imageUrl}
                                alt={room.title || room.roomNumber}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <FaBed className="text-gray-400 m-2" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {room.title || `Room ${room.roomNumber}`}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <FaDoorOpen className="mr-1" />
                              {room.roomNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 capitalize">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">
                            {room.type}
                          </span>
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            {room.category}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {room.bedType || `${room.capacity} person(s)`} •{" "}
                          {room.roomSize || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                          {room.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          ${room.price.toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-500">per night</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-yellow-400 mr-1">★</div>
                          <span className="text-sm text-gray-700">
                            {room.rating?.toFixed(1) || "N/A"}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({room.reviews || 0})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            room.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {room.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(room)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No rooms found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? "Edit Room" : "Add New Room"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info Section */}
                <div className="md:col-span-2">
                  <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={currentRoom.title}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Number
                      </label>
                      <input
                        type="text"
                        name="roomNumber"
                        value={currentRoom.roomNumber}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Type
                      </label>
                      <select
                        name="type"
                        value={currentRoom.type}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                        required
                      >
                        <option value="standard">Standard</option>
                        <option value="deluxe">Deluxe</option>
                        <option value="suite">Suite</option>
                        <option value="executive">Executive</option>
                        <option value="family">Family</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={currentRoom.category}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                        required
                      >
                        <option value="standard-room">Standard Room</option>
                        <option value="deluxe-room">Deluxe Room</option>
                        <option value="executive-suite">Executive Suite</option>
                        <option value="presidential-suite">
                          Presidential Suite
                        </option>
                        <option value="honeymoon-suite">Honeymoon Suite</option>
                        <option value="family-room">Family Room</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price per Night ($)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={currentRoom.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={currentRoom.location}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="md:col-span-2">
                  <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                    Description
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Short Description
                      </label>
                      <textarea
                        name="description"
                        value={currentRoom.description}
                        onChange={handleChange}
                        rows={2}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Description
                      </label>
                      <textarea
                        name="fullDescription"
                        value={currentRoom.fullDescription}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Capacity & Details Section */}
                <div className="md:col-span-2">
                  <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                    Capacity & Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        value={currentRoom.capacity}
                        onChange={handleChange}
                        min="1"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Occupancy
                      </label>
                      <input
                        type="number"
                        name="maxOccupancy"
                        value={currentRoom.maxOccupancy}
                        onChange={handleChange}
                        min="1"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bed Type
                      </label>
                      <select
                        name="bedType"
                        value={currentRoom.bedType}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                        required
                      >
                        <option value="">Select a bed type</option>
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Queen">Queen</option>
                        <option value="King">King</option>
                        <option value="Twin">Twin</option>
                        <option value="Various">Various</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Size
                      </label>
                      <input
                        type="text"
                        name="roomSize"
                        value={currentRoom.roomSize}
                        onChange={handleChange}
                        placeholder="32 sq.m"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        View Type
                      </label>
                      <input
                        type="text"
                        name="viewType"
                        value={currentRoom.viewType}
                        onChange={handleChange}
                        placeholder="City view"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating (0-5)
                      </label>
                      <input
                        type="number"
                        name="rating"
                        value={currentRoom.rating}
                        onChange={handleChange}
                        min="0"
                        max="5"
                        step="0.1"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reviews Count
                      </label>
                      <input
                        type="number"
                        name="reviews"
                        value={currentRoom.reviews}
                        onChange={handleChange}
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Features & Amenities Section */}
                <div className="md:col-span-2">
                  <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                    Features & Amenities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Features (comma separated)
                      </label>
                      <textarea
                        name="features"
                        value={currentRoom.features}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Floor-to-ceiling windows, Work desk, Seating area, Mini bar"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amenities (comma separated)
                      </label>
                      <textarea
                        name="amenities"
                        value={currentRoom.amenities}
                        onChange={handleChange}
                        rows={3}
                        placeholder="WiFi, TV, Air Conditioning, Mini Bar"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                      ></textarea>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Amenities (comma separated)
                      </label>
                      <textarea
                        name="additionalAmenities"
                        value={currentRoom.additionalAmenities}
                        onChange={handleChange}
                        rows={3}
                        placeholder="24/7 room service, Daily housekeeping, High-speed WiFi, Smart TV"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Image & URL Section */}
                <div className="md:col-span-2">
                  <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                    Images & URLs
                  </h3>

                  {/* Image Upload Option */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Option 1: Upload Images
                    </h4>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                        <span>Select Files</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <span className="text-xs text-gray-500">
                        Supported formats: JPG, PNG, WebP (Max: 5MB each)
                      </span>
                    </div>

                    {/* Show preview of uploaded files */}
                    {currentRoom.uploadedImages.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          Selected Files
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {currentRoom.uploadedImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="h-24 w-full bg-gray-100 rounded-md border overflow-hidden">
                                <Image
                                  src={URL.createObjectURL(file)}
                                  alt={`Selected ${index + 1}`}
                                  width={96}
                                  height={96}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove"
                              >
                                <FaTimes size={12} />
                              </button>
                              <p className="text-xs text-gray-500 truncate mt-1">
                                {file.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image URL Option */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Option 2: Add Image URLs
                    </h4>
                    <div className="flex">
                      <input
                        type="text"
                        name="imageUrl"
                        value={currentRoom.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-4 py-2 bg-[#1C3F32] text-white rounded-r-md hover:bg-[#1C3F32]/90"
                      >
                        Add
                      </button>
                    </div>

                    {/* Show list of added image URLs */}
                    {currentRoom.imageUrls.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          Added Image URLs
                        </h5>
                        <div className="grid grid-cols-1 gap-2">
                          {currentRoom.imageUrls.map((url, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                            >
                              <div className="flex items-center space-x-2 overflow-hidden">
                                <div className="h-10 w-10 bg-gray-100 rounded-md border overflow-hidden flex-shrink-0">
                                  <Image
                                    src={url}
                                    alt={`URL ${index + 1}`}
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.src =
                                        "/images/room-placeholder.jpg";
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-gray-700 truncate">
                                  {url}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveImageUrl(index)}
                                className="text-red-500 hover:text-red-700"
                                title="Remove"
                              >
                                <FaTimes size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Page URL field */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page URL
                    </label>
                    <input
                      type="text"
                      name="href"
                      value={currentRoom.href}
                      onChange={handleChange}
                      placeholder="/hotelRoomDetails/category/room-name"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1C3F32] text-black"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave blank to auto-generate from category and title
                    </p>
                  </div>
                </div>

                {/* Availability */}
                <div className="md:col-span-2">
                  <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                    Availability
                  </h3>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={currentRoom.isAvailable}
                        onChange={(e) =>
                          setCurrentRoom({
                            ...currentRoom,
                            isAvailable: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-[#1C3F32] focus:ring-[#1C3F32] border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Available for booking
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1C3F32] text-white rounded-md hover:bg-[#1C3F32]/90"
                >
                  {isEditing ? "Update Room" : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
