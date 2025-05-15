import React, { useState } from "react";
import apiService from "../../config/axiosConfig";

const AddBrandCard = ({ isOpen, onClose }) => {
  const [brandName, setBrandName] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);

  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(brandName);
    const data = new FormData();

    data.append("title", brandName);
    console.log(...data);

    try {
      const response = await apiService.post("brand/create", data);

      if (response.status === 201 || 200) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 4000);
      }
    } catch (error) {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
      return error;
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
            Brand Data Create Fail. Please check and try again
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
