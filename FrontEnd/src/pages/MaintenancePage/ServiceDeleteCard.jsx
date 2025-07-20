import React, { useState, useEffect } from "react";
import apiService from "../../config/axiosConfig";

const ServiceDeleteCard = ({ vehicleId, onClose, onDeleteSuccess }) => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [lastRecord, setLastRecord] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingRecord, setFetchingRecord] = useState(false);

  // Fetch service types on mount
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const res = await apiService.get("service/serviceType/all");
        if (res.status === 200) {
          setServiceTypes(res.data.data);
        } else {
          setStatusMessage("Failed to fetch service types.");
        }
      } catch (err) {
        setStatusMessage("Error fetching service types.");
      }
    };
    fetchServiceTypes();
  }, []);

  // Fetch last record when service type changes
  useEffect(() => {
    if (!selectedServiceType) {
      setLastRecord(null);
      return;
    }
    const fetchLastRecord = async () => {
      setFetchingRecord(true);
      setLastRecord(null);
      setStatusMessage("");
      try {
        const res = await apiService.get(
          `/serviceinfo/last?vehicleId=${vehicleId}&serviceType=${selectedServiceType}`
        );
        if (res.status === 200 && res.data.data) {
          setLastRecord(res.data.data);
        } else {
          setStatusMessage("No record found for this vehicle and service type.");
        }
      } catch (err) {
        setStatusMessage("Error fetching last record.");
      }
      setFetchingRecord(false);
    };
    fetchLastRecord();
  }, [selectedServiceType, vehicleId]);

  const handleServiceTypeChange = (e) => {
    setSelectedServiceType(e.target.value);
  };

  const handleDelete = async () => {
    if (!lastRecord || !lastRecord.id) return;
    setLoading(true);
    setStatusMessage("");
    try {
      const res = await apiService.delete(`/serviceinfo/${lastRecord.id}`);
      if (res.status === 200 && res.data.status) {
        setStatusMessage("Service record deleted successfully.");
        setTimeout(() => {
          onDeleteSuccess?.();
          onClose?.();
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
        <h2 className="text-lg font-semibold mb-4">Delete Service Record</h2>
        {/* Vehicle ID */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">Vehicle ID:</label>
          <input
            type="text"
            value={vehicleId}
            readOnly
            className="w-full py-2 px-3 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        {/* Service Type Dropdown */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">Service Type:</label>
          <select
            value={selectedServiceType}
            onChange={handleServiceTypeChange}
            className="w-full py-2 px-3 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select Service Type
            </option>
            {serviceTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.serviceType}
              </option>
            ))}
          </select>
        </div>
        {/* Last Record Display */}
        {fetchingRecord ? (
          <div className="text-gray-500 mb-2">Loading last record...</div>
        ) : lastRecord ? (
          <div className="mb-3 p-3 bg-gray-50 rounded border">
            <div><span className="font-medium">Date Added:</span> {lastRecord.dateAdded || "-"}</div>
            <div><span className="font-medium">Added By:</span> {lastRecord.addedBy || "-"}</div>
          </div>
        ) : selectedServiceType && (
          <div className="text-red-500 mb-2">No record found for this vehicle and service type.</div>
        )}
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
            disabled={loading || !lastRecord}
            className={`py-2 px-4 rounded-md font-semibold shadow ${loading || !lastRecord ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"}`}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onClose}
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
