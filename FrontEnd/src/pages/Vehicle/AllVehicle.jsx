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

// Sachini part
const AllVehicle = () => {
  const tableRef = useRef(null);

  const [isModal_1_Open, setIsModal_1_Open] = useState(false);
  const [isModal_2_Open, setIsModal_2_Open] = useState(false);
  const [isModal_3_Open, setIsModal_3_Open] = useState(false);
  const [vehicleData, setVehicleData] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [licenseId, setLicenseId] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  const showModal_1 = (id) => {
    setIsModal_1_Open(true);
    setVehicleId(id);
    fetchVehicleDetails(id);
  };

  const showModal_2 = (id) => {
    setIsModal_2_Open(true);
    setVehicleId(id);
  };

  const showModal_3 = (id, name) => {
    setIsModal_3_Open(true);
    setVehicleId(id);
    setVehicleName(name);
    // setLicenseId(license);
    // setVehicleModel(model);
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

  const handleDelete = async (e) => {
    try {
      const delete_response = await apiService.delete("vehicle/remove/:${id}");
      if (res.status === 200) {
        toast.success("Vehicle deleted successfully");
        fetchVehicles(); //refresh the table
        setIsModal_3_Open(false);
      } else {
        toast.error("Failed to delete vehicle");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occured during deletion");
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
            <button class="btn-view" data-id="${
              row[8]
            }" style="background:#007bff;color:white;padding:5px 10px;border:none;margin-right:5px;cursor:pointer;">View</button>

              <button class="btn-edit" data-id="${
                row[8]
              }" style="background:#28a745;color:white;padding:5px 10px;border:none;margin-right:5px;cursor:pointer;">Edit</button>
              
              <button class="btn-delete" data-id="${row[8]}" data-dt="${
              row[1].split("/")[0]
            }" data-license="${row[6]}" data-model="${row[7]}" 
            }" style="background:#dc3545;color:white;padding:5px 10px;border:none;cursor:pointer;">Delete</button></div>
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
      const id = $(this).data("id");
      const name = $(this).data("dt");
      const license = $(this).data("license");
      const model = $(this).data("model");

      setVehicleId(id);
      setVehicleName(name);
      setLicenseId(license);
      setVehicleModel(model);

      setIsModal_3_Open(true);
    });

    // $(tableRef.current).on("click", ".assign_data", function () {
    //   showModal($(this).data("id"));
    // });

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
    };
  }, [vehicleData]);
  console.log("Modal vehicleId:", vehicleId);

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

      <Modal open={isModal_2_Open} onCancel={handleCancel_2}>
        <VehicleEditCard
          vehicleId={vehicleId}
          onClose={handleCancel_2}
          onSuccess={handleUpdateSuccess}
        />
      </Modal>

      <Modal
        open={isModal_3_Open}
        onCancel={handleCancel_3}
        onOk={handleDelete}
        okText="Delete"
        cancelText="Cancel"
      >
        <VehicleDeleteCard
          title={vehicleName}
          licenseId={licenseId}
          vehicleModel={vehicleModel}
        />
      </Modal>
    </>
  );
};

export default AllVehicle;
