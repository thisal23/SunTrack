import React from "react";

const InfoCard = ({
  CardName,
  count_name_1,
  count_name_2,
  count_name_3,
  count_1,
  count_2,
  count_3,
}) => {
  return (
    <div className="flex flex-col items-center w-full bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
      <div className="w-full px-5 py-3 border-b border-gray-100 bg-white">
        <span className="text-[#0F2043] text-xl font-semibold">{CardName}</span>
      </div>
      <div className="flex flex-row justify-between w-full text-[#0f2043] px-5 py-3 border-b border-gray-50">
        <span className="text-base">{count_name_1}</span>
        <span className="text-base font-medium">{count_1}</span>
      </div>
      <div className="flex flex-row justify-between w-full text-[#0f2043] px-5 py-3 border-b border-gray-50">
        <span className="text-base">{count_name_2}</span>
        <span className="text-base font-medium">{count_2}</span>
      </div>
      <div className="flex flex-row justify-between w-full text-[#0f2043] px-5 py-3">
        <span className="text-base">{count_name_3}</span>
        <span className="text-base font-medium">{count_3}</span>
      </div>
    </div>
  );
};

export default InfoCard;
