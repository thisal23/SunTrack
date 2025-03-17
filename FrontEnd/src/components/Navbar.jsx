import React, { useState } from "react";
import { Link } from "react-router";

// Sachini part
const Navbar = () => {
  const [dropMenuOpen_1, setDropMenuOpen_1] = useState(false);
  const [dropMenuOpen_2, setDropMenuOpen_2] = useState(false);

  const handleHover_1 = () => {
    setDropMenuOpen_1(() => !dropMenuOpen_1);
    console.log("hover");
  };

  const handleHover_2 = () => {
    setDropMenuOpen_2(() => !dropMenuOpen_2);
    console.log("hover");
  };

  return (
    <div className="flex flex-row justify-between items-center bg-[#0F2043] w-full h-[8vh] px-10">
      <div className="w-full">
        <Link to="/" className="text-white text-3xl font-bold">
          SunTrack
        </Link>
      </div>

      <div className="w-full flex flex-row justify-end gap-4">
        <Link to="/" className="text-white hover:underline" end>
          Dashboard
        </Link>

        <Link to="/vehicle/info" className="text-white hover:underline" end>
          Vehicle Info
        </Link>

        <Link to="#" className="text-white hover:underline" end>
          Tracking
        </Link>

        <Link to="#" className="text-white hover:underline" end>
          Reports
        </Link>

        {/* <Link to="#" className="text-white hover:underline" end>
          Maintenance
        </Link> */}

        <div
          className="text-white  hover:underline"
          onMouseEnter={handleHover_1}
          onMouseLeave={handleHover_1}
        >
          Maintenance
          {/* Dropdown menu */}
          <div
            className={`${
              dropMenuOpen_1
                ? "dropdown_menu_show h-auto w-auto px-0 py-2 space-y-2 right-10 z-[99] bg-[#c9c9c9]"
                : "dropdown_menu_hide"
            }`}
          >
            <Link
              to="/maintenance/document-maintenance"
              className="text-black hover:underline pr-10 pl-2 py-2 bg-[#e8e8e8] text-left"
              endcd
            >
              Document Maintenance
            </Link>

            <Link
              to="/maintenance/service-maintenance"
              className="text-black hover:underline pr-10 pl-2 py-2 bg-[#e8e8e8] text-left"
              end
            >
              Service Maintenance
            </Link>
          </div>
        </div>

        <div
          className="text-white  hover:underline"
          onMouseEnter={handleHover_2}
          onMouseLeave={handleHover_2}
        >
          Manage
          {/* Dropdown menu */}
          <div
            className={`${
              dropMenuOpen_2
                ? "dropdown_menu_show h-auto w-auto px-0 py-2 space-y-2 right-10 z-[98] bg-[#c9c9c9]"
                : "dropdown_menu_hide"
            }`}
          >
            <Link
              to="/vehicle/info"
              className="text-black hover:underline pr-10 pl-2 py-2 bg-[#e8e8e8] text-left"
              end
            >
              Add New Driver
            </Link>

            <Link
              to="/vehicle/info"
              className="text-black hover:underline pr-10 pl-2 py-2 bg-[#e8e8e8] text-left"
              end
            >
              View All Drivers
            </Link>

            <Link
              to="/vehicle/add-new"
              className="text-black hover:underline pr-10 pl-2 py-2 bg-[#e8e8e8] text-left"
              end
            >
              Add New Vehicle
            </Link>

            <Link
              to="/vehicle/all"
              className="text-black hover:underline pr-10 pl-2 py-2 bg-[#e8e8e8] text-left"
              end
            >
              View All Vehicles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
