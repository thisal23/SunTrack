import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "datatables.net-select-dt/css/select.dataTables.min.css";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import "datatables.net-select-dt";
import { Modal } from "antd";
import DocumentDeleteCard from "./DocumentDeleteCard";
import NavBar from "../../components/NavBar/NavBar";
import "datatables.net-rowgroup";
import "datatables.net-rowgroup-dt/css/rowGroup.dataTables.min.css";
import apiService from "../../config/axiosConfig";
import DocumentEditCard from "./DocumentEditCard";

const DocumentMaintenance = () => {
  const tableRef = useRef(null);
  const [isModal_1_Open, setIsModal_1_Open] = useState(false);
  const [isModal_2_Open, setIsModal_2_Open] = useState(false);
  const [plateNo, setPlateNo] = useState("");
  const [documentData, setDocumentData] = useState([]);
  const [currentDocumentType, setCurrentDocumentType] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [expireDate, setExpiryDate] = useState("");

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
    setPlateNo("");
    setCurrentDocumentType("");
    setExpiryDate("");
    setLastUpdate("");
  };

  const handleCancel_2 = () => {
    setIsModal_2_Open(false);
    setPlateNo("");
  };

  const fetchDocumentDetails = async () => {
    try {
      const data = await apiService.get("document/detailFetch").catch((err) => {
        console.log(`api error`, err);
        return {
          status: 500,
          data: { status: false, message: "Network error" },
        };
      });

      if (data.status !== 200) {
        toast.error("Document data fetching error!!!");
      }

      console.log(data);
      setDocumentData(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDocumentUpdateSuccess = () => {
    console.log("Document update successful! Refreshing data...");
    fetchDocumentDetails(); // Call the fetch function to get the latest data
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
  }, []);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    $(tableRef.current).DataTable({
      data: prepareTableData(documentData),
      columns: [
        { title: "VehicleNo", visible: false },
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
              return `<a href="${data}" target="_blank" rel="noopener noreferrer" class="cursor-pointer px-2 py-1 rounded text-m hover:text-white">View Document</a>`;
            } else {
              return `<span class="text-gray-500 italic">Not Available</span>`;
            }
          },
        },
        {
          targets: [5], // Action
          render: function (data, type, row) {
            console.log("Row:", row);
            const licenseValue = row[6] !== undefined ? row[6] : "";
            return `
            <div style="display: flex; gap: 6px;">
            <button class="btn-edit"
                      data-id="${row[0]}"
                      data-document-type="${row[1]}"
                      data-lastupdatevalue="${row[2]}"
                      data-expiredatevalue="${row[3]}"
                      style="background:#28a745;color:white;padding:5px 10px;border:none;margin-right:5px;cursor:pointer;">
                Edit
              </button>

              <button class="btn-delete"
                      data-id="${row[0]}"
                      data-dt="${row[1]}"
                      data-license="${licenseValue}"
                      style="background:#dc3545;color:white;padding:5px 10px;border:none;cursor:pointer;">
                Delete
              </button>
              </div>
            `;
          },
        },
      ],

      responsive: true,
      select: true, // If you want row selection
      ordering: true,
      info: true,
      paging: true,
    });

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

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
      $(tableRef.current).off("click", ".btn-edit");
      $(tableRef.current).off("click", ".btn-delete");
    };
  }, [documentData]);

  console.log("PlateNo:", $(this).data("id"));
  console.log("DocType:", $(this).data("document-type"));
  console.log("LastUpdate:", $(this).data("lastupdatevalue"));
  console.log("ExpireDate:", $(this).data("expiredatevalue"));

  return (
    <>
      <NavBar />
      <div className="container_custom mx-auto w-full mt-20 text-black">
        <div className="flex flex-row justify-between items-center my-5">
          <span className="text-xl text-[#0F2043] font-semibold">
            Maintenance &gt; Document Maintenance
          </span>
        </div>

        <div className="border-b-1 border-gray-300 w-full mb-5"></div>
        <div>
          <table ref={tableRef} className="display w-full text-sm"></table>

          <Modal
            title="Update Document Services"
            open={isModal_1_Open}
            onCancel={handleCancel_1}
            footer={null} // Remove default footer buttons
            width={700}
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

          <Modal
            title="Delete Document Services"
            open={isModal_2_Open}
            onCancel={handleCancel_2}
            footer={null} // Remove default footer buttons
          >
            <DocumentDeleteCard
              plateNo={plateNo}
              handleCancel={handleCancel_2}
              onDeleteSuccess={fetchDocumentDetails}
            />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default DocumentMaintenance;
