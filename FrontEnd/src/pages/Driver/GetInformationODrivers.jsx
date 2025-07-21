import React, { useState, useEffect } from "react";
import apiService from "../../config/axiosConfig";
import { toast } from "react-toastify";

const GetInformationODrivers = () => {
  const [drivers, setDrivers] = useState([]);

  // Fetch drivers from the database
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await apiService.get("/drivers");
        setDrivers(response.data); // Assuming the API returns an array of drivers
      } catch (error) {
        console.error("Error fetching drivers:", error);
        toast.error("Failed to fetch drivers.");
      }
    };

    fetchDrivers();
  }, []);

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-semibold mb-5">Driver Information</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Phone</th>
            <th className="border border-gray-300 p-2">License Number</th>
          </tr>
        </thead>
        <tbody>
          {drivers.length > 0 ? (
            drivers.map((driver) => (
              <tr key={driver.id}>
                <td className="border border-gray-300 p-2">{driver.id}</td>
                <td className="border border-gray-300 p-2">{driver.name}</td>
                <td className="border border-gray-300 p-2">{driver.email}</td>
                <td className="border border-gray-300 p-2">{driver.phone}</td>
                <td className="border border-gray-300 p-2">{driver.licenseNumber}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-2">
                No drivers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GetInformationODrivers;