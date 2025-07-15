import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useEffect, useRef } from "react";
import apiService from "../../config/axiosConfig";

const ServiceAddCard = ({
  vehicleId,
  serviceType,
  handleCancel,
  onUpdateSuccess,
}) => {
  const [newserviceType, setNewServiceType] = useState([]);
  const [statusMessage, setStatusMessage] = useState(""); // New state for status message
  const [isSuccess, setIsSuccess] = useState(false);

  // fetching serviceType
  const fetchServiceType = async () => {
    try {
      const serviceTypeResponse = await apiService.get(
        "service/serviceType/all"
      );
      console.log(serviceTypeResponse.data.data);

      if (serviceTypeResponse.status !== 200) {
        toast.error("Service Type fetching error!!!");
      }

      setNewServiceType(serviceTypeResponse.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [formDataToSend, setFormDataToSend] = useState({
    // assigning all the vehicle input data into vehicle form data state
    service_type: "",
    remark: "",
    date_added: "",
    added_by: "",
  });

  // handling form input changes input onChange event
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormDataToSend({
      ...formDataToSend,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const { service_type, remark, date_added, added_by } = formDataToSend;

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)

    setStatusMessage("");
    setIsSuccess(false);

    const formDataToSend = new FormData();
    formDataToSend.append("ServiceType", service_type);
    formDataToSend.append("remark", remark);
    formDataToSend.append("dateAdded", date_added);
    formDataToSend.append("addedBy", added_by);

    try {
      const response = await apiService.put(
        `
        /service/update/${vehicleId}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200 && response.data.status) {
        setStatusMessage(response.data.message);
        setIsSuccess(true);

        // Close modal and refresh data after a short delay
        setTimeout(() => {
          handleCancel(); // Close the modal
          if (typeof onUpdateSuccess === "function") {
            onUpdateSuccess(); // Trigger parent to refresh data
          }
        }, 2000);
      } else {
        setStatusMessage(response.data.message || "Failed to update document.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error updating document:", error);
      setStatusMessage(
        error.response?.data?.message || "An error occurred during update."
      );
      setIsSuccess(false);
    }
  };
  useEffect(() => {
    fetchServiceType();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-4">
        {/* Vehicle No */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Vehicle No:</label>
          <input
            type="text"
            name="vehicle_No"
            className="py-2 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            value={vehicleId}
            readOnly
          />
        </div>

        {/* Service Type */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">
            Service Type:
          </label>
          <select
            name="service_type"
            id="service_type"
            value={formDataToSend.service_type}
            onChange={handleInputChange}
            className="block w-full py-2.5 px-3 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          >
            <option value="" disabled>
              Select Service Type
            </option>
            {Array.isArray(newserviceType) &&
              newserviceType.map((item, idx) => {
                return (
                  <option value={item.id} key={idx}>
                    {item.serviceType}
                  </option>
                );
              })}
          </select>
        </div>

        {/* Remark */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Remark:</label>
          <input
            type="text"
            name="remark"
            className="py-2.5 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            value={formDataToSend.remark}
            onChange={handleInputChange}
          />
        </div>

        {/* Added Date */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Date Added:</label>
          <input
            type="date"
            name="date_added"
            value={formDataToSend.date_added}
            onChange={handleInputChange}
            className="py-2.5 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>

        {/* Added by */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Added By:</label>
          <input
            type="text"
            name="added1_by"
            className="py-2.5 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            value={formDataToSend.added_by}
            onChange={handleInputChange}
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
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200"
          >
            Update
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="py-2 px-4 bg-white text-blue-600 font-semibold rounded-md shadow hover:bg-blue-50 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default ServiceAddCard;
