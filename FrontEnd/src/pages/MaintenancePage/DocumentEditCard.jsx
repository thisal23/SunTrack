import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useEffect, useRef } from "react";
import apiService from "../../config/axiosConfig";

const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="flex justify-between items-center w-full py-2 px-3 !border !border-gray-300 rounded-md !bg-white !text-gray-600 text-left focus:outline-none"
  >
    <span>{value || "Select date"}</span>
    <FaCalendarAlt className="text-gray-500 ml-2" />
  </button>
));

const DocumentEditCard = ({
  licenseId,
  documentType,
  handleCancel,
  onUpdateSuccess,
}) => {
  const [lastUpdate, setLastUpdate] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState(""); // New state for status message
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (documentType) {
      const validDocumentTypes = ["License", "Insurance", "Eco Test"];
      if (validDocumentTypes.includes(documentType)) {
        setSelectedDocumentType(documentType);
      } else {
        setSelectedDocumentType("License");
        console.warn(
          `Unexpected document type received: ${documentType}. Defaulting to 'License'.`
        );
      }
    } else {
      setSelectedDocumentType("");
    }

    setLastUpdate(null);
    setExpiryDate(null);
    setDocumentFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setStatusMessage("");
    setIsSuccess(false);
  }, [licenseId, documentType]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)

    setStatusMessage("");
    setIsSuccess(false);

    // --- Validation ---
    if (!licenseId || !selectedDocumentType || !lastUpdate || !expiryDate) {
      setStatusMessage("Please fill all required date fields.");
      setIsSuccess(false);
      return; // Stop submission
    }
    if (!documentFile && selectedDocumentType !== "Eco Test") {
      // Assuming Eco Test might not always require a file initially
      // You might want to adjust this validation based on whether a document is ALWAYS required
      setStatusMessage("Please upload a document file.");
      setIsSuccess(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("documentType", selectedDocumentType);
    if (lastUpdate) {
      const year = lastUpdate.getFullYear();
      const month = String(lastUpdate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(lastUpdate.getDate()).padStart(2, "0");
      formDataToSend.append("lastUpdate", `${year}-${month}-${day}`);
    }
    if (expiryDate) {
      const year = expiryDate.getFullYear();
      const month = String(expiryDate.getMonth() + 1).padStart(2, "0");
      const day = String(expiryDate.getDate()).padStart(2, "0");
      formDataToSend.append("expiryDate", `${year}-${month}-${day}`);
    }
    if (documentFile) formDataToSend.append("document", documentFile);

    try {
      const response = await apiService.put(
        `/document/update/${licenseId}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200 && response.data.status) {
        setStatusMessage(response.data.message);
        setIsSuccess(true);

        // Close modal and refresh data after a short delay
        setTimeout(() => {
          handleCancel(); // Close the modal
          if (typeof onUpdateSuccess === "function") {
            onUpdateSuccess(); // Trigger parent to refresh data
          }
        }, 2000);
      } else {
        setStatusMessage(response.data.message || "Failed to update document.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error updating document:", error);
      setStatusMessage(
        error.response?.data?.message || "An error occurred during update."
      );
      setIsSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-4">
        {/* Vehicle No */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Vehicle No:</label>
          <input
            type="text"
            name="vehicle_title"
            className="py-2 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            value={licenseId}
            readOnly
          />
        </div>

        {/* Document Type */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">
            Document Type:
          </label>
          <input
            type="text"
            name="document_type"
            className="py-2.5 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            value={selectedDocumentType}
            onChange={(e) => setSelectedDocumentType(e.target.value)} // Allow editing if needed
            readOnly
          />
        </div>

        {/* Last Update */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Last Update:</label>
          <DatePicker
            selected={lastUpdate}
            onChange={(date) => setLastUpdate(date)}
            dateFormat="yyyy-MM-dd"
            customInput={<CustomDateInput />}
            placeholderText="Select last update date"
          />
        </div>

        {/* Document Expiry Date */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">
            Document Expiry Date:
          </label>
          <DatePicker
            selected={expiryDate}
            onChange={(date) => setExpiryDate(date)}
            dateFormat="yyyy-MM-dd"
            customInput={<CustomDateInput />}
            placeholderText="Select expiry date"
          />
        </div>

        {/* Upload Document */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">
            Upload Document <small>(.pdf, .jpg, .jpeg)</small>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            name="document"
            accept=".pdf,.jpg,.jpeg"
            className="py-2 px-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            onChange={(e) => setDocumentFile(e.target.files[0])}
          />
        </div>

        {statusMessage && (
          <div
            className={`py-2 px-3 rounded-md text-center ${
              isSuccess
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {statusMessage}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-2 mt-5">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200"
          >
            Update
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="py-2 px-4 bg-white text-blue-600 font-semibold rounded-md shadow hover:bg-blue-50 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default DocumentEditCard;
