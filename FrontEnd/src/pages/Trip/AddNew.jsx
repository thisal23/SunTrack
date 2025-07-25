import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import apiService from "../../config/axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddNew = () => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [tripData, setTripData] = useState({
    startLocation: "",
    endLocation: "",
    date: "",
    suggestStartTime: "",
    suggestEndTime: "",
    tripRemark: "",
    driverId: "",
    vehicleId: "",
    status: "pending",
  });

  useEffect(() => {
    if (tripData.date) {
      const fetchAvailableResources = async () => {
        try {
          const vehicleRes = await apiService.get(
            `/available-vehicles?date=${tripData.date}`
          );

          const driverRes = await apiService.get(
            `/available-drivers?date=${tripData.date}`
          );

          console.log("Driver response data:", driverRes.data.data);
          console.log("Vehicle response data:", vehicleRes.data);

          if (vehicleRes.status !== 200 || driverRes.status !== 200) {
            toast.error("Data fetching error!!!");
          }

          setVehicles(vehicleRes.data);
          setDrivers(driverRes.data.data);
        } catch (err) {
          console.error("Error fetching filtered drivers/vehicles", err);
          toast.error("Failed to fetch available drivers or vehicles.");
        }
      };
      fetchAvailableResources();
    }
  }, [tripData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields (note: suggestEndTime is NOT required)
    if (!tripData.startLocation || !tripData.endLocation || !tripData.date || !tripData.suggestStartTime) {
      toast.error("Please fill all required fields: start location, end location, date, and suggested start time.");
      return;
    }

    try {
      // Build the payload, only including suggestEndTime if it's provided
      const payload = {
        startLocation: tripData.startLocation,
        endLocation: tripData.endLocation,
        date: tripData.date,
        suggestStartTime: tripData.suggestStartTime,
        status: tripData.status,
        ...(tripData.tripRemark && tripData.tripRemark.trim() ? { tripRemark: tripData.tripRemark } : {}),
        ...(tripData.driverId ? { driverId: +tripData.driverId } : {}),
        ...(tripData.vehicleId ? { vehicleId: tripData.vehicleId } : {}), // Fixed: removed unnecessary conversion
        ...(tripData.suggestEndTime ? { suggestEndTime: tripData.suggestEndTime } : {}),
      };

      console.log("Sending payload:", payload);

      const response = await apiService.post("/trip/create", payload);
      
      console.log("Response:", response);
      
      if (response.status === 201) {
        toast.success(response.data.message || "Trip created successfully");
        setTripData({
          startLocation: "",
          endLocation: "",
          date: "",
          suggestStartTime: "",
          suggestEndTime: "",
          tripRemark: "",
          driverId: "",
          vehicleId: "",
          status: "pending",
        });
      } else {
        toast.error(response.data.message || "Failed to create trip");
      }
    } catch (error) {
      console.error("Trip creation error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating the trip"
      );
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <NavBar />
      <div className="min-h-screen w-full p-6 text-black bg-gray-100 py-10">
        <div className="flex flex-row justify-between items-center my-5">
          <span className="text-3xl text-[#0F2043] font-semibold">
            Trips &gt; Create New Trip
          </span>
        </div>

        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center !text-[#0F2043]">
            Create New Trip
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-left mb-1 font-medium text-gray-700">
                Start Location *
              </label>
              <input
                type="text"
                name="startLocation"
                value={tripData.startLocation}
                onChange={handleChange}
                required
                autoComplete="off"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-left mb-1 font-medium text-gray-700">
                End Location *
              </label>
              <input
                type="text"
                name="endLocation"
                value={tripData.endLocation}
                onChange={handleChange}
                required
                autoComplete="off"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-left mb-1 font-medium text-gray-700">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={tripData.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-left mb-1 font-medium text-gray-700">
                  Suggested Start Time *
                </label>
                <input
                  type="time"
                  name="suggestStartTime"
                  value={tripData.suggestStartTime}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-left mb-1 font-medium text-gray-700">
                  Suggested End Time <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="time"
                  name="suggestEndTime"
                  value={tripData.suggestEndTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-left mb-1 font-medium text-gray-700">
                Assign Vehicle <span className="text-gray-400">(Optional)</span>
              </label>
              <select
                name="vehicleId"
                value={tripData.vehicleId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option value="">Select a vehicle</option>
                {Array.isArray(vehicles) &&
                  vehicles.map((vehicle, index) => (
                    <option key={index} value={vehicle.plateNo}>
                      {vehicle.vehicleBrand?.brand || 'Unknown Brand'} {vehicle.vehicleModel?.model || 'Unknown Model'} - {vehicle.category}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-left mb-1 font-medium text-gray-700">
                Assign Driver <span className="text-gray-400">(Optional)</span>
              </label>
              <select
                name="driverId"
                value={tripData.driverId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option value="">Select a driver</option>
                {Array.isArray(drivers) &&
                  drivers.map((driver, index) => (
                    <option key={index} value={driver.id}>
                      {driver.user?.firstName || 'Unknown Name'} - {driver.licenseType}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-left mb-1 font-medium text-gray-700">
                Trip Remark <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                name="tripRemark"
                value={tripData.tripRemark}
                onChange={handleChange}
                rows="3"
                placeholder="Enter any additional notes about this trip..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Create Trip
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNew;