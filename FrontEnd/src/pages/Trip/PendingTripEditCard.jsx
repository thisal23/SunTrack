import React, { useState } from "react";

const PendingTripEditCard = ({ tripData }) => {
  const [startLocation, setStartLocation] = useState(tripData.startLocation);
  const [endLocation, setEndLocation] = useState(tripData.endLocation);
  const [date, setDate] = useState(tripData.date);
  const [suggestStartTime, setSuggestStartTime] = useState(
    tripData.suggestStartTime
  );
  const [suggestEndTime, setSuggestEndTime] = useState(tripData.suggestEndTime);

  return (
    <div className="flex flex-row justify-between items-center bg-[#F0F3F8] mx-5 rounded-xl px-4 py-4">
      <div className="flex flex-col w-2/3">
        <input
          type="text"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
          className="text-[#0F2043] text-left text-lg"
        />
        <input
          type="text"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
          className="text-[#0F2043] text-left text-lg"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="text-[#0F2043] text-left text-md"
        />
      </div>

      <div className="flex flex-col w-1/3">
        <div className="flex flex-row justify-between">
          <span className="text-[#0F2043] text-left text-sm">
            Suggest Start Time:
          </span>
          <input
            type="time"
            value={suggestStartTime}
            onChange={(e) => setSuggestStartTime(e.target.value)}
            className="text-right text-[#0F2043] text-sm"
          />
        </div>
        <div className="flex flex-row justify-between">
          <span className="text-[#0F2043] text-left text-sm">
            Suggest End Time:
          </span>
          <input
            type="time"
            value={suggestEndTime}
            onChange={(e) => setSuggestEndTime(e.target.value)}
            className="text-right text-[#0F2043] text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default PendingTripEditCard;
