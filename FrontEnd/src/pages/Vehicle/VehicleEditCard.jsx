import React, { useEffect, useState } from "react";
import apiService from "../../config/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VehicleEditCard = ({ vehicleId, onClose, onSuccess }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [formData, setFormData] = useState({
    plateNo: "",
    vehicleType: "",
    category: "",
    chassieNo: "",
    color: "",
    brandId: "",
    modelId: "",
    fuelType: "",
    registeredYear: "",
    status: "",
    deviceId: "",
    countrycode: "",
    pnumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFocused(true);

    try {
      const fData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          fData.append(key, value);
        }
      });

      const response = await apiService.put(
        `/vehicle/update/${vehicleId}`,
        fData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status !== 200) {
        toast.error("Vehicle update failed");
        return;
      }

      toast.success("Vehicle updated successfully");

      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 1500); // 1.5 seconds delay
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update vehicle");
    } finally {
      setIsFocused(false);
    }
  };

  const fetchVehicleByid = async (id) => {
    try {
      const response = await apiService.get(`vehicle/details/${id}`);
      const vehicle = response.data.data;

      setFormData((prev) => ({
        ...prev,
        plateNo: vehicle?.plateNo || "",
        vehicleType: vehicle?.vehicleType || "",
        category: vehicle?.category || "",
        chassieNo: vehicle?.chassieNo || "",
        color: vehicle?.color || "",
        brandId: vehicle?.brandId || "",
        modelId: vehicle?.modelId || "",
        fuelType: vehicle?.fuelType || "",
        registeredYear: vehicle?.registeredYear || "",
        status: vehicle?.status || "",
        deviceId: vehicle?.gpsDevice?.deviceId || "",
        countrycode: vehicle?.gpsDevice?.countrycode || "",
        pnumber: vehicle?.gpsDevice?.pnumber || "",
      }));
    } catch (err) {
      console.error("Fetch vehicle failed", err);
      toast.error("Failed to fetch vehicle data");
    }
  };

  const fetchVehicleData = async () => {
    try {
      const brandData = await apiService.get("brand/all");
      const modelData = await apiService.get("model/all");

      if (brandData.status !== 200 && modelData.status != 200) {
        toast.error("Data fetching error");
      }
      setBrands(brandData.data.data);
      setModels(modelData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleByid(vehicleId);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchVehicleData();
  }, []);

  return (
    <div className="justify-center w-full">
      <div className="flex flex-row justify-center">
        <span className="text-2xl text-[#0F2043] py-3">
          Edit vehicle Details
        </span>
      </div>
      
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td className="px-4 py-2 font-bold">Plate No:</td>
              <td className="pb-2">
                <input
                  type="text"
                  name="plateNo"
                  value={formData.plateNo}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">Vehicle Type:</td>
              <td className="pb-2">
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select type</option>
                  <option value="Bike">Bike</option>
                  <option value="Three Wheel">Three Wheel</option>
                  <option value="Car">Car</option>
                  <option value="Van">Van</option>
                  <option value="Cab">Cab</option>
                  <option value="Lorry">Lorry</option>
                  <option value="Bus">Bus</option>
                  <option value="Other">Other</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">Category:</td>
              <td className="pb-2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select category</option>
                  <option value="Heavy">Heavy</option>
                  <option value="Light">Light</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">Brand:</td>
              <td className="pb-2">
                <select
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.brand}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">Model:</td>
              <td className="pb-2">
                <select
                  name="modelId"
                  value={formData.modelId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select model</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.model}
                    </option>
                  ))}
                </select>
              </td>
            </tr>

            <tr>
              <td className="px-4 py-2 font-bold">Fuel Type:</td>
              <td className="pb-2">
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">Chassie No:</td>
              <td className="pb-2">
                <input
                  type="text"
                  name="chassieNo"
                  value={formData.chassieNo}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">Registered Year:</td>
              <td className="pb-2">
                <input
                  type="text"
                  name="registeredYear"
                  value={formData.registeredYear}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">Color:</td>
              <td className="pb-2">
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">Status:</td>
              <td className="pb-2">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select status</option>
                  <option value="available">Available</option>
                  <option value="outOfService">Out of Service</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">GPS Device ID:</td>
              <td className="pb-2">
                <input
                  type="text"
                  name="deviceId"
                  value={formData.deviceId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">Country Code:</td>
              <td className="pb-2">
                <input
                  type="text"
                  name="countrycode"
                  value={formData.countrycode}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">Phone Number:</td>
              <td className="pb-2">
                <input
                  type="text"
                  name="pnumber"
                  value={formData.pnumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
            {/* <tr>
              <td className="px-4 py-2 font-bold">Image:</td>
              <td className="pb-2">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr> */}
          </tbody>
        </table>

        {/* <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={isFocused}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md ${
              isFocused ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {isFocused ? "Updating..." : "Update Vehicle"}
          </button>
        </div> */}

        <div className="flex justify-center space-x-4 mt-4">
          <button
            type="submit"
            disabled={isFocused}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md ${
              isFocused ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {isFocused ? "Updating..." : "Update Vehicle"}
          </button>

          <button
            type="button"
            onClick={onClose} // use your onClose prop callback
            className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleEditCard;
