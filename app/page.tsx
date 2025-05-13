'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#1C3F32] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}