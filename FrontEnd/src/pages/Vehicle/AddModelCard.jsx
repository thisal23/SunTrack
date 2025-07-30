import React, { useState, useEffect } from "react";
import apiService from "../../config/axiosConfig";

const AddModelCard = ({ isOpen, onClose, onSuccess, selectedBrandId }) => {
  const [modelName, setModelName] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(selectedBrandId || "");
  const [brands, setBrands] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch brands when component mounts
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await apiService.get("brand/all");
        if (response.status === 200) {
          setBrands(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
        setIsError("Failed to fetch brands");
      }
    };

    if (isOpen) {
      fetchBrands();
    }
  }, [isOpen]);

  // Update selected brand when selectedBrandId prop changes
  useEffect(() => {
    if (selectedBrandId) {
      setSelectedBrand(selectedBrandId);
    }
  }, [selectedBrandId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!modelName.trim()) {
      setIsError("Please enter a model name");
      setTimeout(() => setIsError(""), 3000);
      return;
    }

    if (!selectedBrand) {
      setIsError("Please select a brand");
      setTimeout(() => setIsError(""), 3000);
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.post("model/create", {
        model: modelName,
        brandId: selectedBrand,
      });

      if (response.status === 201 || response.status === 200) {
        const newModel = response.data?.data;

        if (onSuccess && newModel) {
          onSuccess(newModel);
        }

        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setModelName("");
          setSelectedBrand(selectedBrandId || "");
          onClose();
        }, 1000);
      }
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "Something went wrong";

      setIsError(backendMessage);
      setTimeout(() => setIsError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Add new vehicle model</h3>

      <form onSubmit={handleSubmit}>
        {/* Brand Selection */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">Brand *</label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.brand}
              </option>
            ))}
          </select>
        </div>

        {/* Model Name Input */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">Model Name *</label>
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new vehicle model"
            required
          />
        </div>

        {isSuccess ? (
          <span className="w-full flex justify-center mx-auto text-center px-4 py-2 bg-[#43bf64] border-2 border-[#00b530] text-white">
            Model Data Created Successfully
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
            disabled={loading}
            className={`px-4 py-2 rounded ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {loading ? 'Creating...' : 'Create Vehicle Model'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddModelCard;
