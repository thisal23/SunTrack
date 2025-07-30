import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import apiService from "../../config/axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddNew = () => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearAll = () => {
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
    toast.success("Form cleared successfully!");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <NavBar />
      
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-17">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Trip</h1>
                <p className="mt-2 text-gray-600">Schedule a new trip with route details and assignments</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            
            

            {/* Form Content */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Trip Route Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <div className="bg-blue-100 p-1.5 rounded-lg">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span>Trip Route</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Location *
                      </label>
                      <input
                        type="text"
                        name="startLocation"
                        value={tripData.startLocation}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                        placeholder="Enter start location"
                        className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors hover:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Location *
                      </label>
                      <input
                        type="text"
                        name="endLocation"
                        value={tripData.endLocation}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                        placeholder="Enter end location"
                        className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors hover:border-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Trip Schedule Section */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <div className="bg-green-100 p-1.5 rounded-lg">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span>Trip Schedule</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Trip Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={tripData.date}
                        onChange={handleChange}
                        required
                        className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors hover:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        name="suggestStartTime"
                        value={tripData.suggestStartTime}
                        onChange={handleChange}
                        required
                        className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors hover:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Time <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="time"
                        name="suggestEndTime"
                        value={tripData.suggestEndTime}
                        onChange={handleChange}
                        className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors hover:border-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Assignments Section */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <div className="bg-purple-100 p-1.5 rounded-lg">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span>Assignments</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Assign Vehicle <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <select
                        name="vehicleId"
                        value={tripData.vehicleId}
                        onChange={handleChange}
                        className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors hover:border-gray-400"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Assign Driver <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <select
                        name="driverId"
                        value={tripData.driverId}
                        onChange={handleChange}
                        className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors hover:border-gray-400"
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
                  </div>
                </div>

                {/* Trip Remarks Section */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <div className="bg-orange-100 p-1.5 rounded-lg">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <span>Trip Remarks</span>
                  </h3>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Notes <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      name="tripRemark"
                      value={tripData.tripRemark}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Enter any additional notes about this trip..."
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors hover:border-gray-400 resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-8 gap-6">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="px-8 py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 bg-red-500 hover:bg-red-600 text-white transform hover:scale-105 active:scale-95"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Clear All</span>
                    </div>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Create Trip</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNew;