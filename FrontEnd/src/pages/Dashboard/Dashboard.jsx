import React, { useState, useEffect } from "react";
import PendingTripCard from "../../pages/Trip/PendingTripCard";
import DriverUpdateCard from "../../pages/Driver/DriverUpdateCard";
import InfoCard from "./InfoCard";
import { FaChevronCircleRight } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import apiService from "../../config/axiosConfig";

const Dashboard = () => {
  const [fetchTripCount, setFetchTripCount] = useState({
    pending: 0,
    live: 0,
    finished: 0,
  });

  const [fetchVehicleCount, setFetchVehicleCount] = useState({
    total: 0,
    available: 0,
    outOfService: 0,
  });

  const [fetchDriverCount, setFetchDriverCount] = useState({
    total: 0,
    active: 0,
    outOfService: 0,
  });

  const [pendingTrips, setPendingTrips] = useState([]);
  const [loadingPendingTrips, setLoadingPendingTrips] = useState(true);
  const [errorPendingTrips, setErrorPendingTrips] = useState("");

  const [topDrivers, setTopDrivers] = useState([]);
  const [topVehicles, setTopVehicles] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);
  const [errorTop, setErrorTop] = useState("");

  const fetchPendingTrips = async () => {
    setLoadingPendingTrips(true);
    setErrorPendingTrips("");
    try {
      const response = await apiService.get("trip/pending");
      const data = response.data.data;
      console.log(data);

      setPendingTrips(data);
    } catch (error) {
      setErrorPendingTrips("Error fetching pending trips");
    } finally {
      setLoadingPendingTrips(false);
    }
  };

  const fetchTripCounts = async () => {
    try {
      const response = await apiService.get("trip/count");
      console.log(response);
      const data = response.data;
      setFetchTripCount({
        pending: data.pending,
        live: data.live,
        finished: data.finished,
      });
    } catch (error) {
      console.error("Error fetching trip counts:", error);
    }
  };

  const fetchVehicleCounts = async () => {
    try {
      const response = await apiService.get("vehicle/count");
      console.log(response);
      const data = response.data;
      setFetchVehicleCount({
        total: data.total,
        available: data.available,
        outOfService: data.outOfService,
      });
    } catch (error) {
      console.error("Error fetchinf vehicle counts:", error);
    }
  };

  const fetchDriverCounts = async () => {
    try {
      const response = await apiService.get("users/driver-count");
      console.log(response);
      const data = response.data;
      setFetchDriverCount({
        total: data.total,
        active: data.active,
        outOfService: data.outOfService,
      });
    } catch (error) {
      console.error("Error fetching driver counts:", error);
    }
  };

  const fetchTopPerformers = async () => {
    setLoadingTop(true);
    setErrorTop("");
    try {
      const [driversRes, vehiclesRes] = await Promise.all([
        apiService.get("trip/top-drivers"),
        apiService.get("trip/top-vehicles"),
      ]);
      setTopDrivers(driversRes.data.data || []);
      setTopVehicles(vehiclesRes.data.data || []);
    } catch (err) {
      setErrorTop("Error fetching top performers");
    } finally {
      setLoadingTop(false);
    }
  };

  useEffect(() => {
    fetchTripCounts();
    fetchVehicleCounts();
    fetchPendingTrips();
    fetchDriverCounts();
    fetchTopPerformers();
  }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen dashboard-scroll">
      <NavBar />
      <div className="container_custom mt-5 mx-auto flex flex-row justify-center gap-4 pt-20 pb-16 items-start h-auto">
        <InfoCard
          CardName="Vehicles"
          count_name_1="Total"
          count_name_2="Available"
          count_name_3="Out of Service"
          count_1={fetchVehicleCount.total}
          count_2={fetchVehicleCount.available}
          count_3={fetchVehicleCount.outOfService}
        />
        <InfoCard
          CardName="Drivers"
          count_name_1="Total"
          count_name_2="Available"
          count_name_3="Out of Service"
          count_1={fetchDriverCount.total}
          count_2={fetchDriverCount.active}
          count_3={fetchDriverCount.outOfService}
        />
        <InfoCard
          CardName="Trips"
          count_name_1="Pending"
          count_name_2="Live"
          count_name_3="Finished"
          count_1={fetchTripCount.pending}
          count_2={fetchTripCount.live}
          count_3={fetchTripCount.finished}
        />
      </div>

      <div className="container_custom mx-auto flex flex-col sm:flex-row justify-between w-full gap-4">
        {/* Top Performers Section */}
        <div className="bg-white shadow-sm w-full sm:w-1/2 m-2 rounded-lg overflow-hidden h-auto">
          <div className="px-5 py-3 border-b border-gray-100">
            <span className="text-left text-xl sm:text-2xl text-[#0F2043] font-semibold block">
              Top Drivers
            </span>
          </div>
          <div className="flex flex-col space-y-2 max-h-[200px] overflow-y-auto px-5 py-4 dashboard-scroll">
            {loadingTop ? (
              <span className="text-[#0F2043] text-base">Loading...</span>
            ) : errorTop ? (
              <span className="text-[#0F2043] text-base">{errorTop}</span>
            ) : topDrivers.length > 0 ? (
              topDrivers.map((driver, idx) => (
                <div key={driver.driverId} className="flex flex-row justify-between items-center bg-[#f8fafc] mx-1 rounded px-3 py-2 border border-gray-100">
                  <span className="text-[#0F2043] text-base font-medium">{idx + 1}. {driver.name}</span>
                  <span className="text-[#6366f1] text-base">Trips: {driver.tripCount}</span>
                </div>
              ))
            ) : (
              <span className="text-[#0F2043] text-base">No data</span>
            )}
          </div>
          <div className="px-5 py-3 border-t border-gray-100">
            <span className="text-left text-xl sm:text-2xl text-[#0F2043] font-semibold block">
              Top Vehicles
            </span>
          </div>
          <div className="flex flex-col space-y-2 max-h-[200px] overflow-y-auto px-5 py-4 dashboard-scroll">
            {loadingTop ? (
              <span className="text-[#0F2043] text-base">Loading...</span>
            ) : errorTop ? (
              <span className="text-[#0F2043] text-base">{errorTop}</span>
            ) : topVehicles.length > 0 ? (
              topVehicles.map((vehicle, idx) => (
                <div key={vehicle.vehicleId} className="flex flex-row justify-between items-center bg-[#f8fafc] mx-1 rounded px-3 py-2 border border-gray-100">
                  <span className="text-[#0F2043] text-base font-medium">{idx + 1}. {vehicle.vehicleId} {vehicle.brand} {vehicle.model}</span>
                  <span className="text-[#6366f1] text-base">Trips: {vehicle.tripCount}</span>
                </div>
              ))
            ) : (
              <span className="text-[#0F2043] text-base">No data</span>
            )}
          </div>
        </div>
        {/* Pending Trips Section (unchanged) */}
        <div className="bg-white shadow-sm w-full sm:w-1/2 m-2 rounded-lg">
          <div className="flex flex-row justify-between items-center px-5 py-5 border-b border-gray-100 rounded-t-lg">
            <span className="text-center text-xl sm:text-2xl text-[#0F2043] font-semibold">
              Pending Trips
            </span>

            <NavLink
              to="/trips/pending-trips"
              className="text-center flex flex-row items-center gap-2 text-base text-[#0F2043] hover:underline a_custom_s"
            >
              View All{" "}
              <span>
                <FaChevronCircleRight />
              </span>
            </NavLink>
          </div>

          <div className="flex flex-col space-y-2 max-h-[400px] overflow-y-auto px-5 py-4 dashboard-scroll">
            {loadingPendingTrips ? (
              <div className="flex flex-row justify-center items-center bg-[#F0F3F8] mx-5 rounded-xl px-4 py-4">
                <span className="text-[#0F2043] text-base">Loading...</span>
              </div>
            ) : errorPendingTrips ? (
              <div className="flex flex-row justify-center items-center bg-[#F0F3F8] mx-5 rounded-xl px-4 py-4">
                <span className="text-[#0F2043] text-base">
                  {errorPendingTrips}
                </span>
              </div>
            ) : pendingTrips.length > 0 ? (
              pendingTrips.map((trip) => (
                <PendingTripCard
                  key={trip.id}
                  tripData={{
                    startLocation: trip.startLocation,
                    endLocation: trip.endLocation,
                    date: trip.date,
                    suggestStartTime: trip.suggestStartTime,
                    suggestEndTime: trip.suggestEndTime,
                  }}
                />
              ))
            ) : (
              <div className="flex flex-row justify-center items-center bg-[#F0F3F8] mx-5 rounded-xl px-4 py-4">
                <span className="text-[#0F2043] text-base">No pending trips</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
