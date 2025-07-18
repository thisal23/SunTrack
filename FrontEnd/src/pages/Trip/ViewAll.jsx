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
import apiService from "../../config/axiosConfig";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar/NavBar";

// Sachini part
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

  const handleOk_assign = () => {
    setIsModal_assignOpen(false);
  };

  const handleOk_edit = () => {
    setIsModal_editOpen(false);
  };

  const handleOk_delete = () => {
    setIsModal_deleteOpen(false);
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
      const data = await apiService
        .get("trip/all")
        .catch((err) => console.log(`api error`, err));

      if (data.status !== 200) {
        toast.error("Trip data fetching error!!!");
      }

      console.log(data);

      setTripData(data.data.data);
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
        item.Trip.id,
        `<a href="https://www.google.com/maps/dir/${
          item.Trip.startLocation.split(",")[0]
        },${item.Trip.startLocation.split(",")[1]}/${
          item.Trip.endLocation.split(",")[0]
        },${
          item.Trip.endLocation.split(",")[1]
        }/" target="_blank" class="text-blue-500 underline">
    View Trip Route</a>`,
        item.Trip.date,
        `${item.Trip.suggestStartTime} | ${item.Trip.suggestEndTime}`,
        item.Trip.status,
        item.tripRemark,
      ]),
      columns: [
        { title: "ID" },
        { title: "Trip Location" },
        { title: "Date" },
        { title: "Suggest Start/End Time" },
        { title: "Status" },
        { title: "Trip Remark" },
        {
          title: "Ass: Driver/Ass:Vehicle",
          data: null,
          render: function (data, type, row) {
            return `<div class="flex flex-row justify-center"><button type="button" class="assign_data cursor-pointer px-3 py-1 rounded-full text-xs bg-green-600 hover:bg-green-800 text-white" data-id="${row[0]}">
            Assign Driver/Vehicle
            </button></div>`;
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

    $(tableRef.current).on("click", ".btn-edit", function () {
      showModal_edit($(this).data("id"));
    });

    $(tableRef.current).on("click", ".btn-delete", function () {
      if (window.confirm("Are you sure you want to delete this trip?")) {
      }
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
      <div className="container_custom mx-auto w-full pt-15">
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
            {" "}
            <PendingTripEditCard tripId={tripId} />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ViewAll;
