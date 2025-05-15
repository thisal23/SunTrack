import React, { useState, useEffect } from "react";
import PendingTripCard from "../../pages/Trip/PendingTripCard";
import DriverUpdateCard from "../../pages/Driver/DriverUpdateCard";
import InfoCard from "./InfoCard";
import { FaChevronCircleRight } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import apiService from "../../config/axiosConfig";

// Sachini part
const Dashboard = () => {
  const [fetchTripCount, setFetchTripCount] = useState({
    pending: 0,
    live: 0,
    finished: 0,
  });

  const [pendingTrips, setPendingTrips] = useState([]);
  const [loadingPendingTrips, setLoadingPendingTrips] = useState(true);
  const [errorPendingTrips, setErrorPendingTrips] = useState("");

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

  useEffect(() => {
    fetchTripCounts();
    fetchPendingTrips();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="container_custom mt-5 mx-auto flex flex-row justify-center gap-4 pt-20 pb-19 items-start h-auto">
        <InfoCard
          CardName="Vehicles"
          count_name_1="Total"
          count_name_2="Available"
          count_name_3="Out of Service"
          count_1="100"
          count_2="20"
          count_3="13"
        />
        <InfoCard
          CardName="Drivers"
          count_name_1="Total"
          count_name_2="Available"
          count_name_3="Out of Service"
          count_1="100"
          count_2="20"
          count_3="13"
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

      <div className="container_custom mx-auto flex flex-col sm:flex-row justify-between w-full">
        <div className="bg-[#878FA1] w-full sm:w-1/2 m-2 rounded-lg overflow-hidden h-auto">
          <div className="px-4 py-3 bg-[#878FA1] sticky top-0 z-10">
            <span className="text-left text-2xl sm:text-3xl text-[#0F2043] font-semibold block">
              Driver Updates
            </span>
          </div>

          {/* Scrollable List */}
          <div className="flex flex-col space-y-2 max-h-[400px] overflow-y-auto px-2 py-2">
            <DriverUpdateCard
              driverName={"Sugath Amarasiri"}
              destination={"Arrived to the destination - Colombo fort"}
              time={"02.29 pm"}
            />
            <DriverUpdateCard
              driverName={"Amal Perera"}
              destination={"Vehicle breakdown - Ja Ela"}
              time={"02.15 pm"}
            />
            <DriverUpdateCard
              driverName={"Shehan Mihiranga"}
              destination={"Started the return trip"}
              time={"02.08 pm"}
            />
            <DriverUpdateCard
              driverName={"Nimal Siripala"}
              destination={"Arrived to the destination -  Polonnaruwa"}
              time={"01.45 pm"}
            />
            <DriverUpdateCard
              driverName={"Sugath Amarasiri"}
              destination={"Arrived to the destination - Colombo fort"}
              time={"02.29 pm"}
            />
            <DriverUpdateCard
              driverName={"Amal Perera"}
              destination={"Vehicle breakdown - Ja Ela"}
              time={"02.15 pm"}
            />
          </div>
        </div>

        <div className="bg-[#878FA1] w-full sm:w-1/2 m-2 rounded-lg">
          <div className="flex flex-row justify-between items-center px-4 py-4">
            <span className="text-center text-2xl sm:text-3xl text-[#0F2043] font-semibold">
              Pending Trips
            </span>

            <NavLink
              to="/trips/pending-trips"
              className="text-center flex flex-row items-center gap-2 text-md text-[#0F2043] hover:underline a_custom_s"
            >
              View All{" "}
              <span>
                <FaChevronCircleRight />
              </span>
            </NavLink>
          </div>

          <div className="flex flex-col space-y-2 max-h-[400px] overflow-y-auto px-2 py-2">
            {loadingPendingTrips ? (
              <div className="flex flex-row justify-center items-center bg-[#F0F3F8] mx-5 rounded-xl px-4 py-4">
                <span className="text-[#0F2043] text-lg">Loading...</span>
              </div>
            ) : errorPendingTrips ? (
              <div className="flex flex-row justify-center items-center bg-[#F0F3F8] mx-5 rounded-xl px-4 py-4">
                <span className="text-[#0F2043] text-lg">
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
                <span className="text-[#0F2043] text-lg">No pending trips</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
