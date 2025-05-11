import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1C3F32] mb-8">About The Solace Manor</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="relative h-[300px] w-full">
          <Image
            src="https://res.cloudinary.com/ddnxfpziq/image/upload/v1746813924/2_vkjogl.jpg"
            alt="The Solace Manor"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#1C3F32] mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Founded in 1985, The Solace Manor began as a boutique hotel with just 25 rooms. Today, we are one of the most prestigious luxury hotels in the Philippines, known for impeccable service and timeless elegance.
          </p>
          <p className="text-gray-700">
            Over nearly four decades, we have hosted world leaders, celebrities, and discerning travelers seeking the finest hospitality experience.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#1C3F32] mb-4">Our Vision</h2>
          <p className="text-gray-700">
            We aspire to create unforgettable experiences that reflect the rich cultural heritage of the Philippines while providing world-class luxury and comfort.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#1C3F32] mb-4">Our Mission</h2>
          <p className="text-gray-700">
            At The Solace Manor, our mission is to provide each guest with personalized, exceptional service that exceeds expectations.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-bold text-[#1C3F32] mb-4">Our Core Values</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex flex-col items-center">
            <div className="text-4xl mb-2">🌟</div>
            <h3 className="font-bold text-[#1C3F32]">Excellence</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl mb-2">🏛️</div>
            <h3 className="font-bold text-[#1C3F32]">Authenticity</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl mb-2">🌿</div>
            <h3 className="font-bold text-[#1C3F32]">Sustainability</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl mb-2">💡</div>
            <h3 className="font-bold text-[#1C3F32]">Innovation</h3>
          </div>
        </div>
      </div>
    </div>
  );
} 