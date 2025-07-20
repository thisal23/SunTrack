import React, { useEffect, useState } from "react";
import vehicle from "../../assets/vehicle.jpeg";
import apiService from "../../config/axiosConfig"; // assuming you use axios through apiService

const VehicleInfoCard = ({ vehicleId }) => {
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await apiService.get(`/vehicle/details/${vehicleId}`);
        setVehicleData(response.data.data);
        console.log("Fetched data:", response.data);
      } catch (err) {
        setError("Failed to load vehicle details.");
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicleDetails();
    }
  }, [vehicleId]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!vehicleData)
    return <div className="text-center">No data available.</div>;

  return (
    <div>
      <div className="flex flex-row justify-center">
        <span className="text-2xl text-[#0F2043]">Vehicle Details</span>
      </div>

      <div className="rounded-full flex flex-row justify-center">
        <img src={vehicle} alt="vehicle_img" />
      </div>

      <div className="mx-auto flex flex-row justify-center w-full">
        <table className="table-auto border-collapse w-full">
          <tbody>
            <tr>
              <td className="px-4 font-bold">Vehicle Number</td>
              <td className="text-right px-4 py-2">{vehicleData.plateNo}</td>
            </tr>
            <tr>
              <td className="px-4 font-bold">Fuel Type</td>
              <td className="text-right px-4 py-2">{vehicleData.fuelType}</td>
            </tr>
            <tr>
              <td className="px-4 font-bold">Color</td>
              <td className="text-right px-4 py-2">{vehicleData.color}</td>
            </tr>
            <tr>
              <td className="px-4 font-bold">Registered Year</td>
              <td className="text-right px-4 py-2">
                {vehicleData.registeredYear}
              </td>
            </tr>
            <tr>
              <td className="px-4 font-bold">Chassie Number</td>
              <td className="text-right px-4 py-2">{vehicleData.chassieNo}</td>
            </tr>
            <tr>
              <td className="px-4 font-bold">Status</td>
              <td className="text-right px-4 py-2">{vehicleData.status}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleInfoCard;
