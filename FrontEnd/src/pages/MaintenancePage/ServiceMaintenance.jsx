import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "datatables.net-select-dt/css/select.dataTables.min.css";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import "datatables.net-select-dt";
import { Modal } from "antd";
import { config } from "../../config/config";
import Maintenance from "./Maintenance";
import NavBar from "../../components/NavBar/NavBar";
import "datatables.net-rowgroup";
import "datatables.net-rowgroup-dt/css/rowGroup.dataTables.min.css";
import apiService from "../../config/axiosConfig";
import { render } from "react-dom";
import ServiceEditCard from "./ServiceEditCard";

const ServiceMaintenance = () => {
  const tableRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleId, setVehicleId] = useState("");
  const [serviceData, setServiceData] = useState([]);

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

  const fetchServiceDetails = async () => {
    try {
      const response = await apiService.get("service/detailFetch");
      console.log(response);

      const fetchedData = response?.data?.data;

      if (!Array.isArray(fetchedData)) {
        console.error("Expected an array, but got:", fetchedData);
        return;
      }

      const grouped = {};

      fetchedData.forEach((entry) => {
        const vehicleId = entry.Vehicle.id;

        if (!grouped[vehicleId]) {
          grouped[vehicleId] = [];
        }

        grouped[vehicleId].push({
          serviceType: entry.Service.serviceType,
          remark: entry.serviceRemark,
          updatedAt: entry.updatedAt,
          addedBy: entry.User.firstName,
          serviceId: entry.Service.id,
        });
      });

      setServiceData(grouped);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchServiceDetails();
  }, []);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    const tableData = Object.entries(serviceData).map(
      ([vehicleId, services]) => {
        if (!Array.isArray(services) || services.length === 0) {
          return [
            vehicleId ?? "N/A",
            "<select><option>No service</option></select>",
            "-",
            "-",
            "-",
            "{}",
          ];
        }

        const firstService = services[0] ?? {};

        const dropdown = `
      <select class="service-dropdown" data-vehicle="${vehicleId}">
        ${services
          .map(
            (s) =>
              `<option value='${JSON.stringify(s)}'>${s.serviceType}</option>`
          )
          .join("")}
      </select>
    `;

        return [
          vehicleId ?? "N/A",
          dropdown,
          firstService.remark,
          firstService.updatedAt,
          firstService.addedBy,
          JSON.stringify({
            ...firstService,
            vehicleId: vehicleId, // needed for action buttons!
          }),
        ];
      }
    );

    $(tableRef.current).DataTable({
      data: tableData,
      columns: [
        { title: "Vehicle Number" }, // 0
        { title: "Service Type" }, // 1 (Dropdown)
        { title: "Remark" }, // 2
        { title: "Date Added" }, // 3
        { title: "Added by" }, // 4
        {
          title: "Action",
          render: function (data, type, row) {
            const service = JSON.parse(row[5]);
            return `
            <div style="display: flex; gap: 6px;">
              <button class="btn-edit" data-vehicle-id="${service.vehicleId}" data-service-id="${service.serviceId}"
                      style="background:#28a745;color:white;padding:5px 10px;border:none;cursor:pointer;">
                Edit
              </button>
              <button class="btn-delete" data-vehicle-id="${service.vehicleId}" data-service-id="${service.serviceId}"
                      style="background:#dc3545;color:white;padding:5px 10px;border:none;cursor:pointer;">
                Delete
              </button>
            </div>
          `;
          },
        },
      ],
      drawCallback: function () {
        const table = $(tableRef.current).DataTable();

        $(".service-dropdown")
          .off("change")
          .on("change", function () {
            const selected = JSON.parse($(this).val());

            // Use the dropdown element to find the correct row
            const $dropdown = $(this);
            const rowNode = $dropdown.closest("tr");
            const row = table.row(rowNode);

            // Ensure row is valid
            if (!row) return;

            row.data()[2] = selected.remark;
            row.data()[3] = selected.updatedAt;
            row.data()[4] = selected.addedBy;
            row.data()[5] = JSON.stringify(selected);

            row.invalidate().draw(false);
          });
      },
      paging: true,
    });

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
    };
  }, [serviceData]);

  useEffect(() => {
    const table = $(tableRef.current);

    table.on("click", ".btn-edit", function () {
      const vehicleId = $(this).data("vehicle-id");
      setVehicleId(vehicleId);
      setIsModalOpen(true);
    });

    table.on("click", ".btn-delete", function () {
      const serviceId = $(this).data("service-id");
      // TODO: Implement your delete modal or logic here
      console.log("Delete Service ID:", serviceId);
    });

    return () => {
      table.off("click", ".btn-edit");
      table.off("click", ".btn-delete");
    };
  }, []);

  return (
    <>
      <NavBar />
      <div className="container_custom mx-auto w-full mt-20 text-black">
        <div className="flex flex-row justify-between items-center my-5">
          <span className="text-xl text-[#0F2043] font-semibold">
            Maintenance &gt; Service Maintenance
          </span>
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
            <ServiceEditCard
              vehicleId={vehicleId}
              handleCancel={handleCancel}
            />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ServiceMaintenance;
