import React, { useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import NavRepo from '../../components/Navbarreports/navrepo';
import { FaSearch } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "./DailySummary.css";
import { format } from 'date-fns'; // to format date to yyyy-MM-dd

function DailySummary() {
  const [reportData, setReportData] = useState([]); // Stores the fetched data
  const [selectedDate, setSelectedDate] = useState(null); // Stores the selected date
  const [isDataAvailable, setIsDataAvailable] = useState(false); // Tracks if data is available

  const handleSearch = async () => {
    if (!selectedDate) return;

    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    console.log("Searching for date:", formattedDate);

    try {
      const response = await fetch(`http://localhost:8000/api/daily-summary?date=${formattedDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error("Error fetching summary:", response.statusText);
        setReportData([]); // Clear the table data
        setIsDataAvailable(false); // No data available
        return;
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.length > 0) {
        setReportData(data); // Update the table data
        setIsDataAvailable(true); // Data is available
      } else {
        setReportData([]); // Clear the table data
        setIsDataAvailable(false); // No data available
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      setReportData([]); // Clear the table data
      setIsDataAvailable(false); // No data available
    }
  };

  return (
    <>
      <div>
        <NavBar />
      </div>
      <div className="bodyReport">
        <div className="boxReport">
          <div className="repoNav">
            <NavRepo />
          </div>

          <div className="date-picker-container">
            <label className="date-label0">Search the date : </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
              className="custom-datepicker"
            />
            <button className="search-button" onClick={handleSearch}>
              <FaSearch />
            </button>
          </div>

          {/* Conditional Rendering */}
          {isDataAvailable ? (
            <div className="report-table">
              <table>
                <thead>
                  <tr>
                    <th>Vehicle ID</th>
                    <th>Device ID</th>
                    <th>First Engine On</th>
                    <th>Last Engine Off</th>
                    <th>Active Time</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.vehicleId}</td>
                      <td>{row.deviceId}</td>
                      <td>{row.firstEngineOnTime}</td>
                      <td>{row.lastEngineOffTime}</td>
                      <td>{row.activeTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data-message1">
              <p>No data available for the selected date.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DailySummary;
