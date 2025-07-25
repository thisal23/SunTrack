import React, { useEffect, useState } from "react";
import apiService from "../../config/axiosConfig";

const ServiceHistoryCard = ({ vehicleId, handleCancel }) => {
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vehicleId) return;
    setLoading(true);
    apiService.get(`/service/history/${vehicleId}`)
      .then(res => setServiceHistory(res.data.data || []))
      .finally(() => setLoading(false));
  }, [vehicleId]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Service History for Vehicle ID: {vehicleId}</h3>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : serviceHistory.length === 0 ? (
        <div className="text-gray-500">No service history found for this vehicle.</div>
      ) : (
        <table className="min-w-full border text-sm mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 border">Service Type</th>
              <th className="px-3 py-2 border">Remark</th>
              <th className="px-3 py-2 border">Date Added</th>
              <th className="px-3 py-2 border">Added By</th>
            </tr>
          </thead>
          <tbody>
            {serviceHistory.map((s, idx) => (
              <tr key={idx}>
                <td className="px-3 py-2 border">{s.serviceType}</td>
                <td className="px-3 py-2 border">{s.remark || '-'}</td>
                <td className="px-3 py-2 border">{s.updatedAt ? new Date(s.updatedAt).toLocaleString() : '-'}</td>
                <td className="px-3 py-2 border">{s.addedBy || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-end">
        <button
          onClick={handleCancel}
          className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ServiceHistoryCard;
