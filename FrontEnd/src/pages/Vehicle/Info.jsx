import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "datatables.net-select-dt/css/select.dataTables.min.css";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import "datatables.net-select-dt";
import { createRoot } from "react-dom/client";
import { LuMoveDown, LuMoveLeft, LuMoveRight, LuMoveUp } from "react-icons/lu";
import NavBar from "../../components/NavBar/NavBar";
import apiService from "../../config/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatTimeToHoursMinutes } from "../../utils/timeFormatter";

const Info = () => {
  const tableRef = useRef(null);
  const roots = new Map();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchVehicleInfo = async () => {
    try {
      setLoading(true); // Set loading to true when fetching starts
      const data = await apiService
        .get("vehicleInfo/all")
        .catch((err) => console.log(`api error`, err));

      if (data?.status !== 200) {
        toast.error("Vehicle Info fetching error!!!");
        setLoading(false);
        return;
      }

      console.log(data);
      setData(data.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false when fetching ends
    }
  };

  useEffect(() => {
    fetchVehicleInfo();
  }, []);

  useEffect(() => {
    // Only initialize DataTable if we have data
    if (!data || data.length === 0) return;

    // Destroy existing DataTable if it exists
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    // Prepare data in the correct format
    const tableData = data?.map((item, index) => ({
      id: index + 1,
      direction: item?.gpsDevice?.gpsData?.direction || "N/A",
      plateNo: item?.plateNo || "N/A",
      lastLocation: item?.lastLocation || "N/A",
      tripLocation: item?.tripLocation || "N/A",
      lastUpdate: `${item?.gpsDevice?.gpsData?.recDate || "N/A"} | ${
        formatTimeToHoursMinutes(item?.gpsDevice?.gpsData?.recTime) || "N/A"
      }`,
      acc: item?.gpsDevice?.gpsData?.acc || "N/A",
      speed: item?.gpsDevice?.gpsData?.speed || "N/A",
      door: item?.gpsDevice?.gpsData?.door || "N/A",
    }));

    $(tableRef.current).DataTable({
      data: tableData,
      columns: [
        {
          title: "ID",
          data: "id",
          defaultContent: "N/A",
        },
        {
          title: "Direction",
          data: "direction",
          defaultContent: "-",
          render: function (data, type, row, meta) {
            return `<span class="assign_data" id="icon-${meta.row}" data-type="${data}"></span>`;
          },
        },
        {
          title: "Lcn: Plate No",
          data: "plateNo",
          defaultContent: "N/A",
        },
        {
          title: "Last Location",
          data: "lastLocation",
          defaultContent: "N/A",
        },
        {
          title: "Trip Location",
          data: "tripLocation",
          defaultContent: "N/A",
        },
        {
          title: "Last Updated Date|Time",
          data: "lastUpdate",
          defaultContent: "-",
        },
        {
          title: "Vehicle Status",
          data: "acc",
          defaultContent: "-",
        },
        {
          title: "Speed",
          data: "speed",
          defaultContent: "-",
        },
        {
          title: "Ignition Status",
          data: "door",
          defaultContent: "-",
        },
      ],
      createdRow: function (row, data, dataIndex) {
        requestAnimationFrame(() => {
          const iconContainer = document.getElementById(`icon-${dataIndex}`);
          if (!iconContainer) return;

          let root = roots.get(iconContainer) || createRoot(iconContainer);
          roots.set(iconContainer, root);

          const directionStr = iconContainer.getAttribute("data-type");
          const direction = parseFloat(directionStr);
          let iconElement = null;

          const boxStyle =
            "w-8 h-8 !w-8 !h-8 border-2 rounded-md flex items-center justify-center";

          const arrowStyle = "text-xl"; // reduce size to prevent overflow

          if (!isNaN(direction)) {
            if (direction >= 337.6 || direction <= 22.5) {
              iconElement = (
                <div className={`${boxStyle} border-blue-500`}>
                  <LuMoveUp
                    className={`${arrowStyle} rotate-0 text-blue-500`}
                  />
                </div>
              );
            } else if (direction >= 22.6 && direction <= 67.5) {
              iconElement = (
                <div className={`${boxStyle} border-blue-500`}>
                  <LuMoveUp
                    className={`${arrowStyle} rotate-45 text-blue-500`}
                  />
                </div>
              );
            } else if (direction >= 67.6 && direction <= 112.5) {
              iconElement = (
                <div className={`${boxStyle} border-green-500`}>
                  <LuMoveRight
                    className={`${arrowStyle} rotate-0 text-green-500`}
                  />
                </div>
              );
            } else if (direction >= 112.6 && direction <= 157.5) {
              iconElement = (
                <div className={`${boxStyle} border-yellow-500`}>
                  <LuMoveDown
                    className={`${arrowStyle} rotate-45 text-yellow-500`}
                  />
                </div>
              );
            } else if (direction >= 157.6 && direction <= 202.5) {
              iconElement = (
                <div className={`${boxStyle} border-yellow-500`}>
                  <LuMoveDown
                    className={`${arrowStyle} rotate-0 text-yellow-500`}
                  />
                </div>
              );
            } else if (direction >= 202.6 && direction <= 247.5) {
              iconElement = (
                <div className={`${boxStyle} border-yellow-500`}>
                  <LuMoveDown
                    className={`${arrowStyle} -rotate-45 text-yellow-500`}
                  />
                </div>
              );
            } else if (direction >= 247.6 && direction <= 292.5) {
              iconElement = (
                <div className={`${boxStyle} border-red-500`}>
                  <LuMoveLeft
                    className={`${arrowStyle} rotate-0 text-red-500`}
                  />
                </div>
              );
            } else if (direction >= 292.6 && direction <= 337.5) {
              iconElement = (
                <div className={`${boxStyle} border-red-500`}>
                  <LuMoveUp
                    className={`${arrowStyle} -rotate-45 text-red-500`}
                  />
                </div>
              );
            }
          } else {
            iconElement = <span>N/A</span>;
          }

          if (iconElement) root.render(iconElement);
        });
      },
      // Add error handling
      drawCallback: function (settings) {
        console.log("DataTable drawn successfully");
      },
    });

    // Cleanup function
    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
      // Clean up React roots
      roots.forEach((root) => {
        try {
          root.unmount();
        } catch (error) {
          console.warn("Error unmounting root:", error);
        }
      });
      roots.clear();
    };
  }, [data]);

  return (
    <>
      <NavBar />
      <div className="min-h-screen container_custom mx-auto w-full pt-15">
        <div className="flex flex-row justify-start my-5">
          <span className="text-3xl text-[#0F2043] font-semibold">
            Info Page
          </span>
        </div>
        <div className="border-b-1 border-[#000] w-full mb-5"></div>
        <div className="text-black flex flex-row w-full mx-auto custom_table justify-center">
          {loading ? (
            <div className="text-center w-full py-10 text-lg font-semibold text-blue-600">Info is loading...</div>
          ) : (
            <table
              ref={tableRef}
              className="display justify-center"
              style={{ width: "100%" }}
            ></table>
          )}
        </div>
      </div>
    </>
  );
};

export default Info;
