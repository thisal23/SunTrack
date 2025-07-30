import React, { useState, useEffect } from "react";
import apiService from "../../config/axiosConfig";

const ServiceDeleteCard = ({ vehicleId, serviceId, handleCancel, onDeleteSuccess }) => {
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableServiceTypes, setAvailableServiceTypes] = useState([]);
  const [fetchingServiceTypes, setFetchingServiceTypes] = useState(false);
  const [vehiclePlateNo, setVehiclePlateNo] = useState("");

  // Add CSS for dropdown height limitation
  useEffect(() => {
    const styleId = "servicedeletecard-dropdown-styles";
    const existingStyle = document.getElementById(styleId);
    
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        /* Limit dropdown height to show only 8 items */
        .servicedeletecard-page select {
          max-height: none;
        }
        
        .servicedeletecard-page select option {
          padding: 8px 12px;
        }
        
        /* Style for dropdown when opened */
        .servicedeletecard-page select[size] {
          max-height: 320px; /* Approximately 8 items * 40px each */
          overflow-y: auto;
        }
        
        /* Ensure consistent option height */
        .servicedeletecard-page select option {
          height: 40px;
          line-height: 24px;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.classList.add("servicedeletecard-page");

    return () => {
      document.body.classList.remove("servicedeletecard-page");
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  // Set selected service type when serviceId prop is provided
  useEffect(() => {
    if (serviceId) {
      setSelectedServiceType(serviceId);
    }
  }, [serviceId]);

  // Fetch service types for this vehicle
  const fetchServiceTypesForVehicle = async () => {
    if (!vehicleId) return;
    
    setFetchingServiceTypes(true);
    try {
      const response = await apiService.get(`/service/serviceType/vehicle/${vehicleId}`);
      
      if (response.status === 200 && response.data.data) {
        setAvailableServiceTypes(response.data.data);
      } else {
        setStatusMessage("No service types found for this vehicle.");
        setAvailableServiceTypes([]);
      }
    } catch (error) {
      console.error("Error fetching service types:", error);
      setStatusMessage("Failed to fetch service types for this vehicle.");
      setAvailableServiceTypes([]);
    } finally {
      setFetchingServiceTypes(false);
    }
  };

  // Fetch service types when component mounts
  useEffect(() => {
    fetchServiceTypesForVehicle();
  }, [vehicleId]);

  // Fetch vehicle plate number
  useEffect(() => {
    const fetchVehiclePlateNo = async () => {
      try {
        const res = await apiService.get(`vehicle/details/${vehicleId}`);
        if (res.status === 200 && res.data.data) {
          setVehiclePlateNo(res.data.data.plateNo || "N/A");
        } else {
          setVehiclePlateNo("N/A");
        }
      } catch (err) {
        console.error("Error fetching vehicle plate number:", err);
        setVehiclePlateNo("N/A");
      }
    };
    
    if (vehicleId) {
      fetchVehiclePlateNo();
    }
  }, [vehicleId]);

  const handleServiceTypeChange = (e) => {
    setSelectedServiceType(e.target.value);
  };

  const handleDelete = async () => {
    if (!selectedServiceType) {
      setStatusMessage("Please select a service type first.");
      return;
    }
    
    setLoading(true);
    setStatusMessage("");
    try {
      const res = await apiService.delete(`/service/vehicle/${vehicleId}/serviceType/${selectedServiceType}`);
      if (res.status === 200 && res.data.status) {
        setStatusMessage("Service record deleted successfully.");
        setTimeout(() => {
          onDeleteSuccess?.();
          handleCancel?.();
        }, 1500);
      } else {
        setStatusMessage(res.data.message || "Failed to delete record.");
      }
    } catch (err) {
      setStatusMessage(
        err.response?.data?.message || "Error deleting service record."
      );
    }
    setLoading(false);
  };

  return (
    <div>
      <div>
        {/* Vehicle No */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">Vehicle No:</label>
          <input
            type="text"
            value={vehiclePlateNo}
            readOnly
            className="w-full py-2 px-3 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
        {/* Service Type Dropdown */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">Service Type:</label>
          {fetchingServiceTypes ? (
            <div className="w-full py-2 px-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
              Loading service types...
            </div>
          ) : (
            <select
              value={selectedServiceType}
              onChange={handleServiceTypeChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-md"
              disabled={availableServiceTypes.length === 0}
            >
              <option value="" disabled>
                {availableServiceTypes.length === 0 
                  ? "No service types available for this vehicle" 
                  : "Select Service Type"
                }
              </option>
              {availableServiceTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.serviceType}
                </option>
              ))}
            </select>
          )}
        </div>
        {/* Confirmation */}
        <div className="mb-4">
          Are you sure you want to delete this service record?
        </div>
        {statusMessage && (
          <div className={`mb-3 py-2 px-3 rounded text-center ${statusMessage.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {statusMessage}
          </div>
        )}
        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleDelete}
            disabled={loading || !selectedServiceType}
            className={`py-2 px-4 rounded-md font-semibold shadow ${loading || !selectedServiceType ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"}`}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="py-2 px-4 bg-white text-blue-600 font-semibold rounded-md shadow hover:bg-blue-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDeleteCard;
