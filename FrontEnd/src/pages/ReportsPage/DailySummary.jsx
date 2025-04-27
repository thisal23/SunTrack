import React, { useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import NavRepo from '../../components/Navbarreports/navrepo';
import { FaSearch } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "./DailySummary.css";

function DailySummary() {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSearch = () => {
    console.log("Searching for date:", selectedDate);

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
          <label className="date-label">Search the date : </label>
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
      </div>
      </div>
    </>
  );
}

export default DailySummary;
