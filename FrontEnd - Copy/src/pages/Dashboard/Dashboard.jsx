import React from "react";
import PendingTripCard from "../../pages/Trip/PendingTripCard";
import DriverUpdateCard from "../../pages/Driver/DriverUpdateCard";
import InfoCard from "./InfoCard";
import { FaChevronCircleRight } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";

// Sachini part
const Dashboard = () => {
  return (
    <div>
      <NavBar />
      <div className="container-fluid mt-5 mx-auto flex flex-row justify-center gap-4 p-4">
        <InfoCard />
        <InfoCard />
        <InfoCard />
      </div>

      <div className="container-fluid mx-auto flex flex-col sm:flex-row justify-between w-full p-2">
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
              className="text-center flex flex-row items-center gap-2 text-md text-[#0F2043] hover:underline"
            >
              View All{" "}
              <span>
                <FaChevronCircleRight />
              </span>
            </NavLink>
          </div>

          <div className="flex flex-col space-y-2 max-h-[400px] overflow-y-auto px-2 py-2">
            <PendingTripCard />
            <PendingTripCard />
            <PendingTripCard />
            <PendingTripCard />
            <PendingTripCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
