import React, { useEffect, useState } from "react";
import apiService from "../../config/axiosConfig";
import { toast } from "react-toastify";

// Sachini part
const AssignCard = ({ tripId }) => {
  const [vehicleData, setVehicleData] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [driverData, setDriverData] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");

  const fetchVehicleData = async () => {
    try {
      const data = await apiService.get("vehicle/vehicle/all");

      if (data.status !== 200) {
        toast.error("Trip data fetching error!!!");
      }

      setVehicleData(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDriver = async () => {
    try {
      const data = await apiService.get(`trip/trip/driver/${selectedVehicle}`);

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
    setSelectedVehicle(id);

    if (id) {
      fetchDriver();
    }
  };

  const handleAssign = async () => {
    try {
      const vehicle = await apiService.put(
        `trip/trip/assign_vehicle/${tripId}`,
        { vehicleId: selectedVehicle }
      );
      const driver = await apiService.put(`trip/trip/assign_driver/${tripId}`, {
        driverId: selectedDriver,
      });

      console.log(vehicle);
      console.log(driver);

      if (vehicle.status !== 200 || driver.status !== 200) {
        toast.error("Something went wrong");
      }

      toast.success("Driver/Vehicle assigned successfully");
      fetchVehicleData();
    } catch (error) {
      console.log(error);
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
                name="assign_driver"
                id="assign_driver"
                onChange={(e) => handleVehicleChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
              >
                <option value="" disabled selected>
                  --select vehicle--
                </option>
                {Array.isArray(vehicleData) &&
                  vehicleData.map((item, index) => {
                    return (
                      <option value={item.id} key={index}>
                        {item.vehicleTitle} {item.model} | {item.vehicleTypeTwo}
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
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                disabled={selectedVehicle === "" ? true : false}
              >
                <option value="" disabled selected>
                  --select driver--
                </option>
                {Array.isArray(driverData) &&
                  driverData.map((item, index) => {
                    return (
                      <option value={item.User.id} key={index}>
                        {item.User.firstName} {item.User.lastName}
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
              className="px-2 mt-5 cursor-pointer w-full  py-2 bg-amber-400 hover:bg-amber-600 text-white rounded-full mx-auto text-center"
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
