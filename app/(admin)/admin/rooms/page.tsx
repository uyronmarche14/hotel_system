'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAllRooms, 
  createRoom, 
  updateRoom, 
  deleteRoom, 
  Room 
} from '@/app/lib/adminService';
import { 
  FaBed, 
  FaPlus, 
  FaTrash, 
  FaPencilAlt, 
  FaCheck, 
  FaSearch, 
  FaExclamationTriangle,
  FaInfoCircle,
  FaTag,
  FaDollarSign,
  FaMapMarkerAlt,
  FaFilter,
  FaEye,
  FaExternalLinkAlt,
  FaTimes
} from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

// Categories for hotel rooms
const ROOM_CATEGORIES = [
  { id: 'standard-room', name: 'Standard Room' },
  { id: 'deluxe-room', name: 'Deluxe Room' },
  { id: 'executive-suite', name: 'Executive Suite' },
  { id: 'presidential-suite', name: 'Presidential Suite' },
  { id: 'honeymoon-suite', name: 'Honeymoon Suite' },
  { id: 'family-room', name: 'Family Room' }
];

export default function RoomsManagementPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  
  // Form for creating/editing room
  const [roomForm, setRoomForm] = useState({
    title: '',
    description: '',
    fullDescription: '',
    price: 0,
    imageUrl: '',
    location: 'Taguig, Metro Manila',
    category: '',
    rating: 4.5,
    maxOccupancy: 2,
    bedType: 'Queen',
    roomSize: '30 sq m',
    amenities: [] as string[],
    additionalAmenities: [] as string[],
    isAvailable: true
  });
  
  const router = useRouter();

  // Load rooms on component mount
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        const data = await getAllRooms();
        setRooms(data);
        setFilteredRooms(data);
        setError('');
      } catch (err) {
        console.error('Failed to load rooms:', err);
        setError('Failed to load hotel rooms. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  // Filter rooms when search term or category filter changes
  useEffect(() => {
    let filtered = [...rooms];
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(room => room.category === categoryFilter);
    }
    
    // Apply search term filter
    if (searchTerm.trim() !== '') {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        room => 
          room.title.toLowerCase().includes(lowercaseSearch) ||
          (room.description && room.description.toLowerCase().includes(lowercaseSearch)) ||
          room.category.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    setFilteredRooms(filtered);
  }, [searchTerm, categoryFilter, rooms]);

  // Handler functions for room management
  const openRoomDetails = (room: Room) => {
    setSelectedRoom(room);
    setShowModal(true);
    setIsEditing(false);
    setIsCreating(false);
  };

  const startCreatingRoom = () => {
    setRoomForm({
      title: '',
      description: '',
      fullDescription: '',
      price: 0,
      imageUrl: '',
      location: 'Taguig, Metro Manila',
      category: 'standard-room',
      rating: 4.5,
      maxOccupancy: 2,
      bedType: 'Queen',
      roomSize: '30 sq m',
      amenities: [],
      additionalAmenities: ['WiFi', 'Air conditioning', 'Daily housekeeping', 'Mini bar'],
      isAvailable: true
    });
    setIsCreating(true);
    setIsEditing(false);
    setShowModal(true);
    setSelectedRoom(null);
  };

  const startEditingRoom = (room: Room) => {
    setSelectedRoom(room);
    setRoomForm({
      title: room.title,
      description: room.description || '',
      fullDescription: room.fullDescription || '',
      price: room.price,
      imageUrl: room.imageUrl,
      location: room.location || 'Taguig, Metro Manila',
      category: room.category,
      rating: room.rating || 4.5,
      maxOccupancy: room.maxOccupancy || 2,
      bedType: room.bedType || 'Queen',
      roomSize: room.roomSize || '30 sq m',
      amenities: room.amenities || [],
      additionalAmenities: room.additionalAmenities || ['WiFi', 'Air conditioning'],
      isAvailable: room.isAvailable
    });
    setIsEditing(true);
    setIsCreating(false);
    setShowModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setRoomForm({
        ...roomForm,
        [name]: target.checked
      });
    } else if (type === 'number') {
      setRoomForm({
        ...roomForm,
        [name]: Number(value)
      });
    } else {
      setRoomForm({
        ...roomForm,
        [name]: value
      });
    }
  };

  const handleAmenityChange = (amenity: string, isAdditional: boolean = false) => {
    if (isAdditional) {
      // For additional amenities
      if (roomForm.additionalAmenities.includes(amenity)) {
        setRoomForm({
          ...roomForm,
          additionalAmenities: roomForm.additionalAmenities.filter(a => a !== amenity)
        });
      } else {
        setRoomForm({
          ...roomForm,
          additionalAmenities: [...roomForm.additionalAmenities, amenity]
        });
      }
    } else {
      // For regular amenities
      if (roomForm.amenities.includes(amenity)) {
        setRoomForm({
          ...roomForm,
          amenities: roomForm.amenities.filter(a => a !== amenity)
        });
      } else {
        setRoomForm({
          ...roomForm,
          amenities: [...roomForm.amenities, amenity]
        });
      }
    }
  };

  const saveRoom = async () => {
    try {
      setLoading(true);
      
      if (isCreating) {
        const newRoom = await createRoom(roomForm);
        setRooms([...rooms, newRoom]);
      } else if (isEditing && selectedRoom) {
        const updatedRoom = await updateRoom(selectedRoom._id, roomForm);
        setRooms(rooms.map(room => room._id === selectedRoom._id ? updatedRoom : room));
      }
      
      setShowModal(false);
      setIsEditing(false);
      setIsCreating(false);
      setSelectedRoom(null);
    } catch (err) {
      console.error('Failed to save room:', err);
      setError('Failed to save room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteRoom = (roomId: string) => {
    setConfirmDelete(roomId);
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      setLoading(true);
      await deleteRoom(roomId);
      
      // Update local state
      setRooms(rooms.filter(room => room._id !== roomId));
      setFilteredRooms(filteredRooms.filter(room => room._id !== roomId));
      
      setConfirmDelete(null);
    } catch (err) {
      console.error('Failed to delete room:', err);
      setError('Failed to delete room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = ROOM_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading && rooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Hotel Room Management</h1>
        
        <div className="flex flex-wrap gap-3">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] focus:border-transparent"
            >
              <option value="">All Categories</option>
              {ROOM_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400 w-4 h-4" />
            </div>
          </div>
          
          {/* Search Box */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search rooms..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Add Room Button */}
          <button
            onClick={startCreatingRoom}
            className="flex items-center px-4 py-2 bg-[#1C3F32] text-white rounded-md hover:bg-[#15332a] transition-colors"
          >
            <FaPlus className="mr-2" />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md flex items-start">
          <FaExclamationTriangle className="text-red-500 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-1 text-sm text-red-700">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-medium text-red-800 hover:text-red-900"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.length === 0 ? (
          <div className="col-span-full bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex flex-col items-center">
              <FaInfoCircle className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-lg font-medium">No rooms found</p>
              <p className="text-sm text-gray-400 mb-4">
                {searchTerm || categoryFilter ? 'Try adjusting your filters' : 'Start by adding a new room'}
              </p>
              {!(searchTerm || categoryFilter) && (
                <button
                  onClick={startCreatingRoom}
                  className="flex items-center px-4 py-2 bg-[#1C3F32] text-white rounded-md hover:bg-[#15332a] transition-colors"
                >
                  <FaPlus className="mr-2" />
                  <span>Add Room</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div 
              key={room._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Room Image */}
              <div className="relative h-48 bg-gray-200">
                {room.imageUrl ? (
                  <Image
                    src={room.imageUrl}
                    alt={room.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // On error, replace with a fallback
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/room-placeholder.jpg';
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                    <FaBed className="text-gray-400 w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingRoom(room);
                    }}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    title="Edit"
                  >
                    <FaPencilAlt className="text-[#1C3F32] w-4 h-4" />
                  </button>
                  {confirmDelete === room._id ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoom(room._id);
                      }}
                      className="p-2 bg-red-500 rounded-full shadow-md hover:bg-red-600 transition-colors"
                      title="Confirm Delete"
                    >
                      <FaCheck className="text-white w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDeleteRoom(room._id);
                      }}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      title="Delete"
                    >
                      <FaTrash className="text-red-500 w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="px-2 py-1 bg-[#1C3F32]/80 text-white text-xs rounded-full">
                    {getCategoryName(room.category)}
                  </span>
                </div>
              </div>
              
              {/* Room details */}
              <div className="p-4" onClick={() => openRoomDetails(room)}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{room.title}</h3>
                  <div className="flex items-center">
                    <span className="text-amber-500">★</span>
                    <span className="text-sm ml-1">{room.rating || 4.5}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {room.description || 'No description available.'}
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <FaMapMarkerAlt className="text-[#1C3F32] mr-1" />
                  <span>{room.location || 'Taguig, Metro Manila'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="font-bold text-[#1C3F32]">
                    {formatCurrency(room.price)}
                    <span className="text-xs font-normal text-gray-500"> /night</span>
                  </div>
                  
                  <div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        room.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {room.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                
                {/* View button */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openRoomDetails(room);
                    }}
                    className="text-[#1C3F32] hover:underline flex items-center text-sm"
                  >
                    <FaEye className="mr-1" />
                    <span>View Details</span>
                  </button>
                  
                  <Link
                    href={room.href}
                    target="_blank"
                    className="text-gray-500 hover:text-[#1C3F32] hover:underline flex items-center text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>View on Site</span>
                    <FaExternalLinkAlt className="ml-1 w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Room Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => {
                setShowModal(false);
                setSelectedRoom(null);
                setIsEditing(false);
                setIsCreating(false);
              }}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-[#1C3F32] px-6 py-3 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-white">
                  {isCreating ? 'Add New Room' : isEditing ? 'Edit Room' : 'Room Details'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRoom(null);
                    setIsEditing(false);
                    setIsCreating(false);
                  }}
                  className="text-white hover:text-gray-200"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="bg-white px-6 py-4 max-h-[70vh] overflow-y-auto">
                {(isCreating || isEditing) ? (
                  <div className="space-y-4">
                    {/* Basic Information */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-700 mb-2">Basic Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Room Title *
                          </label>
                          <input
                            type="text"
                            name="title"
                            required
                            value={roomForm.title}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32]"
                            placeholder="Deluxe King Room"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                          </label>
                          <select
                            name="category"
                            required
                            value={roomForm.category}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32]"
                          >
                            <option value="">Select a category</option>
                            {ROOM_CATEGORIES.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price per Night (PHP) *
                          </label>
                          <input
                            type="number"
                            name="price"
                            required
                            min="0"
                            value={roomForm.price}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32]"
                            placeholder="5000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL
                          </label>
                          <input
                            type="text"
                            name="imageUrl"
                            value={roomForm.imageUrl}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32]"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            value={roomForm.location}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32]"
                            placeholder="Taguig, Metro Manila"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rating (1-5)
                          </label>
                          <input
                            type="number"
                            name="rating"
                            min="1"
                            max="5"
                            step="0.1"
                            value={roomForm.rating}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Occupancy
                          </label>
                          <input
                            type="number"
                            name="maxOccupancy"
                            min="1"
                            value={roomForm.maxOccupancy}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bed Type
                          </label>
                          <select
                            name="bedType"
                            value={roomForm.bedType}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32]"
                          >
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
                            value={roomForm.roomSize}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32]"
                            placeholder="30 sq m"
                          />
                        </div>
                        <div className="flex items-center md:col-span-2">
                          <input
                            id="isAvailable"
                            name="isAvailable"
                            type="checkbox"
                            checked={roomForm.isAvailable}
                            onChange={(e) => setRoomForm({...roomForm, isAvailable: e.target.checked})}
                            className="h-4 w-4 text-[#1C3F32] focus:ring-[#1C3F32] border-gray-300 rounded"
                          />
                          <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                            Room is Available for Booking
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-700 mb-2">Description</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Short Description
                          </label>
                          <textarea
                            name="description"
                            rows={2}
                            value={roomForm.description}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32]"
                            placeholder="A brief description of the room"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Description
                          </label>
                          <textarea
                            name="fullDescription"
                            rows={4}
                            value={roomForm.fullDescription}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1C3F32] focus:border-[#1C3F32]"
                            placeholder="A detailed description of the room and its features"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-700 mb-2">Additional Amenities</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {['WiFi', 'Air conditioning', 'Daily housekeeping', 'Mini bar', 'TV', 'Desk', 'Safe', 'Bathtub', 'Shower', 'Balcony', 'Room service', 'Coffee maker'].map((amenity) => (
                          <div key={amenity} className="flex items-center">
                            <input
                              id={`amenity-${amenity}`}
                              type="checkbox"
                              checked={roomForm.additionalAmenities.includes(amenity)}
                              onChange={() => handleAmenityChange(amenity, true)}
                              className="h-4 w-4 text-[#1C3F32] focus:ring-[#1C3F32] border-gray-300 rounded"
                            />
                            <label htmlFor={`amenity-${amenity}`} className="ml-2 block text-sm text-gray-900">
                              {amenity}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  selectedRoom && (
                    <div>
                      {/* Image preview */}
                      <div className="mb-6">
                        <div className="relative h-52 bg-gray-200 rounded-md overflow-hidden">
                          {selectedRoom.imageUrl ? (
                            <Image
                              src={selectedRoom.imageUrl}
                              alt={selectedRoom.title}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                // On error, replace with a fallback
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/room-placeholder.jpg';
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                              <FaBed className="text-gray-400 w-12 h-12" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Room details */}
                      <div className="space-y-4">
                        {/* Title and category */}
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{selectedRoom.title}</h2>
                          <div className="flex items-center mt-1">
                            <FaTag className="text-[#1C3F32] w-4 h-4 mr-1" />
                            <span className="text-gray-600">{getCategoryName(selectedRoom.category)}</span>
                          </div>
                        </div>
                        
                        {/* Price and availability */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <FaDollarSign className="text-[#1C3F32] w-5 h-5 mr-1" />
                            <span className="text-lg font-semibold text-[#1C3F32]">
                              {formatCurrency(selectedRoom.price)}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">per night</span>
                          </div>
                          <div>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                selectedRoom.isAvailable
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {selectedRoom.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <div>
                          <h3 className="text-md font-semibold text-gray-800">Description</h3>
                          {selectedRoom.description ? (
                            <p className="text-gray-600 mt-1">{selectedRoom.description}</p>
                          ) : (
                            <p className="text-gray-400 italic mt-1">No short description available</p>
                          )}
                          
                          {selectedRoom.fullDescription && (
                            <div className="mt-3">
                              <h3 className="text-md font-semibold text-gray-800">Full Description</h3>
                              <p className="text-gray-600 mt-1">{selectedRoom.fullDescription}</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Details */}
                        <div>
                          <h3 className="text-md font-semibold text-gray-800">Details</h3>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <p className="text-sm text-gray-500">Location</p>
                              <p className="text-gray-700">{selectedRoom.location || 'Taguig, Metro Manila'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Bed Type</p>
                              <p className="text-gray-700">{selectedRoom.bedType || 'Queen'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Max Occupancy</p>
                              <p className="text-gray-700">{selectedRoom.maxOccupancy || 2} people</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Room Size</p>
                              <p className="text-gray-700">{selectedRoom.roomSize || '30 sq m'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Rating</p>
                              <div className="flex items-center">
                                <span className="text-amber-500">★</span>
                                <span className="ml-1">{selectedRoom.rating || 4.5}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Amenities */}
                        {selectedRoom.additionalAmenities && selectedRoom.additionalAmenities.length > 0 && (
                          <div>
                            <h3 className="text-md font-semibold text-gray-800">Amenities</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                              {selectedRoom.additionalAmenities.map((amenity, index) => (
                                <div key={index} className="flex items-center">
                                  <FaCheck className="text-green-500 w-3 h-3 mr-2" />
                                  <span className="text-gray-600">{amenity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* View on site link */}
                        <div className="pt-4 border-t border-gray-200">
                          <Link
                            href={selectedRoom.href}
                            target="_blank"
                            className="flex items-center text-[#1C3F32] hover:underline"
                          >
                            <span>View on Website</span>
                            <FaExternalLinkAlt className="ml-1 w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                {isCreating || isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={saveRoom}
                      className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#1C3F32] text-base font-medium text-white hover:bg-[#15332a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C3F32] ml-3"
                    >
                      {isCreating ? 'Create Room' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setSelectedRoom(null);
                        setIsEditing(false);
                        setIsCreating(false);
                      }}
                      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C3F32] ml-3"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedRoom) {
                          startEditingRoom(selectedRoom);
                        }
                      }}
                      className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#1C3F32] text-base font-medium text-white hover:bg-[#15332a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C3F32] ml-3"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setSelectedRoom(null);
                      }}
                      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C3F32] ml-3"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
 