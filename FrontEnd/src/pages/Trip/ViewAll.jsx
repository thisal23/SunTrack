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
import "./ViewAll.css";

const ViewAll = () => {
  const tableRef = useRef(null);
  const dataTableRef = useRef(null); // Keep reference to DataTable instance

  const [isModal_assignOpen, setIsModal_assignOpen] = useState(false);
  const [isModal_editOpen, setIsModal_editOpen] = useState(false);
  const [isModal_deleteOpen, setIsModal_deleteOpen] = useState(false);

  const [tripData, setTripData] = useState([]);
  const [tripId, setTripId] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatuses, setIsUpdatingStatuses] = useState(false);

  const showModal_assign = (id) => {
    setIsModal_assignOpen(true);
    setTripId(id);
  };

  const showModal_edit = (id) => {
    setIsModal_editOpen(true);
    setTripId(id);
  };

  const showModal_delete = (id, startLocation, endLocation, date) => {
    setIsModal_deleteOpen(true);
    setTripId(id);
    setSelectedTrip({ startLocation, endLocation, date });
  };

  // Safely destroy DataTable
  const destroyDataTable = () => {
    if (tableRef.current && $.fn.DataTable.isDataTable(tableRef.current)) {
      try {
        // Remove all event listeners
        $(tableRef.current).off();
        
        // Destroy the DataTable
        $(tableRef.current).DataTable().destroy();
        dataTableRef.current = null;
      } catch (error) {
        console.warn("Error destroying DataTable:", error);
      }
    }
  };

  const handleTripUpdateSuccess = () => {
    console.log("Trip Data update successful! Refreshing data...");
    
    // Close modals first
    setIsModal_editOpen(false);
    setIsModal_deleteOpen(false);
    setSelectedTrip(null);
    
    // Destroy DataTable before fetching new data
    destroyDataTable();
    
    // Add longer delay before fetching to ensure modals are fully closed
    setTimeout(() => {
      fetchTrips();
    }, 500);
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

  const handleAssignSuccess = () => {
    console.log("Assignment successful! Refreshing trip data...");
    
    // Close the modal first
    setIsModal_assignOpen(false);
    
    // Destroy DataTable before fetching new data
    destroyDataTable();
    
    // Add delay before refreshing data to prevent DOM conflicts
    setTimeout(() => {
      fetchTrips();
    }, 300);
  };

  const handleUpdateTripStatuses = async () => {
    setIsUpdatingStatuses(true);
    try {
      // Destroy DataTable before making the API call
      destroyDataTable();
      
      const response = await apiService.post("trip/update-statuses");
      
      if (response.status === 200) {
        toast.success(response.data.message);
        // Refresh trip data after status update with longer delay
        setTimeout(() => {
          fetchTrips();
        }, 1000);
      } else {
        toast.error("Failed to update trip statuses");
        // Reinitialize table if update failed
        setTimeout(() => {
          if (tripData.length > 0) {
            initializeDataTable();
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error updating trip statuses:", error);
      toast.error("Failed to update trip statuses");
      // Reinitialize table if error occurred
      setTimeout(() => {
        if (tripData.length > 0) {
          initializeDataTable();
        }
      }, 500);
    } finally {
      setIsUpdatingStatuses(false);
    }
  };

  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      
      // Destroy DataTable before fetching new data to prevent conflicts
      destroyDataTable();
      
      // Add a small delay to ensure DOM is clean
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await apiService.get("trip/all");

      if (response.status !== 200) {
        toast.error("Trip data fetching error!!!");
        return;
      }

      // Sort by custom status order
      const statusOrder = {
        pending: 1,
        ready: 2,
        planned: 3,
        approved: 4,
        live: 4,
        finished: 5,
        rejected: 5,
      };

      const sortedTrips = response.data.data.sort((a, b) => {
        const statusA = statusOrder[(a.status || "").toLowerCase()] || 999;
        const statusB = statusOrder[(b.status || "").toLowerCase()] || 999;
        return statusA - statusB;
      });

      setTripData(sortedTrips);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch trip data");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize DataTable
  const initializeDataTable = () => {
    if (!tableRef.current || tripData.length === 0) return;

    // Destroy existing table first
    destroyDataTable();

    // Add a longer delay to ensure DOM is completely clean
    setTimeout(() => {
      try {
        // Double-check that the table element still exists
        if (!tableRef.current) {
          console.warn("Table ref is null, skipping DataTable initialization");
          return;
        }

        // Check if DataTable is already initialized
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
          console.warn("DataTable already initialized, destroying first");
      $(tableRef.current).DataTable().destroy();
    }

        // Ensure we have valid data before initializing
        if (!tripData || tripData.length === 0) {
          console.warn("No trip data available for DataTable initialization");
          return;
        }

        // Additional safety check - ensure the table element is still in the DOM
        if (!document.contains(tableRef.current)) {
          console.warn("Table element not in DOM, skipping DataTable initialization");
          return;
        }

        dataTableRef.current = $(tableRef.current).DataTable({
      data: tripData?.map((item) => [
        item.id,
        item.startLocation, // 1 (hidden)
  item.endLocation,   
        `<a href="https://www.google.com/maps/dir/${
          (item.startLocation ?? "").split(",")[0]
        },${(item.startLocation ?? "").split(",")[1]}/${
          (item.endLocation ?? "").split(",")[0]
        },${
          (item.endLocation ?? "").split(",")[1]
            }/" target="_blank" class="text-blue-600 hover:text-blue-800 underline font-medium inline-flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"></path>
        </svg>
        View Route</a>`,
        item.date,
        `${formatTimeToHoursMinutes(item.suggestStartTime) ?? "N/A"}`,
            `<span class="status-badge status-${(item.status || '').toLowerCase()}">${item.status || 'Unknown'}</span>`,
            item.driverName ?? `<span class="text-gray-500 italic">Not Assigned</span>`,
            item.vehicleId ?? `<span class="text-gray-500 italic">Not Assigned</span>`,
            item.tripRemark ?? `<span class="text-gray-400">-</span>`,
      ]),
      order: [],
      columns: [
        { title: "ID" },
        { title: "Start Location", visible: false },
  { title: "End Location", visible: false },
          { title: "Trip Route" },
        { title: "Date" },
          { title: "Start Time" },
        { title: "Status" },
        { title: "Driver" },
        { title: "Vehicle" },
          { title: "Remarks" },
        {
            title: "Assign",
          data: null,
          render: function (data, type, row) {
              // Extract status from the HTML string (remove HTML tags)
              const statusHtml = row[6];
              const tripStatus = statusHtml.replace(/<[^>]*>/g, '').trim().toLowerCase();
              const isDisabled = tripStatus !== "pending";
              
              return `<div class="flex justify-center">
                <button type="button" data-id="${row[0]}" 
                  class="assign_data px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isDisabled 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'btn-primary'
                  }" ${isDisabled ? 'disabled' : ''}>
                  ${isDisabled ? 'Assigned' : 'Assign Driver/Vehicle'}
      </button>
    </div>`;
          },
        },
        {
            title: "Actions",
          data: null,
          render: function (data, type, row) {
            return `
                <div class="flex items-center justify-center space-x-2">
                  <button class="btn-edit p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200" 
                    data-id="${row[0]}" title="Edit Trip">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                  <button class="btn-delete p-2 rounded-lg hover:bg-red-50 transition-colors duration-200" 
                    data-id="${row[0]}" data-start-location="${row[1]}" data-end-location="${row[2]}" data-date="${row[4]}" title="Delete Trip">
                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            `;
          },
        }
      ],
      createdRow: function (row, data, dataIndex) {
          const statusHtml = data[6];
          const status = statusHtml.replace(/<[^>]*>/g, '').trim().toLowerCase();
          
          if (status === "pending") {
            $(row).addClass("bg-yellow-50 border-l-4 border-l-yellow-400");
          } else if (status === "ready") {
            $(row).addClass("bg-orange-50 border-l-4 border-l-orange-400");
          } else if (status === "planned") {
            $(row).addClass("bg-blue-50 border-l-4 border-l-blue-400");
          } else if (status === "live") {
            $(row).addClass("bg-green-50 border-l-4 border-l-green-400");
          } else if (status === "finished") {
            $(row).addClass("bg-gray-50 border-l-4 border-l-gray-400");
          }
        },
        language: {
          search: "Search trips:",
          lengthMenu: "Show _MENU_ trips per page",
          info: "Showing _START_ to _END_ of _TOTAL_ trips",
          emptyTable: "No trips found",
          zeroRecords: "No matching trips found"
        },
        responsive: true,
        pageLength: 10,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        dom: '<"flex flex-col md:flex-row justify-between items-center mb-4"lf>rt<"flex flex-col md:flex-row justify-between items-center mt-4"ip>',
        destroy: true // Allow table to be reinitialized
      });

              // Attach event listeners after table is initialized
        $(tableRef.current).on("click", ".btn-edit", function (e) {
          e.preventDefault();
          e.stopPropagation();
      showModal_edit($(this).data("id"));
    });

        $(tableRef.current).on("click", ".btn-delete", function (e) {
          e.preventDefault();
          e.stopPropagation();
          showModal_delete(
            $(this).data("id"), 
            $(this).data("start-location"), 
            $(this).data("end-location"), 
            $(this).data("date")
          );
        });

        $(tableRef.current).on("click", ".assign_data", function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (!$(this).prop('disabled')) {
      showModal_assign($(this).data("id"));
          }
        });

      } catch (error) {
        console.error("Error initializing DataTable:", error);
        // Reset the reference if initialization failed
        dataTableRef.current = null;
      }
    }, 100); // Close setTimeout
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Separate effect for DataTable initialization
  useEffect(() => {
    if (!isLoading && tripData.length > 0) {
      // Add a longer delay to ensure DOM is completely ready
      const timer = setTimeout(() => {
        // Only initialize if component is still mounted and table ref exists
        if (tableRef.current) {
          initializeDataTable();
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [tripData, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up DataTable when component unmounts
      if (tableRef.current && $.fn.DataTable.isDataTable(tableRef.current)) {
        try {
          $(tableRef.current).off(); // Remove all event listeners
        $(tableRef.current).DataTable().destroy();
        } catch (error) {
          console.warn("Error cleaning up DataTable on unmount:", error);
        }
      }
    };
  }, []);

  // Cleanup when modals close
  useEffect(() => {
    if (!isModal_assignOpen && !isModal_editOpen && !isModal_deleteOpen) {
      // Longer delay to ensure modals are fully closed and DOM is stable
      const timer = setTimeout(() => {
        if (tableRef.current && !$.fn.DataTable.isDataTable(tableRef.current)) {
          // Reinitialize if table was destroyed but data is available
          if (tripData.length > 0 && !isLoading) {
            initializeDataTable();
          }
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isModal_assignOpen, isModal_editOpen, isModal_deleteOpen, tripData.length, isLoading]);

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 py-10 trip-viewall-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Trip Management</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleUpdateTripStatuses}
                  disabled={isUpdatingStatuses}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isUpdatingStatuses
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isUpdatingStatuses ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Updating...
          </span>
                  ) : (
                    'Update Trip Statuses'
                  )}
                </button>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="text-sm text-gray-500">Total Trips</div>
                  <div className="text-2xl font-bold text-gray-900">{tripData.length}</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="text-sm text-gray-500">Pending</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {tripData.filter(trip => trip.status?.toLowerCase() === 'pending').length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading trips...</span>
        </div>
            ) : (
              <div className="overflow-x-auto">
          <table
            ref={tableRef}
                  className="w-full"
            style={{ width: "100%" }}
          ></table>
              </div>
            )}
          </div>

          {/* Modals */}
          <Modal
            title={
              <div className="text-lg font-semibold text-gray-900">
                Assign Driver/Vehicle
              </div>
            }
            open={isModal_assignOpen}
            onCancel={handlecancel_assign}
            cancelButtonProps={{ style: { display: "none" } }}
            okButtonProps={{ style: { display: "none" } }}
            width={600}
            centered
            destroyOnClose={true}
          >
            <AssignCard 
              tripId={tripId} 
              onClose={handlecancel_assign}
              onSuccess={handleAssignSuccess}
            />
          </Modal>

          <Modal
            title={
              <div className="text-lg font-semibold text-gray-900">
                Edit Trip
              </div>
            }
            open={isModal_editOpen}
            onCancel={handleCancel_edit}
            cancelButtonProps={{ style: { display: "none" } }}
            okButtonProps={{ style: { display: "none" } }}
            width={600}
            centered
            destroyOnClose={true}
          >
            <PendingTripEditCard
              tripId={tripId}
              handleCancel={handleCancel_edit}
              onUpdateSuccess={handleTripUpdateSuccess}
            />
          </Modal>

          <Modal
            title={
              <div className="text-lg font-semibold text-gray-900">
                Delete Trip
              </div>
            }
            open={isModal_deleteOpen}
            onCancel={handleCancel_delete}
            cancelButtonProps={{ style: { display: "none" } }}
            okButtonProps={{ style: { display: "none" } }}
            width={500}
            centered
            destroyOnClose={true}
          >
            <PendingTripDeleteCard
  tripId={tripId}
  startLocation={selectedTrip?.startLocation}
  endLocation={selectedTrip?.endLocation}
  date={selectedTrip?.date}
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