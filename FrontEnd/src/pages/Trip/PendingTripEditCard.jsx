import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useEffect, useRef } from "react";
import apiService from "../../config/axiosConfig";

const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="flex justify-between items-center w-full py-2 px-3 !border !border-gray-300 rounded-md !bg-white !text-gray-600 text-left focus:outline-none"
  >
    <span>{value || "Select date"}</span>
    <FaCalendarAlt className="text-gray-500 ml-2" />
  </button>
));

const PendingTripEditCard = ({ tripId, handleCancel, onUpdateSuccess }) => {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [date, setDate] = useState(null);
  const [suggestStartTime, setSuggestStartTime] = useState(null);
  const [suggestEndTime, setSuggestEndTime] = useState(null);
  const [statusMessage, setStatusMessage] = useState(""); // New state for status message
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)

    setStatusMessage("");
    setIsSuccess(false);

    // --- Validation ---
    if (!startLocation || !endLocation || !date || !suggestStartTime) {
      setStatusMessage("Please fill all required date fields.");
      setIsSuccess(false);
      return; // Stop submission
    }

    const formDataToSend = new FormData();
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, "0");
      formDataToSend.append("date", `${year}-${month}-${day}`);
    }
    if (startLocation) formDataToSend.append("startLocation", startLocation);
    if (endLocation) formDataToSend.append("endLocation", endLocation);
    if (suggestStartTime)
      formDataToSend.append("suggestStartTime", suggestStartTime);
    if (suggestEndTime) formDataToSend.append("suggestEndTime", suggestEndTime);

    try {
      const response = await apiService.put(
        `/document/update/${licenseId}`,
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-4">
        {/* start location */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">
            Start Location:
          </label>
          <input
            type="text"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            className="py-2 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>

        {/* end location */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">
            End Location:
          </label>
          <input
            type="text"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            className="py-2 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>

        {/* date */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="py-2 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>

        {/* start time */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">
            Suggested Start Time:
          </label>
          <input
            type="text"
            value={suggestStartTime}
            onChange={(e) => setSuggestStartTime(e.target.value)}
            className="py-2 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>

        {/* end time */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">
            Suggested End Time:
          </label>
          <input
            type="text"
            value={suggestEndTime}
            onChange={(e) => setSuggestEndTime(e.target.value)}
            className="py-2 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>

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

export default PendingTripEditCard;
