import React from "react";

// Sachini part
const InfoCard = ({
  title,
  total,
  available,
  outService,
  banned,
  finished,
  live,
  cancel,
}) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="heading bg-[#878FA0] w-full py-2 rounded-tl-2xl rounded-tr-2xl">
        <span className="text-[#0F2043] text-2xl p-5 text-left">Vehicle</span>
      </div>

      <div className="flex flex-row justify-between border-l-2 border-r-2 border-b-2 border-[#0F2043] w-full">
        <span className="p-4 text-xl">Total</span>
        <span className="p-4 text-xl">101</span>
      </div>

      <div className="flex flex-row justify-between border-l-2 border-r-2 border-b-2 border-[#0F2043] w-full">
        <span className="p-4 text-xl">Total</span>
        <span className="p-4 text-xl">101</span>
      </div>

      <div className="flex flex-row justify-between border-l-2 border-r-2 border-b-2 border-[#0F2043] w-full">
        <span className="p-4 text-xl">Total</span>
        <span className="p-4 text-xl">101</span>
      </div>
    </div>
  );
};

export default InfoCard;
