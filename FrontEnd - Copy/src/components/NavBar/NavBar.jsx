import React, { useState } from "react";
import MenuLink from "../MenuLink/MenuLink";
import "./NavBar.css";
import { useNavigate, NavLink } from "react-router-dom";

function NavBar() {
  const [menuBtn, setMenuBtn] = useState(false);
  const [closeBtn, setCloseBtn] = useState(true);
  const navigate = useNavigate();

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

  function handleMenu() {
    setMenuBtn(true);
    setCloseBtn(false);
  }

  function handleClose() {
    setCloseBtn(true);
    setMenuBtn(false);
  }
  const handleLogOut = () => {
    navigate("/");
  };

  return (
    <>
      <div className="wrap">
        <div className="nav w-full">
          <div className={`list ${menuBtn ? "active" : ""}`}>
            <div className="logo">
              <h2>SunTrack</h2>
            </div>

            <div className="w-full flex flex-row justify-end gap-4">
              <NavLink
                to="/dashboard"
                className="text-white hover:underline"
                end
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/vehicle/info"
                className="text-white hover:underline"
                end
              >
                Vehicle Info
              </NavLink>

              <MenuLink className="menuLink" url="/tracking" name="Tracking" />
              <MenuLink className="menuLink" url="/reports" name="Reports" />

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
                  <NavLink
                    to="/maintenance/document-maintenance"
                    className="text-black hover:underline pr-10 pl-2 py-2 bg-[#e8e8e8] text-left"
                    endcd
                  >
                    Document Maintenance
                  </NavLink>

                  <NavLink
                    to="/maintenance/service-maintenance"
                    className="text-black hover:underline pr-10 pl-2 py-2 bg-[#e8e8e8] text-left"
                    end
                  >
                    Service Maintenance
                  </NavLink>
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
                  <NavLink
                    to="/vehicle/info"
                    className="text-black hover:underline pr-10 pl-2 py-2 bg-[#e8e8e8] text-left"
                    end
                  >
                    Add New Driver
                  </NavLink>

                  <NavLink
                    to="/vehicle/info"
                    className="text-black hover:underline pr-10 pl-2 py-2 bg-[#e8e8e8] text-left"
                    end
                  >
                    View All Drivers
                  </NavLink>

                  <NavLink
                    to="/vehicle/add-new"
                    className="text-black hover:underline pr-10 pl-2 py-2 bg-[#e8e8e8] text-left"
                    end
                  >
                    Add New Vehicle
                  </NavLink>

                  <NavLink
                    to="/vehicle/all"
                    className="text-black hover:underline pr-10 pl-2 py-2 bg-[#e8e8e8] text-left"
                    end
                  >
                    View All Vehicles
                  </NavLink>
                </div>
              </div>
            </div>
            {/*end of the links div*/}

            <div className="logOut">
              <button
                type="submit"
                className="logout-btn"
                onClick={handleLogOut}
              >
                <img className="logout" src="logout-svgrepo-com.svg" alt="" />
              </button>
            </div>
          </div>
          {/* End of isactive div */}

          <div className="menuOrClose">
            <button
              onClick={handleMenu}
              title="Open Menu"
              style={{ display: menuBtn ? "none" : "block" }} // Show only when menu is closed
            >
              <svg
                width="34px"
                height="34px"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#0F2043"
                  fillRule="evenodd"
                  d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
                />
              </svg>
            </button>

            <button
              onClick={handleClose}
              title="Close Menu"
              style={{ display: closeBtn ? "none" : "block" }} // Show only when menu is open
            >
              <svg
                fill="#0F2043"
                height="34px"
                width="34px"
                viewBox="0 0 490 490"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337 " />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
