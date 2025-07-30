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
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-gray-200 pt-15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
                  <p className="mt-2 text-gray-600">View and manage all vehicles in your fleet</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                  <p className="text-2xl font-bold text-gray-900">{vehicleData?.length || 0}</p>
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
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vehicleData?.filter(v => v.status === 'available')?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Out of Service</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vehicleData?.filter(v => v.status === 'outOfService')?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div> */}

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-5">
            
            
            <div className="overflow-x-auto">
              <div className="text-black flex flex-row w-full mx-auto custom_table">
                <table
                  ref={tableRef}
                  className="display w-full pt-5"
                  style={{ width: "100%" }}
                ></table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal 
        open={isModal_1_Open} 
        onCancel={handleCancel_1} 
        footer={null}
        width={800}
        centered
        className="vehicle-modal"
      >
        <VehicleInfoCard
          key={`${vehicleId}-${refreshCount}`}
          vehicleId={vehicleId}
        />
      </Modal>

      <Modal 
        open={isModal_2_Open} 
        onCancel={handleCancel_2} 
        footer={null}
        width={900}
        centered
        className="vehicle-modal"
      >
        <VehicleEditCard
          vehicleId={vehicleId}
          onClose={handleCancel_2}
          onSuccess={handleUpdateSuccess}
        />
      </Modal>

      <Modal
        open={isModal_3_Open}
        onCancel={handleCancel_3}
        onOk={!modalMessage ? handleDelete : null}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ 
          disabled: !!modalMessage,
          className: "bg-red-600 hover:bg-red-700 border-red-600"
        }}
        centered
        className="vehicle-modal"
      >
        <VehicleDeleteCard plateNo={plateNo} message={modalMessage} />
      </Modal>

      {/* Custom CSS for DataTables */}
      <style jsx>{`
        .custom_table {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .custom_table .dataTables_wrapper {
          padding: 0;
        }
        
        .custom_table .dataTable {
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
          background: white;
        }
        
        .custom_table .dataTable thead th {
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
        
        .custom_table .dataTable tbody td {
          padding: 1rem;
          border-bottom: 1px solid #f3f4f6;
          color: #374151;
          font-size: 0.875rem;
          vertical-align: middle;
        }
        
        .custom_table .dataTable tbody tr:hover {
          background-color: #f9fafb;
          transition: background-color 0.2s ease;
        }
        
        .custom_table .dataTable tbody tr:nth-child(even) {
          background-color: #fafafa;
        }
        
        .custom_table .dataTable tbody tr:nth-child(even):hover {
          background-color: #f3f4f6;
        }
        
        .custom_table .btn-view,
        .custom_table .btn-edit,
        .custom_table .btn-delete {
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 2.5rem;
          height: 2.5rem;
        }
        
        .custom_table .btn-view:hover {
          background-color: #dbeafe;
          transform: translateY(-1px);
        }
        
        .custom_table .btn-edit:hover {
          background-color: #dcfce7;
          transform: translateY(-1px);
        }
        
        .custom_table .btn-delete:hover {
          background-color: #fee2e2;
          transform: translateY(-1px);
        }
        
        .custom_table .dataTables_info {
          padding: 1rem;
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        .custom_table .dataTables_paginate {
          padding: 1rem;
        }
        
        .custom_table .dataTables_paginate .paginate_button {
          padding: 0.5rem 1rem;
          margin: 0 0.25rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          color: #374151;
          background: white;
          transition: all 0.2s ease;
        }
        
        .custom_table .dataTables_paginate .paginate_button:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }
        
        .custom_table .dataTables_paginate .paginate_button.current {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        
        .custom_table .dataTables_length select,
        .custom_table .dataTables_filter input {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }
        
        .custom_table .dataTables_filter input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .vehicle-modal .ant-modal-content {
          border-radius: 1rem;
          overflow: hidden;
        }
        
        .vehicle-modal .ant-modal-header {
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          padding: 1.5rem;
        }
        
        .vehicle-modal .ant-modal-title {
          font-weight: 600;
          color: #111827;
        }
        
        .vehicle-modal .ant-modal-body {
          padding: 1.5rem;
        }
        
        .vehicle-modal .ant-modal-footer {
          border-top: 1px solid #e5e7eb;
          padding: 1rem 1.5rem;
        }
      `}</style>
    </>
  );
};

export default AllVehicle;
