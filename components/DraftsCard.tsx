'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MoreHorizontal } from 'lucide-react';

import { Card } from '@/components/ui/card';

const DraftsCard = ({ label, heading, description, lawyerName, price }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <Card className="relative space-y-2 bg-white rounded-lg p-4">
      {/* Yellow Label */}
      <div className="flex items-center pb-2 justify-between w-full">
        <span className="bg-[#FFF2CF] text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
          {label}
        </span>
        <Link
          href={{
            pathname: '1234',
          }}
          className="cursor-pointer -mt-4 -mr-2"
          onClick={toggleDialog}
        >
          <ArrowUpRight className="w-6 h-6" />
        </Link>
      </div>
      {/* Eye Icon */}
      {/* Main Heading */}
      <div className="space-y-0.5">
        <p className="text-[10px] text-[#444242]">Name</p>
        <h2 className="text-sm font-semibold text-gray-800">{heading}</h2>
      </div>
      {/* Main Heading */}
      <div className="space-y-0.5">
        <p className="text-[10px] text-[#444242]">Type</p>
        <h2 className="text-sm font-semibold text-gray-800">{heading}</h2>
      </div>

      <div className="flex items-center justify-between w- pt-2">
        <p className="text-[10px] text-black font-medium]">07 Feb 2024</p>
        {/* <p className='text-[10px] text-black font-medium]'>01:14 PM</p> */}
        <MoreHorizontal className="w-4 h-4" />
      </div>
    </Card>
  );
};

export default DraftsCard;
