import React, { useEffect, useState } from "react";
import apiService from "../../config/axiosConfig";
import { toast } from "react-toastify";

const AssignCard = ({ tripId, onClose, onSuccess }) => {
  const [vehicleData, setVehicleData] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [driverData, setDriverData] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");

  //Fetch vehicle data
  const fetchVehicleData = async () => {
    try {
      const data = await apiService.get(`/trip/${tripId}/available-vehicles`);

      if (data.status !== 200) {
        toast.error("Trip data fetching error!!!");
      }

      setVehicleData(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  //fetch driver data
  const fetchDriver = async (vehicleId) => {
    try {
      const data = await apiService.get(`trip/${tripId}/available-drivers`);

      if (data.status !== 200) {
        toast.error("Driver data fetching error!!!");
      }

      console.log(data);

      setDriverData(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVehicleChange = (id) => {
    const numericId = parseInt(id, 10);
    setSelectedVehicle(numericId);
    if (numericId) fetchDriver(numericId);
  };

  const handleAssign = async () => {
    try {
      const vehicle = await apiService.post(`trip/${tripId}/assign-vehicle`, {
        vehicleId: selectedVehicle,
      });
      const driver = await apiService.post(`trip/${tripId}/assign-driver`, {
        driverId: selectedDriver,
      });

      if (vehicle.status === 200 && driver.status === 200) {
        toast.success("Driver & Vehicle assigned successfully");
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign driver or vehicle");
    }
  };

  useEffect(() => {
    fetchVehicleData();
  }, []);

  return (
    <div className="mx-auto flex flex-row justify-center w-full">
      <table className="table-auto border-collapse w-full">
        <tbody>
          <tr className="">
            <td className=" px-4 py-2 font-bold">Trip Id</td>
            <td className=" text-right px-4 py-2">#{tripId}</td>
          </tr>

          <tr className="">
            <td className=" px-4 py-2 font-bold">Select Vehicle</td>
            <td className=" text-right px-4 py-2">
              <select
                name="assign_vehicle"
                id="assign_vehicle"
                onChange={(e) =>
                  handleVehicleChange(parseInt(e.target.value), 10)
                }
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
              >
                <option value="" disabled>
                  --select vehicle--
                </option>
                {Array.isArray(vehicleData) &&
                  vehicleData.map((item, index) => {
                    return (
                      <option value={item.id} key={index}>
                        {item.vehicleBrand?.brand} {item.vehicleModel?.model} |{" "}
                        {item.category}
                      </option>
                    );
                  })}
              </select>
            </td>
          </tr>
          <tr className="">
            <td className=" px-4 py-2 font-bold">Select Driver</td>
            <td className=" text-right px-4 py-2">
              <select
                name="assign_driver"
                id="assign_driver"
                onChange={(e) =>
                  setSelectedDriver(parseInt(e.target.value), 10)
                }
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                disabled={selectedVehicle === "" ? true : false}
              >
                <option value="" disabled>
                  --select driver--
                </option>
                {Array.isArray(driverData) &&
                  driverData.map((item, index) => {
                    return (
                      <option value={item.id} key={index}>
                        {item.user.firstName} {item.user.lastName} |{" "}
                        {item.licenseType}
                      </option>
                    );
                  })}
              </select>
            </td>
          </tr>
        </tbody>

        <tr className="">
          <td colSpan={2}>
            <button
              type="button"
              onClick={handleAssign}
              disabled={!selectedVehicle || !selectedDriver}
              className={`px-2 mt-5 cursor-pointer w-full py-2 ${
                selectedVehicle && selectedDriver
                  ? "bg-amber-400 hover:bg-amber-600"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white rounded-full mx-auto text-center`}
            >
              Assign & Update
            </button>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default AssignCard;
