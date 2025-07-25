import React, { useState } from "react";
import apiService from "../../config/axiosConfig";

const PendingTripDeleteCard = ({ tripId, handleCancel, onUpdateSuccess, startLocation, endLocation, date }) => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setStatusMessage("");
    try {
      const res = await apiService.delete(`/trip/${tripId}`);
      if (res.status === 200 && res.data.status) {
        setStatusMessage("Trip deleted successfully.");
        setTimeout(() => {
          onUpdateSuccess?.();
          handleCancel?.();
        }, 1200);
      } else {
        setStatusMessage(res.data.message || "Failed to delete trip.");
      }
    } catch (err) {
      setStatusMessage(
        err.response?.data?.message || "Error deleting trip."
      );
    }
    setLoading(false);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Delete Trip</h3>
      <div className="mb-2 text-gray-700">
        <div><span className="font-medium">Start Location:</span> {startLocation}</div>
        <div><span className="font-medium">End Location:</span> {endLocation}</div>
        <div><span className="font-medium">Date:</span> {date}</div>
      </div>
      <div className="mb-4">
        Are you sure you want to delete this trip?
      </div>
      {statusMessage && (
        <div
          className={`mb-3 py-2 px-3 rounded text-center ${
            statusMessage.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {statusMessage}
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className={`py-2 px-4 rounded-md font-semibold shadow ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
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
  );
};

export default PendingTripDeleteCard;
