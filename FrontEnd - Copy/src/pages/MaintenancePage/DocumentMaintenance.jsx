import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "datatables.net-select-dt/css/select.dataTables.min.css";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import "datatables.net-select-dt";
import { NavLink } from "react-router-dom";
import { Modal } from "antd";
import Maintenance from "./Maintenance";
import NavBar from "../../components/NavBar/NavBar";

const DocumentMaintenance = () => {
  const tableRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicelId, setVehicleId] = useState("");

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
      "ABC-4567",
      "License",
      "13/02/2023",
      "13/03/2026",
      "View Document",
      <button></button>,
    ],
    [
      2,
      "ABC-4567",
      "Insurance",
      "13/02/2023",
      "13/03/2026",
      "View Document",
      "Edit/Remove",
    ],
    [
      3,
      "ABC-4567",
      "Emission",
      "13/02/2023",
      "13/03/2026",
      "View Document",
      "Edit/Remove",
    ],
    [
      4,
      "GHE-4567",
      "License",
      "13/02/2023",
      "13/03/2026",
      "View Document",
      "Edit/Remove",
    ],
    [
      5,
      "GHE-4567",
      "Insurance",
      "13/02/2023",
      "13/03/2026",
      "View Document",
      "Edit/Remove",
    ],
    [
      6,
      "GHE-4567",
      "Emmision",
      "13/02/2023",
      "13/03/2026",
      "View Document",
      "Edit/Remove",
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
        { title: "Vehicle No", data: 1 },
        { title: "Document Type", data: 2 },
        { title: "Last Update Date", data: 3 },
        { title: "Next Update Date", data: 4 },
        { title: "Document", data: 5 },
        {
          title: "Action",
          data: null,
          render: function (data, type, row) {
            return `<div class="flex flex-row justify-center"><button type="button" class="assign_data cursor-pointer px-3 py-1 rounded-full text-xs bg-green-600 hover:bg-green-800 text-white" data-id="${row[0]}">
            Update
            </button></div>`;
          },
        },
      ],
      createdRow: function (row, data, dataIndex) {
        if (data[4] === "Pending") {
          $(row).css("background-color", "#fff3cd"); // Yellow
        } else if (data[4] === "Ready") {
          $(row).css("background-color", "#ffad5f"); // Green
        } else if (data[4] === "Approved") {
          $(row).css("background-color", "#d4edda"); // Green
        } else if (data[4] === "Rejected") {
          $(row).css("background-color", "#f8d7da"); // Red
        }
      },
    });

    $(tableRef.current).on("click", ".btn-view", function () {});

    $(tableRef.current).on("click", ".btn-edit", function () {});

    $(tableRef.current).on("click", ".btn-delete", function () {
      if (window.confirm("Are you sure you want to delete this Document?")) {
      }
    });

    $(tableRef.current).on("click", ".assign_data", function () {
      showModal($(this).data("id"));
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
            Maintenance &gt; Document Maintenance
          </span>
        </div>

        <div className="border-b-1 border-[#000] w-full mb-5"></div>
        <div>
          <table
            ref={tableRef}
            className="display justify-center"
            style={{ width: "100%" }}
          ></table>

          <Modal
            title="Update Document Services"
            open={isModalOpen}
            onCancel={handleCancel}
            cancelButtonProps={{ style: { display: "none" } }}
            okButtonProps={{ style: { display: "none" } }}
          >
            <Maintenance />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default DocumentMaintenance;
