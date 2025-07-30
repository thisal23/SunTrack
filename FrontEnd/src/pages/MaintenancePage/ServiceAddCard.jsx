import React, { useEffect, useState } from "react";
import apiService from "../../config/axiosConfig";

const ServiceAddCard = ({ vehicleId, handleCancel, onUpdateSuccess }) => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehiclePlateNo, setVehiclePlateNo] = useState("");

  const [formDataToSend, setFormDataToSend] = useState({
    service_type: "",
    remark: "",
  });

  // Add CSS for dropdown height limitation
  useEffect(() => {
    const styleId = "serviceaddcard-dropdown-styles";
    const existingStyle = document.getElementById(styleId);
    
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        /* Limit dropdown height to show only 8 items */
        .serviceaddcard-page select {
          max-height: none;
        }
        
        .serviceaddcard-page select option {
          padding: 8px 12px;
        }
        
        /* Style for dropdown when opened */
        .serviceaddcard-page select[size] {
          max-height: 320px; /* Approximately 8 items * 40px each */
          overflow-y: auto;
        }
        
        /* Ensure consistent option height */
        .serviceaddcard-page select option {
          height: 40px;
          line-height: 24px;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.classList.add("serviceaddcard-page");

    return () => {
      document.body.classList.remove("serviceaddcard-page");
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  useEffect(() => {
    const fetchServiceType = async () => {
      try {
        const res = await apiService.get("service/serviceType/all");
        if (res.status === 200) {
          setServiceTypes(res.data.data);
        } else {
          setStatusMessage("Failed to fetch service types.");
          setIsSuccess(false);
        }
      } catch (err) {
        setStatusMessage("Error fetching service types.");
        setIsSuccess(false);
      }
    };
    fetchServiceType();
  }, []);

  // Fetch vehicle plate number
  useEffect(() => {
    const fetchVehiclePlateNo = async () => {
      if (vehicleId) {
        try {
          const response = await apiService.get(`vehicle/details/${vehicleId}`);
          if (response.status === 200 && response.data.data) {
            setVehiclePlateNo(response.data.data.plateNo || "N/A");
          } else {
            setVehiclePlateNo("N/A");
          }
        } catch (error) {
          console.error("Error fetching vehicle details:", error);
          setVehiclePlateNo("N/A");
        }
      }
    };
    fetchVehiclePlateNo();
  }, [vehicleId]);

  useEffect(() => {
    setFormDataToSend({
      service_type: "",
      remark: "",
    });
    setStatusMessage("");
    setIsSuccess(false);
  }, [vehicleId]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormDataToSend((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formDataToSend.service_type) {
      setStatusMessage("Please select a service type");
      setIsSuccess(false);
      return;
    }

    setStatusMessage("");
    setIsSuccess(false);
    setLoading(true);

    try {
      const requestData = {
        serviceType: formDataToSend.service_type,
        remark: formDataToSend.remark,
        vehicleId: vehicleId
      };

      console.log("Sending data:", requestData);

      const response = await apiService.post(`service/create`, requestData);

      if ((response.status === 200 || response.status === 201) && response.data.status) {
        setStatusMessage(response.data.message);
        setIsSuccess(true);
        setTimeout(() => {
          handleCancel();
          onUpdateSuccess?.();
        }, 2000);
      } else {
        setStatusMessage(response.data.message || "Failed to add service.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error adding service:", error);
      setStatusMessage(
        error.response?.data?.message || "An error occurred while adding service."
      );
      setIsSuccess(false);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {/* Vehicle No */}
      <div className="flex flex-col">
        <label className="font-medium text-gray-700 mb-1">Vehicle No:</label>
        <input
          type="text"
          name="vehicle_No"
          value={vehiclePlateNo}
          readOnly
          className="py-2 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none bg-gray-50"
        />
      </div>

      {/* Service Type */}
      <div className="flex flex-col">
        <label className="font-medium text-gray-700 mb-1">Service Type:</label>
        <select
          name="service_type"
          value={formDataToSend.service_type}
          onChange={handleInputChange}
          required
          className="block w-full py-2.5 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
        >
          <option value="" disabled>
            Select Service Type
          </option>
          {serviceTypes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.serviceType}
            </option>
          ))}
        </select>
      </div>

      {/* Remark */}
      <div className="flex flex-col">
        <label className="font-medium text-gray-700 mb-1">Remark:</label>
        <input
          type="text"
          name="remark"
          value={formDataToSend.remark}
          onChange={handleInputChange}
          className="py-2.5 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
        />
      </div>

      {statusMessage && (
        <div
          className={`py-2 px-3 rounded-md text-center ${
            isSuccess
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {statusMessage}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end space-x-2 mt-5">
        <button
          type="submit"
          disabled={loading}
          className={`py-2 px-4 font-semibold rounded-md shadow transition duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="py-2 px-4 bg-white text-blue-600 font-semibold rounded-md shadow hover:bg-blue-50 transition duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ServiceAddCard;
