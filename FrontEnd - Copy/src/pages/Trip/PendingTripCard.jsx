import React from "react";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";

// Sachini part
const PendingTripCard = () => {
  return (
    <div className="flex flex-row justify-between items-center bg-[#F0F3F8] mx-5 rounded-xl px-4 py-4">
      <div className="flex flex-col w-2/3">
        <span className="text-[#0F2043] text-left text-lg">
          Colombo Fort to Kandy City Center
        </span>
        <span className="text-[#0F2043] text-left text-md">2025-01-10</span>
        <Link
          to="https://maps.app.goo.gl/SFrxdwy1RT6KFhp46"
          target="_blank"
          className="hover:text-red-500"
        >
          <FaLocationDot />
        </Link>
      </div>
      <div className="flex flex-col w-1/3">
        <div className="flex flex-row justify-between">
          <span className="text-[#0F2043] text-left text-sm">
            Suggest Start Time:
          </span>
          <span className="text-right text-[#0F2043] text-sm">02:20 pm</span>
        </div>
        <div className="flex flex-row justify-between">
          <span className="text-[#0F2043] text-left text-sm">
            Suggest End Time:
          </span>
          <span className="text-right text-[#0F2043] text-sm">05:20 pm</span>
        </div>
      </div>
    </div>
  );
};

export default PendingTripCard;
