import React, { useEffect, useRef } from "react";
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

// Sachini part
const Info = () => {
  const tableRef = useRef(null);
  const roots = new Map();

  const data = [
    [
      1,
      "East",
      "WPBEV-4963",
      "Wattala Yard",
      "PVD-Piliyandala",
      "2025-10-10 21:51:01",
      "Idle",
      "100mph",
      "Ignition On",
    ],
    [
      2,
      "South",
      "WPBEV-4963",
      "Wattala Yard",
      "PVD-Piliyandala",
      "2025-10-10 21:51:01",
      "Idle",
      "100mph",
      "Ignition On",
    ],
    [
      3,
      "North",
      "WPBEV-4963",
      "Wattala Yard",
      "PVD-Piliyandala",
      "2025-10-10 21:51:01",
      "Idle",
      "100mph",
      "Ignition On",
    ],
    [
      4,
      "West",
      "WPBEV-4963",
      "Wattala Yard",
      "PVD-Piliyandala",
      "2025-10-10 21:51:01",
      "Idle",
      "100mph",
      "Ignition On",
    ],
  ];

  useEffect(() => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    $(tableRef.current).DataTable({
      data: data,
      columns: [
        { title: "ID", data: 0 },
        {
          title: "Direction",
          data: null,
          render: function (data, type, row, meta) {
            return `<span class="assign_data" id="icon-${meta.row}" data-type="${row[1]}"></span>`;
          },
        },
        { title: "Lcn: Plate No", data: 2 },
        { title: "Last Location", data: 3 },
        { title: "Trip Location", data: 4 },
        { title: "Date/Time", data: 5 },
        {
          title: "Vehicle Status",
          data: 6,
        },
        {
          title: "Speed",
          data: 7,
        },
        {
          title: "Ignition Status",
          data: 8,
        },
      ],
      createdRow: function (row, data, dataIndex) {
        setTimeout(() => {
          const iconContainer = document.getElementById(`icon-${dataIndex}`);

          if (!iconContainer) return;

          let root;
          if (roots.has(iconContainer)) {
            root = roots.get(iconContainer);
          } else {
            root = createRoot(iconContainer);
            roots.set(iconContainer, root);
          }

          let iconElement = null;

          switch (iconContainer.getAttribute("data-type")) {
            case "North":
              iconElement = (
                <LuMoveUp className="border-2 border-red-400 rounded-sm p-1 text-3xl text-red-400" />
              );
              break;
            case "East":
              iconElement = (
                <LuMoveRight className="border-2 border-red-400 rounded-sm p-1 text-3xl text-red-400" />
              );
              break;
            case "South":
              iconElement = (
                <LuMoveDown className="border-2 border-yellow-400 rounded-sm p-1 text-3xl text-black" />
              );
              break;
            case "West":
              iconElement = (
                <LuMoveLeft className="border-2 border-yellow-400 rounded-sm p-1 text-3xl text-black" />
              );
              break;
            default:
              iconElement = null;
          }

          if (iconElement) {
            root.render(iconElement);
          }
        }, 0);
      },
    });

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
    };
  }, [data]);

  return (
    <>
      <NavBar />
      <div className="container mx-auto w-full">
        <div className="flex flex-row justify-start my-5">
          <span className="text-3xl text-[#0F2043] font-semibold">
            Info Page
          </span>
        </div>
        <div className="border-b-1 border-[#000] w-full mb-5"></div>
        <div className="flex flex-row w-full mx-auto custom_table justify-center">
          <table
            ref={tableRef}
            className="display justify-center"
            style={{ width: "100%" }}
          ></table>
        </div>
      </div>
    </>
  );
};

export default Info;
