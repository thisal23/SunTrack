import React, { useEffect, useState } from "react";
import apiService from "../../config/axiosConfig";
import { toast } from "react-toastify";

const AssignCard = ({ tripId, onClose, onSuccess }) => {
  const [vehicleData, setVehicleData] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [driverData, setDriverData] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [success, setSuccess] = useState(false);

  // Add CSS for dropdown height limitation
  useEffect(() => {
    const styleId = "assigncard-dropdown-styles";
    const existingStyle = document.getElementById(styleId);
    
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        /* Limit dropdown height to show only 8 items */
        .assigncard-page select {
          max-height: none;
        }
        
        .assigncard-page select option {
          padding: 8px 12px;
        }
        
        /* Style for dropdown when opened */
        .assigncard-page select[size] {
          max-height: 320px; /* Approximately 8 items * 40px each */
          overflow-y: auto;
        }
        
        /* Ensure consistent option height */
        .assigncard-page select option {
          height: 40px;
          line-height: 24px;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.classList.add("assigncard-page");

    return () => {
      document.body.classList.remove("assigncard-page");
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  //Fetch vehicle data
  const fetchVehicleData = async () => {
    try {
      const data = await apiService.get(`/trip/${tripId}/available-vehicles`);

      if (data.status !== 200) {
        toast.error("Trip data fetching error!!!");
        return;
      }

      setVehicleData(data.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch vehicle data");
    }
  };

  //fetch driver data
  const fetchDriver = async (vehicleId) => {
    try {
      const data = await apiService.get(`trip/${tripId}/available-drivers`);

      if (data.status !== 200) {
        toast.error("Driver data fetching error!!!");
        return;
      }

      console.log(data);

      setDriverData(data.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch driver data");
    }
  };

  const handleVehicleChange = (id) => {
    const numericId = parseInt(id, 10);
    setSelectedVehicle(numericId);
    setSelectedDriver(""); // Reset driver selection
    setDriverData([]); // Clear driver data
    
    if (numericId) {
      fetchDriver(numericId);
    }
  };

  const handleAssign = async () => {
    if (!selectedVehicle || !selectedDriver) {
      toast.error("Please select both vehicle and driver");
      return;
    }

    setAssigning(true);
    
    try {
      // Assign vehicle first
      const vehicleResponse = await apiService.post(`trip/${tripId}/assign-vehicle`, {
        vehicleId: selectedVehicle,
      });

      if (vehicleResponse.status !== 200) {
        throw new Error("Failed to assign vehicle");
      }

      // Then assign driver
      const driverResponse = await apiService.post(`trip/${tripId}/assign-driver`, {
        driverId: selectedDriver,
      });

      if (driverResponse.status !== 200) {
        throw new Error("Failed to assign driver");
      }

      // Both assignments successful
      setSuccess(true);
      toast.success("Driver & Vehicle assigned successfully!");
      
      // Close modal and refresh data after a short delay
      setTimeout(() => {
        // Call the success callback to refresh the trip table
        if (onSuccess) {
          onSuccess();
        }
        // Reset states
        setAssigning(false);
        setSuccess(false);
        setSelectedVehicle("");
        setSelectedDriver("");
        setVehicleData([]);
        setDriverData([]);
      }, 1000); // Reduced delay

    } catch (error) {
      console.error("Assignment error:", error);
      toast.error(error.message || "Failed to assign driver or vehicle");
      setAssigning(false);
      setSuccess(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchVehicleData();
    }
  }, [tripId]);

  // Reset form when modal is closed
  useEffect(() => {
    return () => {
      setSelectedVehicle("");
      setSelectedDriver("");
      setVehicleData([]);
      setDriverData([]);
      setAssigning(false);
      setSuccess(false);
    };
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
                value={selectedVehicle}
                onChange={(e) => handleVehicleChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                disabled={assigning || success}
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
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(parseInt(e.target.value, 10))}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                disabled={!selectedVehicle || assigning || success}
              >
                <option value="" disabled>
                  {!selectedVehicle ? "--select vehicle first--" : "--select driver--"}
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
      </table>

      <div className="w-full mt-5">
        <button
          type="button"
          onClick={handleAssign}
          disabled={!selectedVehicle || !selectedDriver || assigning || success}
          className={`px-4 py-2 w-full rounded-lg font-medium transition-all duration-200 ${
            selectedVehicle && selectedDriver && !assigning && !success
              ? "bg-amber-400 hover:bg-amber-600 text-white cursor-pointer"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          {assigning
            ? "Assigning..."
            : success
            ? "Assigned!"
            : "Assign & Update"}
        </button>
        
        {success && (
          <div className="text-green-600 text-center mt-2 font-semibold">
            Assignment successful! Refreshing data...
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignCard;