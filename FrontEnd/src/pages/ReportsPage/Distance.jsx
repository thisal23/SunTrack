import React, { useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import NavRepo from '../../components/Navbarreports/navrepo';
import { FaSearch } from 'react-icons/fa';
import './Distance.css';

function Distance() {
  const [vehicleNo, setVehicleNo] = useState('');

  const handleSearch = () => {
    console.log("Searching for vehicle no:", vehicleNo);
    
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
        
        <div className="search-container3">
          <label className="search-label3">Search Vehicle No : </label>
          <input
            type="text"
            placeholder="Enter vehicle no"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
            className="vehicle-input3"
          />
          <button className="search-button3" onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>
      </div> 
        </div>   
    </>
  );
}

export default Distance;
