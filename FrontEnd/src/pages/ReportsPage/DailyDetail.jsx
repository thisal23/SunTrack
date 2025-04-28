import React, { useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import NavRepo from '../../components/Navbarreports/navrepo';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSearch } from 'react-icons/fa'; 
import './DailyDetail.css';

function DailyDetail() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [vehicleNo, setVehicleNo] = useState('');

  const handleSearch = () => {
    console.log("Searching for:", { startDate, endDate, vehicleNo });
    
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
          <label className="date-label">Select Date Range : </label>
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
      </div> 
        </div>   
    </>
  );
}

export default DailyDetail;
