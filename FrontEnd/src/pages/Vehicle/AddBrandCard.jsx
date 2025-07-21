import React, { useState } from "react";
import apiService from "../../config/axiosConfig";

const AddBrandCard = ({ isOpen, onClose, onSuccess }) => {
  const [brandName, setBrandName] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brandName.trim()) {
      setIsError("Please enter a brand name");
      setTimeout(() => setIsError(""), 3000);
      return;
    }

    try {
      const response = await apiService.post("brand/create", {
        brand: brandName,
      });

      if (response.status === 201 || response.status === 200) {
        const newBrand = response.data?.data; // assuming backend returns created object

        if (onSuccess && newBrand) {
          onSuccess(newBrand); // send back new brand to parent
        }

        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setBrandName("");
          onClose(); // close modal after showing message
        }, 1000);
      }
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "Something went wrong";

      setIsError(backendMessage);
      setTimeout(() => setIsError(""), 4000);
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Add new vehicle brand</h3>

      <form onSubmit={handleSubmit}>
        {/* Input Field */}
        <label className="block mb-1 text-sm">Name</label>
        <input
          type="text"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter new vehicle brand"
        />

        {isSuccess ? (
          <span className="w-full flex justify-center mx-auto text-center px-4 py-2 bg-[#43bf64] border-2 border-[#00b530] text-white">
            Brand Data Created Successfully
          </span>
        ) : isError ? (
          <span className="w-full flex justify-center mx-auto text-center px-4 py-2 bg-[#b53f3f] border-2 border-[#b50000] text-white">
            {isError}
          </span>
        ) : null}

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Vehicle Brand
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBrandCard;
