import React, { useState } from "react";

const AddTypeCard = ({ isOpen, onClose }) => {
  const [typeName, setTypeName] = useState("");

  if (!isOpen) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Add new vehicle type</h3>

      {/* Input Field */}
      <label className="block mb-1 text-sm">Name</label>
      <input
        type="text"
        // onChange={(e) => setVehicleType(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter new vehicle type"
      />

      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Vehicle Type
        </button>
        <button
          onClick={onClose}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddTypeCard;
