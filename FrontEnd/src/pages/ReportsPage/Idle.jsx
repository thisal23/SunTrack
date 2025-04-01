import React, { useState } from 'react'
import NavBar from '../../components/NavBar/NavBar'
import NavRepo from '../../components/Navbarreports/navrepo'
import './Idle.css'
import { FaSearch } from 'react-icons/fa'

function Idle() {
  const [vehicleNo, setVehicleNo] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () =>{
    console.log("Date & Vehicle NO :" ,date, vehicleNo);
  };

  return (
    <>
        <div>
            <NavBar/>    
        </div>
        <div className="bodyReport">
        <div className="boxReport">
            <div className="repoNav">
                <NavRepo/>
            </div>
            <div className="input">
              <label htmlFor="date">Date</label>
              <input type="date" name="date" id="date" onChange={(e) => setDate(e.target.value)} /> 
              <label htmlFor="vehicleNo">Vehicle No </label>
              <input type="text" placeholder='LL7356' name="vehicleNo" id="vehicleNo" onChange={(e) => setVehicleNo(e.target.value)}/> 
              <button className='search-button4'onClick={handleSearch}> <FaSearch/> </button>
              
            </div> 
        </div>    
        </div>

    
    </>
  )
}

export default Idle