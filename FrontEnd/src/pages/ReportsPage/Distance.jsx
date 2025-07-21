import React, { useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import NavRepo from '../../components/Navbarreports/navrepo';
import { FaSearch } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Automatically registers Chart.js components
import './Distance.css';

function Distance() {
  const [vehicleNo, setVehicleNo] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [chartData, setChartData] = useState(null);
  const [isDataAvailable, setIsDataAvailable] = useState(false); // Tracks if data is available
  const [errorMessage, setErrorMessage] = useState(''); // Tracks error messages

  const handleSearch = async () => {
    if (!vehicleNo || !selectedYear || !selectedMonth) {
      setErrorMessage('Please fill in all fields');
      setChartData(null); // Clear the chart data
      setIsDataAvailable(false); // No data available
      return;
    }

    setErrorMessage(''); // Clear previous error messages

    try {
      const response = await fetch(
        `http://localhost:8000/api/distance-per-day?year=${selectedYear}&month=${selectedMonth}&plateNo=${vehicleNo}`
      );

      if (!response.ok) {
        console.error('Error fetching data:', response.statusText);
        setErrorMessage('Failed to fetch data. Please try again.');
        setChartData(null); // Clear the chart data
        setIsDataAvailable(false); // No data available
        return;
      }

      const data = await response.json();
      if (data.length === 0) {
        setErrorMessage('No data available for the given criteria');
        setChartData(null); // Clear the chart data
        setIsDataAvailable(false); // No data available
        return;
      }

      // Prepare data for the chart
      const labels = data.map((item) => item.date);
      const distances = data.map((item) => item.distance);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Distance Traveled (km)',
            data: distances,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            tension: 0.4, // Smooth curve
          },
        ],
      });
      setIsDataAvailable(true); // Data is available
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Failed to fetch data. Please try again.');
      setChartData(null); // Clear the chart data
      setIsDataAvailable(false); // No data available
    }
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i); // Last 10 years
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

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

          <div className="search-container3">
            <label className="search-label3">Search Vehicle No: </label>
            <input
              type="text"
              placeholder="Enter vehicle no"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              className="vehicle-input3"
            />
          </div>

          <div className="year-month-container">
            <label className="year-label">Select Year: </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="year-select"
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <label className="month-label">Select Month: </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="month-select"
            >
              <option value="">Select Month</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

  <button
    style={{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      color: '#0F2043',
      position: 'relative',
      left: '190px',
      bottom: '100px',
      width: '40px',
    }}
    onClick={handleSearch}
  >
    <FaSearch />
  </button>

          {/* Error Message */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {/* Conditional Rendering */}
          {isDataAvailable ? (
            <div className="chart-container">
              <Line data={chartData} />
            </div>
          ) : (
            !errorMessage && (
              <div className="no-data-message">
                No data available for the given criteria.
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default Distance;