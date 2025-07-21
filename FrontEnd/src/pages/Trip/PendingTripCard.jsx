import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import apiService from "../../config/axiosConfig";
import { formatTimeToHoursMinutes } from "../../utils/timeFormatter";

// Sachini part
const PendingTripCard = ({ tripData }) => {
  if (!tripData) {
    return null;
  }

  return (
    <div className="flex flex-row justify-between items-center bg-[#F0F3F8] mx-5 rounded-xl px-4 py-4">
      <div className="flex flex-col w-2/3">
        <span className="text-[#0F2043] text-left text-lg">
          {tripData.startLocation} to {tripData.endLocation}
        </span>

        <span className="text-[#0F2043] text-left text-md">
          {tripData.date}
        </span>

        <Link
          to="https://maps.app.goo.gl/SFrxdwy1RT6KFhp46"
          target="_blank"
          className="hover:text-red-500 a_custom_s"
        >
          <FaLocationDot />
        </Link>
      </div>

      <div className="flex flex-col w-1/3">
        <div className="flex flex-row justify-between">
          <span className="text-[#0F2043] text-left text-sm">
            Suggest Start Time:
          </span>

          <span className="text-right text-[#0F2043] text-sm">
            {formatTimeToHoursMinutes(tripData.suggestStartTime)}
          </span>
        </div>
        <div className="flex flex-row justify-between">
          <span className="text-[#0F2043] text-left text-sm">
            Suggest End Time:
          </span>
          <span className="text-right text-[#0F2043] text-sm">
            {formatTimeToHoursMinutes(tripData.suggestEndTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PendingTripCard;
