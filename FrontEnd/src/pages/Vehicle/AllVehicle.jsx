import React, { useEffect, useRef, useState } from "react";
import DataTable from "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "datatables.net-select-dt/css/select.dataTables.min.css";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import "datatables.net-select-dt";
import { Modal } from "antd";
import apiService from "../../config/axiosConfig";
import { toast } from "react-toastify";
import { config } from "../../config/config";
import NavBar from "../../components/NavBar/NavBar";
import VehicleInfoCard from "./VehicleInfoCard";
import VehicleEditCard from "./VehicleEditCard";
import VehicleDeleteCard from "./VehicleDeleteCard";
import { none } from "ol/centerconstraint";

const AllVehicle = () => {
  const tableRef = useRef(null);
  const [isModal_1_Open, setIsModal_1_Open] = useState(false);
  const [isModal_2_Open, setIsModal_2_Open] = useState(false);
  const [isModal_3_Open, setIsModal_3_Open] = useState(false);
  const [vehicleData, setVehicleData] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [plateNo, setPlateNo] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);
  const [modalMessage, setModalMessage] = useState("");

  const showModal_1 = (id) => {
    setIsModal_1_Open(true);
    setVehicleId(id);
    fetchVehicleDetails(id);
  };

  const showModal_2 = (id) => {
    setIsModal_2_Open(true);
    setVehicleId(id);
  };

  const showModal_3 = (plateNo) => {
    setIsModal_3_Open(true);
    setPlateNo(plateNo);
  };

  const handleCancel_1 = () => {
    setIsModal_1_Open(false);
  };

  const handleCancel_2 = () => {
    setIsModal_2_Open(false);
  };

  const handleCancel_3 = () => {
    setIsModal_3_Open(false);
  };

  const fetchVehicles = async () => {
    try {
      const data = await apiService
        .get("vehicle/all")
        .catch((err) => console.log(`api error`, err));

      if (data.status !== 200) {
        toast.error("Vehicle data fetching error!!!");
      }

      console.log(data);

      setVehicleData(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // This handles success after vehicle edit: refresh table & info card, close edit modal
  const handleUpdateSuccess = async () => {
    await fetchVehicles();
    setRefreshCount((prev) => prev + 1); // trigger remount of VehicleInfoCard
    handleCancel_2(); // close edit modal
  };

  const handleDelete = async () => {
    try {
      const response = await apiService.delete(`vehicle/remove/${plateNo}`);

      if (response.status === 200) {
        setModalMessage("✅ Vehicle deleted successfully!");
        await fetchVehicles(); // refresh the table

        // Auto-close the modal after 2 seconds
        setTimeout(() => {
          setIsModal_3_Open(false);
          setModalMessage(""); // reset message
        }, 2000);
      } else {
        setModalMessage("❌ Failed to delete vehicle. Try again.");
        setTimeout(() => {
          setIsModal_3_Open(false);
          setModalMessage(""); // reset message
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setModalMessage("❌ An error occurred during deletion.");
      setTimeout(() => {
        setIsModal_3_Open(false);
        setModalMessage(""); // reset message
      }, 2000);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    $(tableRef.current).DataTable({
      data: vehicleData?.map((item) => [
        item.plateNo,
        `${item.vehicleBrand.brand}-${item.vehicleModel.model}`,
        `${item.vehicleType}-${item.category}`,
        `<a href="${config.fileUrl}${
          item.VehicleDetail?.licenseDocument || ""
        }" target="_blank" class="text-blue-500 underline">View Document</a>`,
        `<a href="${config.fileUrl}${
          item.VehicleDetail?.insuranceDocument || ""
        }" target="_blank" class="text-blue-500 underline">View Document</a>`,
        `<a href="${config.fileUrl}${
          item.VehicleDetail?.ecoDocument || ""
        }" target="_blank" class="text-blue-500 underline">View Document</a>`,
        `${item.VehicleDetail?.licenseId || ""}`,
        `${item.vehicleTitle}`,
        item.id,
      ]),

      columns: [
        { title: "Vehicle No" },
        { title: "Brand-Model" },
        { title: "Type-Categoty" },
        { title: "License Document" },
        { title: "Insurance Document" },
        { title: "ECO Document" },
        { title: "id", visible: false },
        {
          title: "Action",
          data: null,
          render: function (data, type, row) {
            console.log(row);
            return `
            <div style="display: flex; gap: 6px;">
                <button class="btn-view" data-id="${row[8]}" style="background:none;border:none;cursor:pointer;color:#007bff;" title="View">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5c-7 0-9 7-9 7s2 7 9 7 9-7 9-7-2-7-9-7zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z"/></svg>
                </button>
                <button class="btn-edit" data-id="${row[8]}" style="background:none;border:none;cursor:pointer;color:#28a745;" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm17.71-10.04a1.003 1.003 0 000-1.42l-2.5-2.5a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                </button>
                <button class="btn-delete" data-plateno="${row[0]}" style="background:none;border:none;cursor:pointer;color:#dc3545;" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M3 6h18v2H3V6zm2 3h14l-1.5 12.5a2 2 0 01-2 1.5H8.5a2 2 0 01-2-1.5L5 9zm5 2v7h2v-7h-2zm4 0v7h2v-7h-2zm-8 0v7h2v-7H6z"/></svg>
                </button>
              </div>
            `;
          },
        },
      ],
    });
    $(tableRef.current).on("click", ".btn-view", function () {
      showModal_1($(this).data("id"));
    });

    $(tableRef.current).on("click", ".btn-edit", function () {
      showModal_2($(this).data("id"));
    });

    $(tableRef.current).on("click", ".btn-delete", function () {
      showModal_3($(this).data("plateno"));
    });

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
    };
  }, [vehicleData]);
  console.log("Modal vehicleId:", vehicleId);
  console.log("PlateNo for delete:", plateNo);

  return (
    <>
      <NavBar />
      <div className="_custom mx-auto w-full py-15">
        <div className="flex flex-row justify-start my-5">
          <span className="text-3xl text-[#0F2043] font-semibold">
            Vehicle &gt; All Vehicles
          </span>
        </div>
        <div className="border-b-1 border-[#000] w-full mb-5"></div>
        <div className="text-black flex flex-row w-full mx-auto custom_table">
          <table
            ref={tableRef}
            className="display"
            style={{ width: "100%" }}
          ></table>
        </div>
      </div>

      <Modal open={isModal_1_Open} onCancel={handleCancel_1} footer={null}>
        <VehicleInfoCard
          key={`${vehicleId}-${refreshCount}`}
          vehicleId={vehicleId}
        />
      </Modal>

      <Modal open={isModal_2_Open} onCancel={handleCancel_2} footer={null}>
        <VehicleEditCard
          vehicleId={vehicleId}
          onClose={handleCancel_2}
          onSuccess={handleUpdateSuccess}
        />
      </Modal>

      <Modal
        open={isModal_3_Open}
        onCancel={handleCancel_3}
        onOk={!modalMessage ? handleDelete : null} // disable OK button when message is shown
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ disabled: !!modalMessage }} // disable delete button when showing result
      >
        <VehicleDeleteCard plateNo={plateNo} message={modalMessage} />
      </Modal>
    </>
  );
};

export default AllVehicle;
