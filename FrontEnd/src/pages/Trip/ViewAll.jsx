import React, { useEffect, useRef, useState } from "react";
import DataTable from "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "datatables.net-select-dt/css/select.dataTables.min.css";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import "datatables.net-select-dt";
import { RiEBikeLine } from "react-icons/ri";
import { IoCarOutline } from "react-icons/io5";
import { createRoot } from "react-dom/client";
import { Modal } from "antd";
import AssignCard from "./AssignCard";
import PendingTripEditCard from "./PendingTripEditCard";
import PendingTripDeleteCard from "./PendingTripDeleteCard";
import apiService from "../../config/axiosConfig";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar/NavBar";
import { formatTimeToHoursMinutes } from "../../utils/timeFormatter";

const ViewAll = () => {
  const tableRef = useRef(null);


  const [isModal_assignOpen, setIsModal_assignOpen] = useState(false);
  const [isModal_editOpen, setIsModal_editOpen] = useState(false);
  const [isModal_deleteOpen, setIsModal_deleteOpen] = useState(false);

  const [tripData, setTripData] = useState([]);
  const [tripId, setTripId] = useState("");

  const showModal_assign = (id) => {
    setIsModal_assignOpen(true);
    setTripId(id);
  };

  const showModal_edit = (id) => {
    setIsModal_editOpen(true);
    setTripId(id);
  };

  const showModal_delete = (id) => {
    setIsModal_deleteOpen(true);
    setTripId(id);
  };

  const handleTripUpdateSuccess = () => {
    console.log("Trip Data update successful! Refreshing data...");
    fetchTrips(); // Call the fetch function to get the latest data
  };

  const handleCancel_edit = () => {
    setIsModal_editOpen(false);
  };

  const handleCancel_delete = () => {
    setIsModal_deleteOpen(false);
  };

  const handlecancel_assign = () => {
    setIsModal_assignOpen(false);
  };

  const fetchTrips = async () => {
    try {
      const response = await apiService.get("trip/all");

      if (response.status !== 200) {
        toast.error("Trip data fetching error!!!");
        return;
      }

      // Sort by custom status order
      const statusOrder = {
        pending: 1,
        ready: 2,
        approved: 2,
        live: 2,
        finished: 3,
        rejected: 3,
      };

      const sortedTrips = response.data.data.sort((a, b) => {
        const statusA = statusOrder[(a.status || "").toLowerCase()] || 999;
        const statusB = statusOrder[(b.status || "").toLowerCase()] || 999;
        return statusA - statusB;
      });

      setTripData(sortedTrips);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    $(tableRef.current).DataTable({
      data: tripData?.map((item) => [
        item.id,
        `<a href="https://www.google.com/maps/dir/${
          (item.startLocation ?? "").split(",")[0]
        },${(item.startLocation ?? "").split(",")[1]}/${
          (item.endLocation ?? "").split(",")[0]
        },${
          (item.endLocation ?? "").split(",")[1]
        }/" target="_blank" class="text-blue-500 underline">
    View Trip Route</a>`,
        item.date,
        `${formatTimeToHoursMinutes(item.suggestStartTime) ?? "N/A"}`,
        item.status,
        item.driverName ?? "Not Assigned",
        item.vehicleId ?? "Not Assigned",
        item.tripRemark ?? "-",
      ]),
      order: [],
      columns: [
        { title: "ID" },
        { title: "Trip Location" },
        { title: "Date" },
        { title: "Suggested Start" },
        { title: "Status" },
        { title: "Driver" },
        { title: "Vehicle" },
        { title: "Trip Remark" },
        {
          title: "Ass: Driver/Ass:Vehicle",
          data: null,
          render: function (data, type, row) {
            const tripStatus = row[4]; // Index of 'status' column
            const disabled =
              tripStatus !== "pending"
                ? 'disabled style="background:gray;cursor:not-allowed;"'
                : 'class="assign_data cursor-pointer px-3 py-1 rounded-full text-xs bg-green-600 hover:bg-green-800 text-white"';

            return `<div class="flex flex-row justify-center">
      <button type="button" data-id="${row[0]}" ${disabled}>
        Assign Driver/Vehicle
      </button>
    </div>`;
          },
        },

        {
          title: "Action",
          data: null,
          render: function (data, type, row) {
            return `
              <button class="btn-edit" data-id="${row[0]}" style="background:#28a745;color:white;padding:5px 10px;border:none;margin-right:5px;cursor:pointer;">Edit</button>
              <button class="btn-delete" data-id="${row[0]}" style="background:#dc3545;color:white;padding:5px 10px;border:none;cursor:pointer;">Delete</button>
            `;
          },
        },
      ],
      createdRow: function (row, data, dataIndex) {
        if (data[4].toLowerCase() === "pending") {
          $(row).css("background-color", "#eceb8dff"); // Yellow
        } else if (data[4].toLowerCase() === "ready") {
          $(row).css("background-color", "#ffad5f"); // Orange
        } else if (data[4].toLowerCase() === "live") {
          $(row).css("background-color", "#d4edda"); // Green
        } else if (data[4].toLowerCase() === "finished") {
          $(row).css("background-color", "#f8d7da"); // Red
        }
      },
    });

    $(tableRef.current).on("click", ".btn-edit", function () {
      showModal_edit($(this).data("id"));
    });

    $(tableRef.current).on("click", ".btn-delete", function () {
      showModal_delete($(this).data("id"));
    });

    $(tableRef.current).on("click", ".assign_data", function () {
      showModal_assign($(this).data("id"));
    });

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
    };
  }, [tripData]);

  return (
    <>
      <NavBar />
      <div className="min-h-screen container_custom mx-auto bg-white w-full pt-15 px-4 py-6">
        <div className="flex flex-row justify-start my-5">
          <span className="text-3xl text-[#0F2043] font-semibold">
            Trip &gt; View All Trip
          </span>
        </div>
        <div className="border-b-1 border-[#000] w-full mb-5"></div>
        <div className="text-black flex flex-row w-full mx-auto custom_table">
          <table
            ref={tableRef}
            className="display"
            style={{ width: "100%" }}
          ></table>

          <Modal
            title="Assign Driver/Vehicle"
            open={isModal_assignOpen}
            onCancel={handlecancel_assign}
            cancelButtonProps={{ style: { display: "none" } }}
            okButtonProps={{ style: { display: "none" } }}
          >
            <AssignCard tripId={tripId} />
          </Modal>

          <Modal
            title="Edit Trip"
            open={isModal_editOpen}
            onCancel={handleCancel_edit}
            cancelButtonProps={{ style: { display: "none" } }}
            okButtonProps={{ style: { display: "none" } }}
          >
            <PendingTripEditCard
              tripId={tripId}
              handleCancel={handleCancel_edit}
              onUpdateSuccess={handleTripUpdateSuccess}
            />
          </Modal>

          <Modal
            title="Delete Trip"
            open={isModal_deleteOpen}
            onCancel={handleCancel_delete}
            cancelButtonProps={{ style: { display: "none" } }}
            okButtonProps={{ style: { display: "none" } }}
          >
            <PendingTripDeleteCard
              tripId={tripId}
              handleCancel={handleCancel_delete}
              onUpdateSuccess={handleTripUpdateSuccess}
            />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ViewAll;
