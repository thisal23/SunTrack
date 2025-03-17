import React from "react";
import { config } from "../config/config";

// Sachini part
const PDFViewer = ({ pdfUrl }) => {
  return (
    <div className="p-4">
      <h1>PDF Viewer</h1>

      <a
        href={`${config.apiEndpoint}/${pdfUrl}`}
        target="_blank"
        class="text-blue-500 underline"
      >
        View Document
      </a>
    </div>
  );
};

export default PDFViewer;
