import React, { useState, useEffect } from "react";
import apiService from "../../config/axiosConfig";

const AddNewVehicleService = ({ handleCancel, onUpdateSuccess }) => {
  const [vehicles, setVehicles] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    vehicleId: "",
    serviceType: "",
    remark: "",
  });

  // Fetch vehicles without services
  const fetchVehiclesWithoutServices = async () => {
    try {
      const response = await apiService.get("service/vehicles-without-services");
      if (response.status === 200 && response.data.data) {
        setVehicles(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching vehicles without services:", error);
      setStatusMessage("Failed to fetch vehicles");
      setIsSuccess(false);
    }
  };

  // Fetch all service types
  const fetchServiceTypes = async () => {
    try {
      const response = await apiService.get("service/serviceType/all");
      if (response.status === 200 && response.data.data) {
        setServiceTypes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching service types:", error);
      setStatusMessage("Failed to fetch service types");
      setIsSuccess(false);
    }
  };

  useEffect(() => {
    const refreshData = async () => {
      await fetchVehiclesWithoutServices();
      await fetchServiceTypes();
    };
    refreshData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.vehicleId || !formData.serviceType) {
      setStatusMessage("Please select both vehicle and service type");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setStatusMessage("");

    try {
      const response = await apiService.post("service/create", {
        vehicleId: formData.vehicleId,
        serviceType: formData.serviceType,
        remark: formData.remark,
      });

      if (response.status === 201 && response.data.status) {
        setStatusMessage("Service added successfully!");
        setIsSuccess(true);
        setFormData({
          vehicleId: "",
          serviceType: "",
          remark: "",
        });
        
        // Refresh the vehicle list since this vehicle now has a service
        await fetchVehiclesWithoutServices();
        
        setTimeout(() => {
          onUpdateSuccess?.();
          handleCancel?.();
        }, 1500);
      } else {
        setStatusMessage(response.data.message || "Failed to add service");
        setIsSuccess(false);
      }
    } catch (error) {
      setStatusMessage(
        error.response?.data?.message || "Error adding service"
      );
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Add New Vehicle Service</h3>
        <p className="text-sm text-gray-600">Add service details for a vehicle that doesn't have any service records yet</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle Selection */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Vehicle <span className="text-red-500">*</span>
          </label>
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleInputChange}
            required
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          >
            <option value="">Select Vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.plateNo}
              </option>
            ))}
          </select>
        </div>

        {/* Service Type Selection */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Service Type <span className="text-red-500">*</span>
          </label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleInputChange}
            required
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          >
            <option value="">Select Service Type</option>
            {serviceTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.serviceType}
              </option>
            ))}
          </select>
        </div>

        {/* Service Remark */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Service Remark
          </label>
          <textarea
            name="remark"
            value={formData.remark}
            onChange={handleInputChange}
            rows={3}
            placeholder="Enter service remarks..."
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>




        {/* Status Message */}
        {statusMessage && (
          <div className={`py-2 px-3 rounded text-center ${
            isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {statusMessage}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => {
              // Reset form data
              setFormData({
                vehicleId: "",
                serviceType: "",
                remark: "",
              });
              setStatusMessage("");
              setIsSuccess(false);
              handleCancel?.();
            }}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-400 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.vehicleId || !formData.serviceType}
            className={`px-4 py-2 font-medium rounded-md transition-colors duration-200 ${
              loading || !formData.vehicleId || !formData.serviceType
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Adding..." : "Add Service"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewVehicleService; 