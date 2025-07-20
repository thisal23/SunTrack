import React, { useState } from 'react'
import NavBar from '../../components/NavBar/NavBar'
import NavRepo from '../../components/Navbarreports/navrepo'
import './Idle.css'
import { FaSearch } from 'react-icons/fa'
// import DataTable from 'datatables.net-dt'
import apiService from '../../config/axiosConfig'
import DT from 'datatables.net-dt';
import DataTable from 'datatables.net-react';



DataTable.use(DT);

function Idle() {
  const [vehicleNo, setVehicleNo] = useState('');
  const [date, setDate] = useState('');
  const [idleReport, setIdleReport] = useState([]);

  const displayIdleReport = async () =>{
    console.log("Date & Vehicle NO :" ,date, vehicleNo);

    try{

      const response = await apiService.get(`/idle/${date}/${vehicleNo}`);
      const data = response.data.data;
      console.log(data);
      setIdleReport(data);
      if (data.length > 0) {
        console.log("Data fetched successfully:", data);
      } else {
        console.log("No data found for the selected date.");
      }
    }
    catch(err){
      console.log(err);
    }


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
            {idleReport.length === 0 &&  ( <div className="input">
              <label htmlFor="date">Date</label>
              <input type="date" name="date" id="date" onChange={(e) => setDate(e.target.value)} /> 
              <label htmlFor="vehicleNo">Vehicle No </label>
              <input type="text" placeholder='LL7356' name="vehicleNo" id="vehicleNo" onChange={(e) => setVehicleNo(e.target.value)}/> 
              <button className='search-button4'onClick={displayIdleReport} type='button'> <FaSearch/> </button>
              
            </div> )}
            <div className="report">
              {idleReport.length > 0 && (
                <DataTable data= {idleReport.map((item) => [
                  item.plateNo,
                  item.idle_latitude,
                  item.idle_longitude,
                  item.idle_time,
                  item.idle_acc,
                  item.idle_location_link,
                  item.move_time,
                  item.move_acc
                ])}
                columns={[
                  {title: 'Plate No'},
                  {title: 'Idle Latitude'},
                  {title: 'Idle Longitude'},
                  {title: 'Idle Time'},
                  {title: 'Idle Acc'},
                  {
                    title: 'Idle Location Link',
                    render: function (data, type, row, meta) {
                      return `<a href="${data}" target="_blank" rel="noopener noreferrer">View Location</a>`;
                    },
                  }, 
                  {title: 'Move Time'},
                  {title: 'Move Acc'},
                ]}
                options={{
                  paging: true,
                  searching: false,
                  ordering: true,
                  order: [[0, 'asc']],
                  
                }}
                />
                )}
                </div>
        </div>    
        </div>

    
    </>
  )
}

export default Idle