import React from "react";

// Sachini part
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
    <div className="flex flex-col items-center w-full">
      <div className="heading bg-[#878FA0] w-full rounded-tl-2xl rounded-tr-2xl">
        <span className="text-[#0F2043] text-2xl p-5 text-left">
          {CardName}
        </span>
      </div>

      <div className="flex flex-row justify-between border-l-2 border-r-2 border-b-2 border-[#0F2043] w-full text-[#0f2043]">
        <span className="p-4 text-xl">{count_name_1}</span>
        <span className="p-4 text-xl">{count_1}</span>
      </div>

      <div className="flex flex-row justify-between border-l-2 border-r-2 border-b-2 border-[#0F2043] w-full text-[#0f2043]">
        <span className="p-4 text-xl">{count_name_2}</span>
        <span className="p-4 text-xl">{count_2}</span>
      </div>

      <div className="flex flex-row justify-between border-l-2 border-r-2 border-b-2 border-[#0F2043] w-full text-[#0f2043]">
        <span className="p-4 text-xl">{count_name_3}</span>
        <span className="p-4 text-xl">{count_3}</span>
      </div>
    </div>
  );
};

export default InfoCard;
