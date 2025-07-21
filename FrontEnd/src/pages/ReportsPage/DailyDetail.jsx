import React, { useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import NavRepo from '../../components/Navbarreports/navrepo';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSearch } from 'react-icons/fa';
import './DailyDetail.css';
import { format } from 'date-fns'; // Import the format function
import { formatTimeToHoursMinutes, formatDurationToHoursMinutes } from '../../utils/timeFormatter';

function DailyDetail() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [vehicleNo, setVehicleNo] = useState('');
  const [reportData, setReportData] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState(false); // Tracks if data is available
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!startDate || !endDate || !vehicleNo) {
      setError('Please provide start date, end date, and vehicle number');
      setReportData([]); // Clear the table data
      setIsDataAvailable(false); // No data available
      return;
    }

    setError(null); // Clear previous errors

    // Format the dates in local timezone
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(endDate, 'yyyy-MM-dd');

    try {
      const response = await fetch(
        `http://localhost:8000/api/daily-detail?startDate=${formattedStartDate}&endDate=${formattedEndDate}&plateNo=${vehicleNo}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error('Error fetching daily details:', response.statusText);
        setReportData([]); // Clear the table data
        setIsDataAvailable(false); // No data available
        return;
      }

      const data = await response.json();
      console.log("Response data:", data); // Log the data

      if (data.length > 0) {
        setReportData(data); // Update the table data
        setIsDataAvailable(true); // Data is available
      } else {
        setReportData([]); // Clear the table data
        setIsDataAvailable(false); // No data available
      }
    } catch (error) {
      console.error('Error fetching daily details:', error);
      setError('Failed to fetch data. Please try again.');
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

          <div className="search-container">
            {/* Date Range Picker */}
            <label className="date-label1">Select Date Range:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="Start Date"
              className="custom-datepicker"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="End Date"
              className="custom-datepicker"
            />

            {/* Vehicle No. Input */}
            <input
              type="text"
              placeholder="Search Vehicle No"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              className="vehicle-input"
            />

            {/* Search Button */}
            <button className="search-button2" onClick={handleSearch}>
              <FaSearch />
            </button>
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Conditional Rendering */}
          {isDataAvailable ? (
            <div className="summary-table">
              <table>
                <thead>
                  <tr>
                    <th>Trip ID</th>
                    <th>Start Location</th>
                    <th>End Location</th>
                    <th>Driver Start Time</th>
                    <th>Driver End Time</th>
                    <th>Date</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.tripId}</td>
                      <td>{row.startLocation}</td>
                      <td>{row.endLocation}</td>
                      <td>{row.driverStartTime}</td>
                      <td>{row.driverEndTime}</td>
                      <td>{row.tripDate}</td>
                      <td>{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !error && (
              <div className="no-data-message2">
                No data found for the selected criteria.
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default DailyDetail;