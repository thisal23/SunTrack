import React, { useState, useEffect } from "react";
import apiService from "../../config/axiosConfig";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const DriverDetailUpdate = () => {
  const { driverId } = useParams(); // Get driver ID from the route
  const navigate = useNavigate();

  const [driverDetails, setDriverDetails] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
  });

  // Fetch driver details
  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const response = await apiService.get(`/drivers/${driverId}`);
        setDriverDetails(response.data);
      } catch (error) {
        console.error("Error fetching driver details:", error);
        toast.error("Failed to fetch driver details.");
      }
    };

    fetchDriverDetails();
  }, [driverId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDriverDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.put(`/drivers/${driverId}`, driverDetails);
      if (response.status === 200) {
        toast.success("Driver details updated successfully!");
        navigate("/drivers"); // Redirect to the drivers list page
      } else {
        toast.error("Failed to update driver details.");
      }
    } catch (error) {
      console.error("Error updating driver details:", error);
      toast.error("Error updating driver details.");
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-semibold mb-5">Update Driver Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={driverDetails.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={driverDetails.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={driverDetails.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">License Number</label>
          <input
            type="text"
            name="licenseNumber"
            value={driverDetails.licenseNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Update Driver
        </button>
      </form>
    </div>
  );
};

export default DriverDetailUpdate;