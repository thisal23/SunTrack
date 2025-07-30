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
import apiService from "../../config/axiosConfig";
import { render } from "react-dom";
import ServiceAddCard from "./ServiceAddCard";
import ServiceDeleteCard from "./ServiceDeleteCard";
import ServiceHistoryCard from "./ServiceHistoryCard";
import AddNewVehicleService from "./AddNewVehicleService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServiceMaintenance = () => {
  const tableRef = useRef(null);
  const modalStateRef = useRef({ isOpen: false });
  const [isModal_add_Open, setIsModal_add_Open] = useState(false);
  const [isModal_delete_Open, setIsModal_delete_Open] = useState(false);
  const [isModal_history_Open, setIsModal_history_Open] = useState(false);
  const [isModal_addNewVehicle_Open, setIsModal_addNewVehicle_Open] = useState(false);
  const [vehicleId, setVehicleId] = useState("");
  const [serviceData, setServiceData] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDataTableDisabled, setIsDataTableDisabled] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  const showModal_add = (id) => {
    // Increment table key to force re-mounting
    setTableKey(prev => prev + 1);
    
    // Disable DataTable completely during modal operations
    setIsDataTableDisabled(true);
    
    // Immediately destroy any existing DataTable to prevent conflicts
    if (tableRef.current && $.fn.DataTable.isDataTable(tableRef.current)) {
      try {
        $(tableRef.current).off("click", ".btn-add");
        $(tableRef.current).off("click", ".btn-delete");
        $(tableRef.current).off("click", ".btn-history");
        $(tableRef.current).DataTable().destroy();
      } catch (error) {
        console.warn("Error destroying DataTable:", error);
      }
    }
    
    // Set updating flag first to prevent DataTable initialization
    setIsUpdating(true);
    modalStateRef.current.isOpen = true;
    
    // Add a small delay to ensure state is updated before modal opens
    setTimeout(() => {
      setIsModal_add_Open(true);
      setVehicleId(id);
    }, 100);
  };

  const showModal_delete = (vehicleId, serviceId) => {
    // Increment table key to force re-mounting
    setTableKey(prev => prev + 1);
    
    // Immediately destroy any existing DataTable to prevent conflicts
    if (tableRef.current && $.fn.DataTable.isDataTable(tableRef.current)) {
      try {
        $(tableRef.current).off("click", ".btn-add");
        $(tableRef.current).off("click", ".btn-delete");
        $(tableRef.current).off("click", ".btn-history");
        $(tableRef.current).DataTable().destroy();
      } catch (error) {
        console.warn("Error destroying DataTable:", error);
      }
    }
    
    setIsUpdating(true);
    modalStateRef.current.isOpen = true;
    setIsModal_delete_Open(true);
    setVehicleId(vehicleId);
    setServiceId(serviceId);
  };

  const showModal_history = (vehicleId, serviceId) => {
    // Increment table key to force re-mounting
    setTableKey(prev => prev + 1);
    
    // Immediately destroy any existing DataTable to prevent conflicts
    if (tableRef.current && $.fn.DataTable.isDataTable(tableRef.current)) {
      try {
        $(tableRef.current).off("click", ".btn-add");
        $(tableRef.current).off("click", ".btn-delete");
        $(tableRef.current).off("click", ".btn-history");
        $(tableRef.current).DataTable().destroy();
      } catch (error) {
        console.warn("Error destroying DataTable:", error);
      }
    }
    
    setIsUpdating(true);
    modalStateRef.current.isOpen = true;
    setIsModal_history_Open(true);
    setVehicleId(vehicleId);
    setServiceId(serviceId);
    // Find the service history for this vehicle
    let found = [];
    for (const [plate, data] of Object.entries(serviceData)) {
      if (data.id === vehicleId) {
        found = data.services;
        break;
      }
    }
    setServiceHistory(found || []);
  };

  const handleCancel_add = () => {
    setIsModal_add_Open(false);
    
    // Add a longer delay before clearing the updating flag to ensure modal is fully closed
    setTimeout(() => {
      setIsUpdating(false);
      modalStateRef.current.isOpen = false;
      setIsDataTableDisabled(false);
      // Refresh data after modal is closed
      fetchServiceDetails();
    }, 300);
  };

  const handleCancel_delete = () => {
    setIsModal_delete_Open(false);
    
    setTimeout(() => {
      setIsUpdating(false);
      modalStateRef.current.isOpen = false;
      fetchServiceDetails();
    }, 300);
  };

  const handleCancel_history = () => {
    setIsModal_history_Open(false);
    
    setTimeout(() => {
      setIsUpdating(false);
      modalStateRef.current.isOpen = false;
    }, 300);
  };

  const showModal_addNewVehicle = () => {
    setIsUpdating(true);
    setIsModal_addNewVehicle_Open(true);
  };

  const handleCancel_addNewVehicle = () => {
    setIsModal_addNewVehicle_Open(false);
    setIsUpdating(false);
    // Refresh data when modal is closed with a longer delay to ensure modal is fully closed
    setTimeout(() => {
      fetchServiceDetails();
    }, 300);
  };

  const handleServiceUpdateSuccess = () => {
    console.log("Service update successful! Refreshing data...");
    // Close the modal first
    setIsModal_addNewVehicle_Open(false);
    setIsUpdating(false);
    // Then refresh data with a delay to ensure modal is fully closed
    setTimeout(() => {
      fetchServiceDetails();
    }, 300);
  };

  const fetchServiceDetails = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.get("service/detailFetch");
      console.log(response);

      const fetchedData = response?.data?.data;

      if (!Array.isArray(fetchedData)) {
        console.error("Expected an array, but got:", fetchedData);
        toast.error("Service data fetching error!");
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
      toast.error("Failed to fetch service data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceDetails();
    
    // Cleanup function for component unmount
    return () => {
      // Destroy DataTable on component unmount
      if (tableRef.current && $.fn.DataTable.isDataTable(tableRef.current)) {
        try {
          $(tableRef.current).off("click", ".btn-add");
          $(tableRef.current).off("click", ".btn-delete");
          $(tableRef.current).off("click", ".btn-history");
          $(tableRef.current).DataTable().destroy();
        } catch (error) {
          console.warn("Error destroying DataTable on unmount:", error);
        }
      }
    };
  }, []);

  useEffect(() => {
    // Cleanup function to properly destroy DataTable
    const destroyDataTable = () => {
      if (tableRef.current && $.fn.DataTable.isDataTable(tableRef.current)) {
        try {
          // Remove all event listeners first
          $(tableRef.current).off("click", ".btn-add");
          $(tableRef.current).off("click", ".btn-delete");
          $(tableRef.current).off("click", ".btn-history");
          
          // Destroy the DataTable
          $(tableRef.current).DataTable().destroy();
        } catch (error) {
          console.warn("Error destroying DataTable:", error);
        }
      }
      
      // Don't manually clear table content - let React handle it via the key prop
    };

    // Add a longer delay to ensure DOM is ready and all React updates are complete
    const timeoutId = setTimeout(() => {
      try {
        // Don't initialize DataTable if modal is open or updating
        if (isModal_add_Open || isModal_delete_Open || isModal_history_Open || isModal_addNewVehicle_Open || isUpdating || modalStateRef.current.isOpen || isDataTableDisabled) {
          console.log("Modal is open or updating, skipping DataTable initialization");
          return;
        }

        // Additional check to ensure we're not in the middle of a React update cycle
        if (document.querySelector('.ant-modal-root') || document.querySelector('.ant-modal-mask')) {
          console.log("Modal elements detected in DOM, skipping DataTable initialization");
          return;
        }

        // Additional safety check - wait a bit more if we're still in a React update cycle
        if (document.querySelector('.ant-modal-root') || document.querySelector('.ant-modal-mask')) {
          console.log("Modal elements still detected, skipping DataTable initialization");
          return;
        }

        // Check if table element exists and is in DOM
        if (!tableRef.current || !document.contains(tableRef.current)) {
          console.warn("Table element not found in DOM");
          return;
        }

        // Destroy existing DataTable first
        destroyDataTable();

        // Double-check that the table element still exists after destruction
        if (!tableRef.current || !document.contains(tableRef.current)) {
          console.warn("Table element not found in DOM after destruction");
          return;
        }

        // Additional safety check - ensure we're not in the middle of a React update
        if (isUpdating) {
          console.log("Still updating, skipping DataTable initialization");
          return;
        }

        const tableData = Object.entries(serviceData).map(
          ([vehicleId, data]) => {
            const services = data.services;
            const vehicleDbId = data.id;
            if (!Array.isArray(services) || services.length === 0) {
              return [
                vehicleId ?? "N/A",
                "<select class='service-dropdown'><option>No service</option></select>",
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
              firstService.remark || "No remark",
              firstService.updatedAt ? new Date(firstService.updatedAt).toLocaleDateString() : "N/A",
              firstService.addedBy || "N/A",
              JSON.stringify({
                ...firstService,
                vehicleId: vehicleDbId, // pass DB id for delete
              }),
            ];
          }
        );

        // Initialize new DataTable
        const dataTable = $(tableRef.current).DataTable({
          data: tableData,
          columns: [
            { title: "Vehicle Number" },
            { title: "Service Type" },
            { title: "Remark" },
            { title: "Date Added" },
            { title: "Added by" },
            {
              title: "Action",
              render: function (data, type, row) {
                const service = JSON.parse(row[5]);
                return `
                <div class="flex items-center justify-center space-x-2">
                                     <button class="btn-add p-2 rounded-lg transition-colors duration-200"
                     data-vehicle-id="${service.vehicleId}" 
                     data-service-id="${service.serviceId}"
                     title="Add New Service">
                     <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"></path>
                     </svg>
                   </button>
                   <button class="btn-delete p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                     data-vehicle-id="${service.vehicleId}" 
                     data-service-id="${service.serviceId}"
                     title="Delete Service">
                     <svg class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                     </svg>
                   </button>
                   <button class="btn-history p-2 rounded-lg transition-colors duration-200"
                     data-vehicle-id="${service.vehicleId}" 
                     data-service-id="${service.serviceId}"
                     title="View History">
                     <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                     </svg>
                   </button>
                </div>
              `;
              },
            },
          ],
          pageLength: 10,
          lengthChange: true,
          responsive: true,
          select: false,
          ordering: true,
          info: true,
          paging: true,
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

                 // Update the dropdown HTML to show the selected service type
                 const vehicleId = $dropdown.data("vehicle");
                 const services = serviceData[vehicleId]?.services || [];
                 
                 const updatedDropdown = `
                   <select class="service-dropdown" data-vehicle="${vehicleId}">
                     ${services
                       .map(
                         (s) =>
                           `<option value='${JSON.stringify(s)}' ${s.serviceType === selected.serviceType ? 'selected' : ''}>${s.serviceType}</option>`
                       )
                       .join("")}
                   </select>
                 `;

                 row.data()[1] = updatedDropdown;
                 row.data()[2] = selected.remark || "No remark";
                 row.data()[3] = selected.updatedAt ? new Date(selected.updatedAt).toLocaleDateString() : "N/A";
                 row.data()[4] = selected.addedBy || "N/A";
                 row.data()[5] = JSON.stringify(selected);

                 row.invalidate().draw(false);
               });
           }
        });

        // Add event listeners after DataTable is initialized
        $(tableRef.current).on("click", ".btn-add", function () {
          const vehicleId = $(this).data("vehicle-id");
          showModal_add(vehicleId);
        });

        $(tableRef.current).on("click", ".btn-delete", function () {
          const serviceId = $(this).data("service-id");
          const vehicleId = $(this).data("vehicle-id");
          showModal_delete(vehicleId, serviceId);
        });

        $(tableRef.current).on("click", ".btn-history", function () {
          const vehicleId = $(this).data("vehicle-id");
          const serviceId = $(this).data("service-id");
          showModal_history(vehicleId, serviceId);
        });

      } catch (error) {
        console.error("Error initializing DataTable:", error);
      }
         }, 200); // 200ms delay to ensure all React updates are complete

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      destroyDataTable();
    };
  }, [serviceData, isModal_add_Open, isModal_delete_Open, isModal_history_Open, isModal_addNewVehicle_Open, isUpdating, isDataTableDisabled]);

  // Calculate statistics
  const totalVehicles = Object.keys(serviceData).length;
  const totalServices = Object.values(serviceData).reduce((total, vehicle) => total + vehicle.services.length, 0);
  const vehiclesWithServices = Object.values(serviceData).filter(vehicle => vehicle.services.length > 0).length;
  const recentServices = Object.values(serviceData).reduce((total, vehicle) => {
    const recent = vehicle.services.filter(service => {
      const serviceDate = new Date(service.updatedAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return serviceDate >= thirtyDaysAgo;
    });
    return total + recent.length;
  }, 0);

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-gray-200 pt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Service Maintenance</h1>
                  <p className="mt-2 text-gray-600">Manage vehicle service records and maintenance schedules</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                  <p className="text-2xl font-bold text-gray-900">{totalVehicles}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Services</p>
                  <p className="text-2xl font-bold text-gray-900">{totalServices}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Vehicles with Services</p>
                  <p className="text-2xl font-bold text-gray-900">{vehiclesWithServices}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recent Services (30d)</p>
                  <p className="text-2xl font-bold text-gray-900">{recentServices}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 font-medium">Loading services...</p>
                  <p className="text-sm text-gray-500">Please wait while we fetch the latest data</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto p-5">
                <div className="service-maintenance-page">
                                     <table ref={tableRef} key={`service-table-${Object.keys(serviceData).length}-${isModal_add_Open}-${isModal_delete_Open}-${isModal_history_Open}-${isModal_addNewVehicle_Open}-${isUpdating}`} className="w-full"></table>
                </div>
              </div>
            )}
          </div>

          {/* Add Service for New Vehicle Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={showModal_addNewVehicle}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
              </svg>
              Add Service for New Vehicle
            </button>
          </div>
        </div>

        {/* Modals */}
        <Modal
          title={
            <div className="flex items-center space-x-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900">Add Vehicle Service</span>
            </div>
          }
          open={isModal_add_Open}
          onCancel={handleCancel_add}
          footer={null}
          width={600}
          centered
          className="service-modal"
        >
          <ServiceAddCard
            key={vehicleId}
            vehicleId={vehicleId}
            handleCancel={handleCancel_add}
            onUpdateSuccess={handleServiceUpdateSuccess}
          />
        </Modal>

        <Modal
          title={
            <div className="flex items-center space-x-2">
              <div className="bg-red-100 p-2 rounded-lg">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900">Delete Vehicle Service</span>
            </div>
          }
          open={isModal_delete_Open}
          onCancel={handleCancel_delete}
          footer={null}
          width={600}
          centered
          className="service-modal"
        >
          <ServiceDeleteCard
            key={vehicleId}
            vehicleId={vehicleId}
            serviceId={serviceId}
            handleCancel={handleCancel_delete}
            onUpdateSuccess={handleServiceUpdateSuccess}
          />
        </Modal>

        <Modal
          title={
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900">Service History</span>
            </div>
          }
          open={isModal_history_Open}
          onCancel={handleCancel_history}
          footer={null}
          width={800}
          centered
          className="service-modal"
        >
          <ServiceHistoryCard
            key={vehicleId}
            vehicleId={vehicleId}
            serviceId={serviceId}
            serviceHistory={serviceHistory}
            handleCancel={handleCancel_history}
          />
        </Modal>

        <Modal
          title={
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900">Add Service for New Vehicle</span>
            </div>
          }
          open={isModal_addNewVehicle_Open}
          onCancel={handleCancel_addNewVehicle}
          footer={null}
          width={600}
          centered
          className="service-modal"
        >
          <AddNewVehicleService
            handleCancel={handleCancel_addNewVehicle}
            onUpdateSuccess={handleServiceUpdateSuccess}
          />
        </Modal>

        {/* Custom CSS for DataTables */}
        <style>{`
          .service-maintenance-page {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .service-maintenance-page .dataTables_wrapper {
            padding: 0;
          }
          
          .service-maintenance-page .dataTable {
            border-collapse: separate;
            border-spacing: 0;
            width: 100%;
            background: white;
          }
          
          .service-maintenance-page .dataTable thead th {
            background: #f8fafc;
            color: #374151 !important;
            font-weight: 600;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 1rem;
            border-bottom: 2px solid #e5e7eb;
            text-align: left;
            position: relative;
          }
          
          .service-maintenance-page .dataTable tbody td {
            padding: 1rem;
            border-bottom: 1px solid #f3f4f6;
            color: #374151;
            font-size: 0.875rem;
            vertical-align: middle;
          }
          
          .service-maintenance-page .dataTable tbody tr:hover {
            background-color: #f9fafb;
            transition: background-color 0.2s ease;
          }
          
          .service-maintenance-page .dataTable tbody tr:nth-child(even) {
            background-color: #fafafa;
          }
          
          .service-maintenance-page .dataTable tbody tr:nth-child(even):hover {
            background-color: #f3f4f6;
          }
          
          .service-maintenance-page .service-dropdown {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            background: white;
            font-size: 0.875rem;
            color: #374151;
            transition: border-color 0.2s ease;
          }
          
          .service-maintenance-page .service-dropdown:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          .service-maintenance-page .dataTables_length select,
          .service-maintenance-page .dataTables_filter input {
            padding: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            font-size: 0.875rem;
          }
          
          .service-maintenance-page .dataTables_filter input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          .service-maintenance-page .dataTables_info {
            padding: 1rem;
            color: #6b7280;
            font-size: 0.875rem;
          }
          
          .service-maintenance-page .dataTables_paginate {
            padding: 1rem;
          }
          
          .service-maintenance-page .dataTables_paginate .paginate_button {
            padding: 0.5rem 1rem;
            margin: 0 0.25rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            color: #374151;
            background: white;
            transition: all 0.2s ease;
          }
          
          .service-maintenance-page .dataTables_paginate .paginate_button:hover {
            background: #f3f4f6;
            border-color: #9ca3af;
          }
          
                     .service-maintenance-page .dataTables_paginate .paginate_button.current {
             background: #3b82f6;
             color: white;
             border-color: #3b82f6;
           }
           
                       /* Fix DataTables 1.13+ pagination layout */
            .service-maintenance-page .dt-layout-row {
              display: flex !important;
              flex-direction: row !important;
              align-items: center !important;
              justify-content: space-between !important;
              width: 100% !important;
              gap: 1rem !important;
            }
            
            .service-maintenance-page .dt-layout-cell {
              display: flex !important;
              align-items: center !important;
            }
            
            .service-maintenance-page .dt-layout-start {
              justify-content: flex-start !important;
            }
            
            .service-maintenance-page .dt-layout-end {
              justify-content: flex-end !important;
            }
            
            .service-maintenance-page .dt-paging {
              display: flex !important;
              align-items: center !important;
              gap: 0.25rem !important;
            }
            
            .service-maintenance-page .dt-paging nav {
              display: flex !important;
              align-items: center !important;
              gap: 0.25rem !important;
            }
            
            .service-maintenance-page .dt-paging-button {
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              padding: 0.5rem 1rem !important;
              margin: 0 0.125rem !important;
              border: 1px solid #d1d5db !important;
              border-radius: 0.375rem !important;
              color: #374151 !important;
              background: white !important;
              transition: all 0.2s ease !important;
              text-decoration: none !important;
              font-size: 0.875rem !important;
              line-height: 1.25rem !important;
              min-width: 2.5rem !important;
              cursor: pointer !important;
            }
            
            .service-maintenance-page .dt-paging-button:hover {
              background: #f3f4f6 !important;
              border-color: #9ca3af !important;
              color: #374151 !important;
            }
            
            .service-maintenance-page .dt-paging-button.current {
              background: #3b82f6 !important;
              color: white !important;
              border-color: #3b82f6 !important;
            }
            
            .service-maintenance-page .dt-paging-button.disabled {
              opacity: 0.5 !important;
              cursor: not-allowed !important;
              background: #f9fafb !important;
              color: #9ca3af !important;
            }
            
            /* Additional fixes for DataTables 1.13+ */
            .service-maintenance-page .dataTables_wrapper .dt-layout-row {
              display: flex !important;
              flex-direction: row !important;
              align-items: center !important;
              justify-content: space-between !important;
              width: 100% !important;
              margin-top: 1rem !important;
            }
            
            .service-maintenance-page .dataTables_wrapper .dt-layout-cell {
              display: flex !important;
              align-items: center !important;
            }
            
            .service-maintenance-page .dataTables_wrapper .dt-layout-start {
              justify-content: flex-start !important;
            }
            
                       .service-maintenance-page .dataTables_wrapper .dt-layout-end {
             justify-content: flex-end !important;
           }
           
                       /* Button styling - ensure no background colors for Add and History buttons */
            .service-maintenance-page .btn-add {
              background: transparent !important;
              border: none !important;
            }
            
            .service-maintenance-page .btn-add:hover {
              background: transparent !important;
            }
            
            .service-maintenance-page .btn-add svg {
              color: #10b981 !important;
              fill: none !important;
            }
            
            .service-maintenance-page .btn-add svg path {
              stroke: #10b981 !important;
            }
            
            .service-maintenance-page .btn-history {
              background: transparent !important;
              border: none !important;
            }
            
            .service-maintenance-page .btn-history:hover {
              background: transparent !important;
            }
            
            .service-maintenance-page .btn-history svg {
              color: #6366f1 !important;
              fill: none !important;
            }
            
            .service-maintenance-page .btn-history svg path {
              stroke: #6366f1 !important;
            }
            
            .service-maintenance-page .btn-delete {
              background: transparent !important;
              border: none !important;
            }
            
            .service-maintenance-page .btn-delete:hover {
              background: #fef2f2 !important;
            }
            
            .service-maintenance-page .btn-delete svg {
              color: #f43f5e !important;
              fill: none !important;
            }
            
            .service-maintenance-page .btn-delete svg path {
              stroke: #f43f5e !important;
            }
          
          .service-modal .ant-modal-content {
            border-radius: 1rem;
            overflow: hidden;
          }
          
          .service-modal .ant-modal-header {
            background: #f8fafc;
            border-bottom: 1px solid #e5e7eb;
            padding: 1.5rem;
          }
          
          .service-modal .ant-modal-title {
            font-weight: 600;
            color: #111827;
          }
          
          .service-modal .ant-modal-body {
            padding: 1.5rem;
          }
          
          .service-modal .ant-modal-footer {
            border-top: 1px solid #e5e7eb;
            padding: 1rem 1.5rem;
          }
        `}</style>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ServiceMaintenance;
