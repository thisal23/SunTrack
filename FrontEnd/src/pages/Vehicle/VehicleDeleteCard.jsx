import React from "react";

const VehicleDeleteCard = ({ plateNo, message }) => {
  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-2">Confirm Deletion</h2>

      {message ? (
        <p className="text-md font-medium text-green-600">{message}</p>
      ) : (
        <>
          <p>Are you sure you want to delete this vehicle?</p>
          <p className="text-blue-600 font-semibold mt-2">{plateNo}</p>
        </>
      )}
    </div>
  );
};

export default VehicleDeleteCard;
