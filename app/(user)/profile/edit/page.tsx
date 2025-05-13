"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaSave, FaTimes, FaUpload } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import SafeImage from "@/app/components/ui/SafeImage";
import { API_URL } from "@/app/lib/constants";
import Cookies from "js-cookie";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, updateUserContext } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    profilePic: "",
  });
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
        profilePic: user.profilePic || "",
      });
    }
  }, [user]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }
    
    // Check file type
    if (!file.type.includes('image/')) {
      setError("Please select an image file");
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Get token for authorization
      const token = Cookies.get('token');
      
      // Create form data for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('bio', formData.bio);
      
      // Add profile picture if selected
      if (selectedFile) {
        formDataToSend.append('profilePic', selectedFile);
      }
      
      // Send request to update profile
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
      
      const data = await response.json();
      
      // Update local user context
      updateUserContext({ ...user, ...data.data });
      
      setSuccessMessage("Profile updated successfully!");
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
      
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle cancel and return to profile page
  const handleCancel = () => {
    router.push('/profile');
  };
  
  if (!user) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <main className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C3F32]">Edit Profile</h1>
        <button 
          onClick={handleCancel}
          className="text-[#1C3F32] hover:underline flex items-center"
        >
          <FaTimes className="mr-1" /> Cancel
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {/* Profile Picture */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-[#1C3F32]">
            <SafeImage
              src={previewUrl || formData.profilePic}
              imageType="profile"
              alt={formData.name}
              fill
              className="object-cover"
            />
          </div>
          
          <label className="bg-[#1C3F32] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#1C3F32]/90 transition-colors">
            <FaUpload className="inline-block mr-2" />
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-500">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32]"
              placeholder="Your full name"
            />
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32]"
              placeholder="Your email address"
            />
          </div>
          
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32]"
              placeholder="Your phone number"
            />
          </div>
          
          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32]"
              placeholder="Your address"
            />
          </div>
        </div>
        
        {/* Bio */}
        <div className="mt-6">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio / About Me
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C3F32]"
            placeholder="Tell us a bit about yourself..."
          ></textarea>
        </div>
        
        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-[#1C3F32] text-[#1C3F32] rounded-md hover:bg-gray-50 transition-colors mr-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-[#1C3F32] text-white rounded-md hover:bg-[#1C3F32]/90 transition-colors flex items-center disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
} 