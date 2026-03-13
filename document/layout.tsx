'use client';

import { Golegal } from '@/assets';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function DocumentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b p-4 flex items-center shadow-sm">
        <Link href="/dashboard">
          <Image
            src={Golegal}
            alt="Go Legal AI Logo"
            width={127}
            height={30}
            className="mx-auto"
          />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
