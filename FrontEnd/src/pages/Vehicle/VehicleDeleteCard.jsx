import React from "react";

const VehicleDeleteCard = ({ title, licenseId, vehicleModel }) => {
  return (
    <>
      <div className="flex flex-row justify-center">
        <span className="text-2xl text-[#0F2043]">Delete Vehicle</span>
      </div>
      <div className="py-5 text-l">
        Are you sure you want to delete this vehicle details?
      </div>
      <span>{title}</span>
      <span>{licenseId}</span>
      <span>{vehicleModel}</span>
    </>
  );
};

export default VehicleDeleteCard;
