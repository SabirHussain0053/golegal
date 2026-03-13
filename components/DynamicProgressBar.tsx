import { X } from 'lucide-react';

const DynamicProgressBar = ({ step, type }) => (
  <div className="w-full mt-[44px] bg-green-200">
    <div className="h-full flex flex-col   border border-[#EBEAEA] border-b-4 rounded-tl-3xl rounded-tr-3xl relative">
      <div className="absolute  w-full">
        <div
          className="h-1 rounded-full bg-primary"
          style={{
            width: `${step}%`, // Dynamically update width as a percentage
          }}
        />
      </div>
    </div>
  </div>
);

export default DynamicProgressBar;
