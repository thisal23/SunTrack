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
import NavBar from "../../components/NavBar/NavBar";
//import "datatables.net-rowgroup";
//import "datatables.net-rowgroup-dt/css/rowGroup.dataTables.min.css";
import apiService from "../../config/axiosConfig";
import { render } from "react-dom";
import ServiceAddCard from "./ServiceAddCard";
import ServiceDeleteCard from "./ServiceDeleteCard";
import ServiceHistoryCard from "./ServiceHistoryCard";

const ServiceMaintenance = () => {
  const tableRef = useRef(null);
  const [isModal_add_Open, setIsModal_add_Open] = useState(false);
  const [isModal_delete_Open, setIsModal_delete_Open] = useState(false);
  const [isModal_history_Open, setIsModal_history_Open] = useState(false);
  const [vehicleId, setVehicleId] = useState("");
  const [serviceData, setServiceData] = useState([]);
  const [availableServiceTypes, setAvailableServiceTypes] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);

  const showModal_add = (id) => {
    setIsModal_add_Open(true);
    setVehicleId(id);
  };

  const showModal_delete = (id) => {
    setIsModal_delete_Open(true);
    setVehicleId(id);
    // Find the available unique service types for this vehicle
    let found = null;
    for (const [plate, data] of Object.entries(serviceData)) {
      if (data.id === id) {
        const seen = new Set();
        found = data.services
          .filter(s => {
            if (seen.has(s.serviceType)) return false;
            seen.add(s.serviceType);
            return true;
          })
          .map(s => ({ serviceType: s.serviceType }));
        break;
      }
    }
    setAvailableServiceTypes(found || []);
  };

  const showModal_history = (id) => {
    setIsModal_history_Open(true);
    setVehicleId(id);
    // Find the service history for this vehicle
    let found = [];
    for (const [plate, data] of Object.entries(serviceData)) {
      if (data.id === id) {
        found = data.services;
        break;
      }
    }
    setServiceHistory(found || []);
  };

  const handleCancel_add = () => {
    setIsModal_add_Open(false);
  };

  const handleCancel_delete = () => {
    setIsModal_delete_Open(false);
  };

  const handleCancel_history = () => {
    setIsModal_history_Open(false);
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
        const vehicleId = entry.vehicle.plateNo;
        const vehicleDbId = entry.vehicle.id;

        if (!grouped[vehicleId]) {
          grouped[vehicleId] = { id: vehicleDbId, services: [] };
        }

        grouped[vehicleId].services.push({
          serviceType: entry.service.serviceType,
          remark: entry.serviceRemark,
          updatedAt: entry.updatedAt,
          addedBy: entry.user.firstName + " " + entry.user.lastName,
          serviceId: entry.service.id,
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
      ([vehicleId, data]) => {
        const services = data.services;
        const vehicleDbId = data.id;
        if (!Array.isArray(services) || services.length === 0) {
          return [
            vehicleId ?? "N/A",
            "<select><option>No service</option></select>",
            "-",
            "-",
            "-",
            JSON.stringify({ vehicleId: vehicleDbId }),
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
            vehicleId: vehicleDbId, // pass DB id for delete
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
              <button class="btn-add" data-vehicle-id="${service.vehicleId}" data-service-id="${service.serviceId}"
                      style="background:none;border:none;cursor:pointer;color:#28a745;" title="Add New">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="btn-delete" data-vehicle-id="${service.vehicleId}" data-service-id="${service.serviceId}"
                      style="background:none;border:none;cursor:pointer;color:#dc3545;" title="Delete">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6m-6 0V4a2 2 0 012-2h0a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="btn-history" data-vehicle-id="${service.vehicleId}" data-service-id="${service.serviceId}"
                      style="background:none;border:none;cursor:pointer;color:#b9ba1e;" title="View History">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
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

    table.on("click", ".btn-add", function () {
      const vehicleId = $(this).data("vehicle-id");
      showModal_add(vehicleId);
    });

    table.on("click", ".btn-delete", function () {
      const serviceId = $(this).data("service-id");
      const vehicleId = $(this).data("vehicle-id");
      showModal_delete(vehicleId, serviceId);
    });

    table.on("click", ".btn-history", function () {
      const vehicleId = $(this).data("vehicle-id");
      showModal_history(vehicleId);
    });

    return () => {
      table.off("click", ".btn-add");
      table.off("click", ".btn-delete");
      table.off("click", ".btn-history");
    };
  }, []);

  return (
    <>
      <NavBar />
      <div className="container_custom mx-auto w-full mt-20 text-black">
        <div className="flex flex-row justify-between items-center my-5">
          <span className="text-3xl text-[#0F2043] font-semibold">
            Maintenance &gt; Service Maintenance
          </span>
        </div>

        <div className="border-b-1 border-gray-300 w-full mb-5"></div>
        <div>
          <table ref={tableRef} className="display w-full text-sm"></table>

          <Modal
            title="Add vehicle Service"
            open={isModal_add_Open}
            onCancel={handleCancel_add}
            footer={null} // Remove default footer buttons
          >
            <ServiceAddCard
              key={vehicleId}
              vehicleId={vehicleId}
              handleCancel={handleCancel_add}
            />
          </Modal>

          <Modal
            title="Delete Vehicle Service"
            open={isModal_delete_Open}
            onCancel={handleCancel_delete}
            footer={null} // Remove default footer buttons
          >
            <ServiceDeleteCard
              key={vehicleId}
              vehicleId={vehicleId}
              availableServiceTypes={availableServiceTypes}
              handleCancel={handleCancel_delete}
            />
          </Modal>

          <Modal
            title="View Service History"
            open={isModal_history_Open}
            onCancel={handleCancel_history}
            footer={null} // Remove default footer buttons
          >
            <ServiceHistoryCard
              key={vehicleId}
              vehicleId={vehicleId}
              serviceHistory={serviceHistory}
              handleCancel={handleCancel_history}
            />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ServiceMaintenance;
