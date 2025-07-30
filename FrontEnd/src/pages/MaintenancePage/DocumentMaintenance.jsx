import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "datatables.net-select-dt/css/select.dataTables.min.css";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import "datatables.net-select-dt";
import { Modal } from "antd";
import NavBar from "../../components/NavBar/NavBar";
import "datatables.net-rowgroup";
import "datatables.net-rowgroup-dt/css/rowGroup.dataTables.min.css";
import apiService from "../../config/axiosConfig";
import DocumentEditCard from "./DocumentEditCard";
import { toast, ToastContainer } from "react-toastify";
import "./DocumentMaintenance.css";

const DocumentMaintenance = () => {
  const tableRef = useRef(null);
  const [isModal_1_Open, setIsModal_1_Open] = useState(false);
  const [plateNo, setPlateNo] = useState("");
  const [documentData, setDocumentData] = useState([]);
  const [currentDocumentType, setCurrentDocumentType] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [expireDate, setExpiryDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const showModal_1 = (id, documentType, expireDateVal, lastUpdateVal) => {
    setIsModal_1_Open(true);
    setPlateNo(id);
    setCurrentDocumentType(documentType);
    setExpiryDate(expireDateVal);
    setLastUpdate(lastUpdateVal);
  };

  const showModal_2 = (id) => {
    setIsModal_2_Open(true);
    setPlateNo(id);
  };

  const handleCancel_1 = () => {
    setIsModal_1_Open(false);
    // Add a small delay before clearing state to prevent DOM conflicts
    setTimeout(() => {
      setPlateNo("");
      setCurrentDocumentType("");
      setExpiryDate("");
      setLastUpdate("");
    }, 100);
  };

  const fetchDocumentDetails = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.get("document/detailFetch").catch((err) => {
        console.log(`api error`, err);
        return {
          status: 500,
          data: { status: false, message: "Network error" },
        };
      });

      if (data.status !== 200) {
        toast.error("Document data fetching error!!!");
        return;
      }

      console.log(data);
      setDocumentData(data.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch document data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpdateSuccess = () => {
    console.log("Document update successful! Refreshing data...");
    // Add a small delay to ensure modal is fully closed before refreshing
    setTimeout(() => {
      fetchDocumentDetails(); // Call the fetch function to get the latest data
    }, 100);
  };

  const prepareTableData = (data) => {
    const rows = [];

    data.forEach((item) => {
      // Always include all document types for each vehicle

      rows.push([
        item.vehicle.plateNo,
        "License",
        item.licenseLastUpdate || "N/A",
        item.licenseExpireDate || "N/A",
        item.licenseDocument || "Not Available",
        "Action",
      ]);

      rows.push([
        item.vehicle.plateNo,
        "Insurance",
        item.insuranceLastUpdate || "N/A",
        item.insuranceExpireDate || "N/A",
        item.insuranceDocument || "Not Available",
        "Action",
      ]);

      rows.push([
        item.vehicle.plateNo,
        "Eco Test",
        item.ecoLastUpdate || "N/A",
        item.ecoExpireDate || "N/A",
        item.ecoDocument || "Not Available",
        "Action",
      ]);
    });

    return rows;
  };

  useEffect(() => {
    fetchDocumentDetails();
    
    // Cleanup function for component unmount
    return () => {
      if (tableRef.current && $.fn.DataTable.isDataTable(tableRef.current)) {
        try {
          // Remove all event listeners first
          $(tableRef.current).off("click", ".btn-edit");
          $(tableRef.current).off("click", ".btn-delete");
          
          // Destroy the DataTable
          $(tableRef.current).DataTable().destroy();
          
          // Clear the table content safely
          if (tableRef.current) {
            try {
              while (tableRef.current.firstChild) {
                tableRef.current.removeChild(tableRef.current.firstChild);
              }
            } catch (error) {
              console.warn("Error clearing table content during unmount:", error);
            }
          }
        } catch (error) {
          console.warn("Error during cleanup:", error);
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
          $(tableRef.current).off("click", ".btn-edit");
          $(tableRef.current).off("click", ".btn-delete");
          
          // Destroy the DataTable
          $(tableRef.current).DataTable().destroy();
        } catch (error) {
          console.warn("Error destroying DataTable:", error);
        }
      }
      
      // Clear the table content safely
      if (tableRef.current) {
        try {
          // Remove all child nodes safely
          while (tableRef.current.firstChild) {
            tableRef.current.removeChild(tableRef.current.firstChild);
          }
        } catch (error) {
          console.warn("Error clearing table content:", error);
        }
      }
    };

    // Add a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      try {
        // Destroy existing DataTable first
        destroyDataTable();

        // Check if table element exists and is in DOM
        if (!tableRef.current || !document.contains(tableRef.current)) {
          console.warn("Table element not found in DOM");
          return;
        }

        // Don't initialize DataTable if modal is open
        if (isModal_1_Open) {
          console.log("Modal is open, skipping DataTable initialization");
          return;
        }

        // Initialize new DataTable
        const dataTable = $(tableRef.current).DataTable({
          data: prepareTableData(documentData),
          columns: [
            { title: "VehicleNo", visible: false},
            { title: "Document Type" },
            { title: "Last Update Date" },
            { title: "Next Update Date" },
            { title: "Document" },
            { title: "Action" },
          ],
          rowGroup: {
            dataSrc: 0, // Vehicle No
          },
          pageLength: 9,
          lengthChange: false,
          columnDefs: [
            {
              targets: [4], // Document
              render: function (data, type, row) {
                if (data && data !== "Not Available") {
                  // Construct the full URL to the backend
                  const backendUrl = "http://localhost:8000";
                  let documentUrl;
                  
                  // Handle different URL formats from database
                  if (data.startsWith('/uploads/documents/')) {
                    // Already has the correct path
                    documentUrl = `${backendUrl}${data}`;
                  } else if (data.startsWith('/uploads/')) {
                    // Has /uploads/ but missing /documents/
                    documentUrl = `${backendUrl}/uploads/documents${data.substring(8)}`;
                  } else if (data.startsWith('/')) {
                    // Just starts with /, assume it needs /uploads/documents/
                    documentUrl = `${backendUrl}/uploads/documents${data}`;
                  } else {
                    // No leading slash, add full path
                    documentUrl = `${backendUrl}/uploads/documents/${data}`;
                  }
                  
                  return `<a href="${documentUrl}" target="_blank" rel="noopener noreferrer" class="document-link inline-flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    View Document</a>`;
                } else {
                  return `<span class="document-status status-not-available">Not Available</span>`;
                }
              },
            },
            {
              targets: [5], // Action
              render: function (data, type, row) {
                return `
                <div class="flex items-center justify-center">
                  <button class="btn-edit p-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                    data-id="${row[0]}"
                    data-document-type="${row[1]}"
                    data-lastupdatevalue="${row[2]}"
                    data-expiredatevalue="${row[3]}"
                    title="Edit Document">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                </div>
                `;
              },
            },
          ],
          responsive: true,
          select: false,
          ordering: true,
          info: true,
          paging: true,
        });

        // Add event listeners after DataTable is initialized
        $(tableRef.current).on("click", ".btn-edit", function () {
          showModal_1(
            $(this).data("id"),
            $(this).data("document-type").trim(),
            $(this).data("lastupdatevalue"),
            $(this).data("expiredatevalue")
          );
        });

        $(tableRef.current).on("click", ".btn-delete", function () {
          showModal_2($(this).data("id"));
        });

      } catch (error) {
        console.error("Error initializing DataTable:", error);
      }
    }, 100); // 100ms delay

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      destroyDataTable();
    };
  }, [documentData, isModal_1_Open]);



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
                  <h1 className="text-3xl font-bold text-gray-900">Document Maintenance</h1>
                  <p className="mt-2 text-gray-600">Manage and update vehicle documents and certificates</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                  <p className="text-2xl font-bold text-gray-900">{documentData.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Valid Documents</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documentData.filter(item => 
                      item.licenseExpireDate && new Date(item.licenseExpireDate) > new Date() &&
                      item.insuranceExpireDate && new Date(item.insuranceExpireDate) > new Date() &&
                      item.ecoExpireDate && new Date(item.ecoExpireDate) > new Date()
                    ).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documentData.filter(item => {
                      const thirtyDaysFromNow = new Date();
                      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                      return (
                        (item.licenseExpireDate && new Date(item.licenseExpireDate) <= thirtyDaysFromNow && new Date(item.licenseExpireDate) > new Date()) ||
                        (item.insuranceExpireDate && new Date(item.insuranceExpireDate) <= thirtyDaysFromNow && new Date(item.insuranceExpireDate) > new Date()) ||
                        (item.ecoExpireDate && new Date(item.ecoExpireDate) <= thirtyDaysFromNow && new Date(item.ecoExpireDate) > new Date())
                      );
                    }).length}
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
                  <p className="text-sm font-medium text-gray-600">Expired</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documentData.filter(item => 
                      (item.licenseExpireDate && new Date(item.licenseExpireDate) < new Date()) ||
                      (item.insuranceExpireDate && new Date(item.insuranceExpireDate) < new Date()) ||
                      (item.ecoExpireDate && new Date(item.ecoExpireDate) < new Date())
                    ).length}
                  </p>
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
                  <p className="mt-4 text-gray-600 font-medium">Loading documents...</p>
                  <p className="text-sm text-gray-500">Please wait while we fetch the latest data</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto p-5">
                <div className="document-maintenance-page">
                  <table 
                    ref={tableRef} 
                    className="w-full"
                    key={`document-table-${documentData.length}`}
                  ></table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <Modal
          title={
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900">Update Document Services</span>
            </div>
          }
          open={isModal_1_Open}
          onCancel={handleCancel_1}
          footer={null}
          width={700}
          centered
          className="document-modal"
        >
          <DocumentEditCard
            plateNo={plateNo}
            documentType={currentDocumentType}
            lastUpdateProp={lastUpdate}
            expiryDateProp={expireDate}
            handleCancel={handleCancel_1}
            onUpdateSuccess={handleDocumentUpdateSuccess}
          />
        </Modal>

        {/* Custom CSS for DataTables */}
        <style>{`
          .document-maintenance-page {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .document-maintenance-page .dataTables_wrapper {
            padding: 0;
          }
          
          .document-maintenance-page .dataTable {
            border-collapse: separate;
            border-spacing: 0;
            width: 100%;
            background: white;
          }
          
          .document-maintenance-page .dataTable thead th {
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
          
          .document-maintenance-page .dataTable tbody td {
            padding: 1rem;
            border-bottom: 1px solid #f3f4f6;
            color: #374151;
            font-size: 0.875rem;
            vertical-align: middle;
          }
          
          .document-maintenance-page .dataTable tbody tr:hover {
            background-color: #f9fafb;
            transition: background-color 0.2s ease;
          }
          
          .document-maintenance-page .dataTable tbody tr:nth-child(even) {
            background-color: #fafafa;
          }
          
          .document-maintenance-page .dataTable tbody tr:nth-child(even):hover {
            background-color: #f3f4f6;
          }
          
          /* Remove row selection highlighting */
          .document-maintenance-page .dataTable tbody tr.selected {
            background-color: transparent !important;
          }
          
          .document-maintenance-page .dataTable tbody tr.selected td {
            background-color: transparent !important;
          }
          
          .document-maintenance-page .dataTable tbody tr.selected:hover {
            background-color: #f9fafb !important;
          }
          
          .document-maintenance-page .dataTable tbody tr.selected:nth-child(even) {
            background-color: #fafafa !important;
          }
          
          .document-maintenance-page .dataTable tbody tr.selected:nth-child(even):hover {
            background-color: #f3f4f6 !important;
          }
          
          .document-maintenance-page .btn-edit {
            padding: 0.5rem;
            border-radius: 0.5rem;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 2.5rem;
            height: 2.5rem;
            color: #059669;
          }
          
          .document-maintenance-page .btn-edit:hover {
            background-color: #dcfce7;
            transform: translateY(-1px);
          }
          
          .document-maintenance-page .document-link {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s ease;
          }
          
          .document-maintenance-page .document-link:hover {
            color: #2563eb;
            text-decoration: underline;
          }
          
          .document-maintenance-page .document-status {
            padding: 0.25rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 500;
          }
          
          .document-maintenance-page .status-not-available {
            background-color: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
          }
          
          .document-maintenance-page .dataTables_info {
            padding: 1rem;
            color: #6b7280;
            font-size: 0.875rem;
            display: inline-block !important;
            float: left !important;
          }
          
          .document-maintenance-page .dataTables_wrapper .dataTables_length,
          .document-maintenance-page .dataTables_wrapper .dataTables_filter,
          .document-maintenance-page .dataTables_wrapper .dataTables_info,
          .document-maintenance-page .dataTables_wrapper .dataTables_processing,
          .document-maintenance-page .dataTables_wrapper .dataTables_paginate {
            display: block !important;
            clear: both !important;
          }
          
          .document-maintenance-page .dataTables_wrapper .dataTables_length,
          .document-maintenance-page .dataTables_wrapper .dataTables_filter {
            float: left !important;
          }
          
          .document-maintenance-page .dataTables_wrapper .dataTables_paginate {
            float: right !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-end !important;
          }
          
          /* Ensure proper layout for DataTables 1.13+ */
          .document-maintenance-page .dataTables_wrapper .dt-layout-row {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .document-maintenance-page .dataTables_wrapper .dt-layout-cell {
            display: flex !important;
            align-items: center !important;
            flex: 0 0 auto !important;
          }
          
          .document-maintenance-page .dataTables_wrapper .dt-layout-start {
            justify-content: flex-start !important;
          }
          
          .document-maintenance-page .dataTables_wrapper .dt-layout-end {
            justify-content: flex-end !important;
          }
          
          /* Override any DataTables default styles that might cause vertical layout */
          .document-maintenance-page table.dataTable {
            clear: both !important;
            margin-top: 6px !important;
            margin-bottom: 6px !important;
            max-width: none !important;
          }
          
          .document-maintenance-page .dataTables_wrapper:after {
            clear: both !important;
            content: "" !important;
            display: table !important;
          }
          
          /* Force horizontal layout for all pagination elements */
          .document-maintenance-page .dataTables_paginate * {
            display: inline-block !important;
            float: none !important;
            vertical-align: middle !important;
          }
          
          /* Additional aggressive overrides for pagination */
          .document-maintenance-page .dataTables_paginate,
          .document-maintenance-page .dataTables_paginate ul,
          .document-maintenance-page .dataTables_paginate li {
            display: inline-block !important;
            float: none !important;
            vertical-align: middle !important;
            margin: 0 !important;
            padding: 0 !important;
            list-style: none !important;
          }
          
          .document-maintenance-page .dataTables_paginate ul {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-end !important;
            flex-wrap: nowrap !important;
            white-space: nowrap !important;
          }
          
          .document-maintenance-page .dataTables_paginate li {
            margin: 0 2px !important;
            padding: 0 !important;
          }
          
          /* Override any potential CSS that might cause vertical stacking */
          .document-maintenance-page .dataTables_wrapper .dataTables_paginate,
          .document-maintenance-page .dataTables_wrapper .dataTables_paginate ul,
          .document-maintenance-page .dataTables_wrapper .dataTables_paginate li,
          .document-maintenance-page .dataTables_wrapper .dataTables_paginate a {
            display: inline-block !important;
            float: none !important;
            vertical-align: middle !important;
            position: relative !important;
          }
          
          .document-maintenance-page .dataTables_paginate {
            padding: 1rem !important;
            display: flex !important;
            align-items: center !important;
            justify-content: flex-end !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            white-space: nowrap !important;
          }
          
          /* Fix for DataTables 1.13+ layout structure */
          .document-maintenance-page .dt-layout-row {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .document-maintenance-page .dt-layout-cell {
            display: flex !important;
            align-items: center !important;
            flex: 0 0 auto !important;
          }
          
          .document-maintenance-page .dt-layout-start {
            justify-content: flex-start !important;
          }
          
          .document-maintenance-page .dt-layout-end {
            justify-content: flex-end !important;
          }
          
          .document-maintenance-page .dt-paging {
            display: flex !important;
            align-items: center !important;
            justify-content: flex-end !important;
          }
          
          .document-maintenance-page .dt-paging nav {
            display: flex !important;
            align-items: center !important;
            flex-direction: row !important;
          }
          
          .document-maintenance-page .dt-paging-button {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0.5rem 1rem !important;
            margin: 0 0.25rem !important;
            border: 1px solid #d1d5db !important;
            border-radius: 0.375rem !important;
            color: #374151 !important;
            background: white !important;
            transition: all 0.2s ease !important;
            text-decoration: none !important;
            line-height: 1.5 !important;
            min-width: auto !important;
            width: auto !important;
            height: auto !important;
            cursor: pointer !important;
          }
          
          .document-maintenance-page .dt-paging-button:not(.disabled):hover {
            background: #f3f4f6 !important;
            border-color: #9ca3af !important;
          }
          
          .document-maintenance-page .dt-paging-button.current {
            background: #3b82f6 !important;
            color: white !important;
            border-color: #3b82f6 !important;
          }
          
          .document-maintenance-page .dt-paging-button.disabled {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
          }
          
          .document-maintenance-page .dataTables_paginate .paginate_button {
            padding: 0.5rem 1rem !important;
            margin: 0 0.25rem !important;
            border: 1px solid #d1d5db !important;
            border-radius: 0.375rem !important;
            color: #374151 !important;
            background: white !important;
            transition: all 0.2s ease !important;
            display: inline-block !important;
            float: none !important;
            vertical-align: middle !important;
            position: relative !important;
            text-decoration: none !important;
            line-height: 1.5 !important;
            min-width: auto !important;
            width: auto !important;
            height: auto !important;
          }
          
          .document-maintenance-page .dataTables_paginate .paginate_button:not(.disabled) {
            cursor: pointer !important;
          }
          
          .document-maintenance-page .dataTables_paginate .paginate_button.current {
            background: #3b82f6 !important;
            color: white !important;
            border-color: #3b82f6 !important;
          }
          
          .document-maintenance-page .dataTables_paginate .paginate_button:hover:not(.disabled) {
            background: #f3f4f6 !important;
            border-color: #9ca3af !important;
          }
          
          .document-maintenance-page .dataTables_paginate .paginate_button:hover {
            background: #f3f4f6;
            border-color: #9ca3af;
          }
          
          .document-maintenance-page .dataTables_paginate .paginate_button.current {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
          }
          
          .document-maintenance-page .dataTables_length select,
          .document-maintenance-page .dataTables_filter input {
            padding: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            font-size: 0.875rem;
          }
          
          .document-maintenance-page .dataTables_filter input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          .document-modal .ant-modal-content {
            border-radius: 1rem;
            overflow: hidden;
          }
          
          .document-modal .ant-modal-header {
            background: #f8fafc;
            border-bottom: 1px solid #e5e7eb;
            padding: 1.5rem;
          }
          
          .document-modal .ant-modal-title {
            font-weight: 600;
            color: #111827;
          }
          
          .document-modal .ant-modal-body {
            padding: 1.5rem;
          }
          
          .document-modal .ant-modal-footer {
            border-top: 1px solid #e5e7eb;
            padding: 1rem 1.5rem;
          }
        `}</style>
      </div>
    </>
  );
};

export default DocumentMaintenance;
