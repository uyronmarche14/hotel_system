import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-[#1C3F32] mb-6">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex justify-center space-x-4">
        <Link 
          href="/"
          className="bg-[#1C3F32] text-white px-6 py-3 rounded-md hover:bg-[#15332a] transition-colors"
        >
          Go to Home
        </Link>
        <Link 
          href="/dashboard"
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
} 