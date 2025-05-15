import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "datatables.net-select-dt/css/select.dataTables.min.css";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import "datatables.net-select-dt";
import { Modal } from "antd";
import Maintenance from "./Maintenance";
import NavBar from "../../components/NavBar/NavBar";
import "datatables.net-rowgroup";
import "datatables.net-rowgroup-dt/css/rowGroup.dataTables.min.css";

const DocumentMaintenance = () => {
  const tableRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleId, setVehicleId] = useState("");

  const showModal = (id) => {
    setIsModalOpen(true);
    setVehicleId(id);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const data = [
    [
      1,
      "ABC - 4578",
      "License",
      "13/02/2020",
      null,
      "View Document",
      "Edit / Remove",
    ],
    [
      1,
      "ABC - 4578",
      "Insurance",
      null,
      null,
      "View Document",
      "Edit / Remove",
    ],
    [1, "ABC - 4578", "Emission", null, null, "View Document", "Edit / Remove"],
    [2, "AJD - 9632", "Lisence", null, null, "View Document", "Edit / Remove"],
    [
      2,
      "AJD - 9632",
      "Insurance",
      null,
      null,
      "View Document",
      "Edit / Remove",
    ],
    [2, "AJD - 9632", "Emission", null, null, "View Document", "Edit / Remove"],
    [3, "MNS - 7865", "Lisence", null, null, "View Document", "Edit / Remove"],
    [
      3,
      "MNS - 7865",
      "Insurance",
      null,
      null,
      "View Document",
      "Edit / Remove",
    ],
    [3, "MNS - 7865", "Emission", null, null, "View Document", "Edit / Remove"],
  ];

  useEffect(() => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    $(tableRef.current).DataTable({
      data: data,
      // rowGroup: ["title:ID"],
      columns: [
        { title: "ID", data: 0 },
        { title: "Vehicle No", data: 1 },
        { title: "Document Type", data: 2 },
        { title: "Last Update Date", data: 3 },
        { title: "Next Update Date", data: 4 },
        { title: "Document", data: 5 },
        { title: "Action", data: 6 },
      ],
      rowGroup: {
        dataSrc: [1], // Group by Vehicle No
      },
      columnDefs: [
        {
          target: 0,
          visible: false,
        },
        {
          target: 1,
          visible: false,
        },
        {
          targets: [5], // Document
          render: function (data, type, row) {
            return `<button class="cursor-pointer px-2 py-1 rounded text-xs bg-blue-500 hover:bg-blue-700 text-white">${data}</button>`;
          },
        },
        {
          targets: [6], // Action
          render: function (data, type, row) {
            return `<div class="flex space-x-2">
                      <button class="cursor-pointer px-2 py-1 rounded text-xs bg-gray-300 hover:bg-gray-400 text-gray-700">${data
                        .split("/")[0]
                        .trim()}</button>
                      <button class="cursor-pointer px-2 py-1 rounded text-xs bg-red-500 hover:bg-red-700 text-white">${data
                        .split("/")[1]
                        .trim()}</button>
                    </div>`;
          },
        },
      ],
      pageLength: 10,
      // searching: false, // Hide the default search bar
      // info: false, // Hide the "Showing X to Y of Z entries" information
      // lengthChange: false, // Hide the page length dropdown
      // // Remove sorting if the image doesn't imply it
      // // ordering: false,
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
      <div className="container_custom mx-auto w-full mt-20 text-black">
        <div className="flex flex-row justify-between items-center my-5">
          <span className="text-xl text-[#0F2043] font-semibold">
            Maintenance &gt; Document Maintenance
          </span>
          {/* <div className="flex items-center space-x-4">
            <div>
              <input
                type="text"
                placeholder="Search"
                className="border border-gray-300 rounded py-1 px-2 text-sm focus:outline-none"
              />
            </div>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm">
              Add New
            </button>
          </div> */}
        </div>

        <div className="border-b-1 border-gray-300 w-full mb-5"></div>
        <div>
          <table ref={tableRef} className="display w-full text-sm"></table>

          <Modal
            title="Update Document Services"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null} // Remove default footer buttons
          >
            <Maintenance vehicleId={vehicleId} handleCancel={handleCancel} />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default DocumentMaintenance;

// import React, { useEffect, useRef, useState } from "react";
// import { createRoot } from "react-dom/client";
// import "datatables.net-dt/css/dataTables.dataTables.min.css";
// import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
// import "datatables.net-select-dt/css/select.dataTables.min.css";
// import $ from "jquery";
// import "datatables.net-dt";
// import "datatables.net-responsive-dt";
// import "datatables.net-select-dt";
// import { NavLink } from "react-router-dom";
// import { Modal } from "antd";
// import Maintenance from "./Maintenance";
// import NavBar from "../../components/NavBar/NavBar";
// import "datatables.net-rowgroup";
// import "datatables.net-rowgroup-dt/css/rowGroup.dataTables.min.css";

// const DocumentMaintenance = () => {
//   const tableRef = useRef(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [vehicelId, setVehicleId] = useState("");

//   const showModal = (id) => {
//     setIsModalOpen(true);

//     setVehicleId(id);
//   };

//   const handleOk = () => {
//     setIsModalOpen(false);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   const data = [
//     [
//       1,
//       "ABC-4567",
//       "License",
//       "13/02/2023",
//       "13/03/2026",
//       "View Document",
//       "Edit/Remove",
//     ],
//     [
//       1,
//       "ABC-4567",
//       "Insurance",
//       "13/02/2023",
//       "13/03/2026",
//       "View Document",
//       "Edit/Remove",
//     ],
//     [
//       1,
//       "ABC-4567",
//       "Emission",
//       "13/02/2023",
//       "13/03/2026",
//       "View Document",
//       "Edit/Remove",
//     ],
//     [
//       2,
//       "GHE-4567",
//       "License",
//       "13/02/2023",
//       "13/03/2026",
//       "View Document",
//       "Edit/Remove",
//     ],
//     [
//       2,
//       "GHE-4567",
//       "Insurance",
//       "13/02/2023",
//       "13/03/2026",
//       "View Document",
//       "Edit/Remove",
//     ],
//     [
//       2,
//       "GHE-4567",
//       "Emmision",
//       "13/02/2023",
//       "13/03/2026",
//       "View Document",
//       "Edit/Remove",
//     ],
//   ];

//   useEffect(() => {
//     if ($.fn.DataTable.isDataTable(tableRef.current)) {
//       $(tableRef.current).DataTable().destroy();
//     }

//     $(tableRef.current).DataTable({
//       data: data,
//       columns: [
//         { title: "ID", data: 0 },
//         { title: "Vehicle No", data: 1 },
//         { title: "Document Type", data: 2 },
//         { title: "Last Update Date", data: 3 },
//         { title: "Next Update Date", data: 4 },
//         { title: "Document", data: 5 },
//         {
//           title: "Action",
//           data: null,
//           render: function (data, type, row) {
//             return `<div class="flex flex-row justify-center"><button type="button" class="assign_data cursor-pointer px-3 py-1 rounded-full text-xs bg-green-600 hover:bg-green-800 text-white" data-id="${row[0]}">
//             Update
//             </button></div>`;
//           },
//         },
//       ],
//       rowGroup: {
//         dataSrc: [1],
//       },
//       columnDefs: [
//         {
//           targets: [0], // ID column
//           visible: true, // Keep ID visible if needed for other logic
//         },
//         {
//           targets: [5], // Document
//           render: function (data, type, row) {
//             return `<button class="cursor-pointer px-2 py-1 rounded text-xs bg-blue-500 hover:bg-blue-700 text-white">${data}</button>`;
//           },
//         },
//         {
//           targets: [6], // Action
//           render: function (data, type, row) {
//             return `<div class="flex space-x-2">
//                       <button class="cursor-pointer px-2 py-1 rounded text-xs bg-gray-300 hover:bg-gray-400 text-gray-700">${data
//                         .split("/")[0]
//                         .trim()}</button>
//                       <button class="cursor-pointer px-2 py-1 rounded text-xs bg-red-500 hover:bg-red-700 text-white">${data
//                         .split("/")[1]
//                         .trim()}</button>
//                     </div>`;
//           },
//         },
//       ],
//       pageLength: 10,

//     return () => {
//       if ($.fn.DataTable.isDataTable(tableRef.current)) {
//         $(tableRef.current).DataTable().destroy();
//       }
//     };
//   }, [data]);

//   return (
//     <>
//       <NavBar />
//       <div className="container_custom mx-auto w-full">
//         <div className="flex flex-row justify-start my-5">
//           <span className="text-3xl text-[#0F2043] font-semibold">
//             Maintenance &gt; Document Maintenance
//           </span>
//         </div>

//         <div className="border-b-1 border-[#000] w-full mb-5"></div>
//         <div>
//           <table
//             ref={tableRef}
//             className="display justify-center"
//             style={{ width: "100%" }}
//           ></table>

//           <Modal
//             title="Update Document Services"
//             open={isModalOpen}
//             onCancel={handleCancel}
//             cancelButtonProps={{ style: { display: "none" } }}
//             okButtonProps={{ style: { display: "none" } }}
//           >
//             <Maintenance />
//           </Modal>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DocumentMaintenance;
