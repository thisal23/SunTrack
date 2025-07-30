import React, { useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import NavRepo from '../../components/Navbarreports/navrepo';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ReportsPage.css';
import { FaSearch } from 'react-icons/fa';
import apiService from '../../config/axiosConfig';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';

DataTable.use(DT);

function Reportspage() {
  // const [selectedDate, setSelectedDate] = useState(null);
  const [selectedGeoName, setSelectedGeoName] = useState('');
  const [geoReport, setGeoReport] = useState([]);
   
  const displayGeoReport = async() => {
      const token = localStorage.getItem('token');
  
    console.log("Token:", token);

    
    try{
      console.log("Selected Geo Name:", selectedGeoName);
      const response = await apiService.get(`/reports` ,{geoFenceName: selectedGeoName}
        
    );

      const data= response.data.data;
      console.log(data);  
      setGeoReport(data);
      if (data.length > 0) {
        console.log("Data fetched successfully:", data);
      } else {
        console.log("No data found for the selected date.");
      }


    }
  catch(err){
      console.log(err);
    }
  }
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
        { geoReport.length ===0 && (<div className="search">
          {/* <label className="search-label">Search the date : </label>
          <DatePicker 
            selected={selectedDate} 
            onChange={(date) => setSelectedDate(date)} 
            dateFormat="yyyy-MM-dd" 
            placeholderText="Select a date" 
            className="custom-datepicker"
          /> */}
          <label className="geofence-label">Geo Fence Name</label>
          <input
            type="text"
            placeholder="Enter geofence name"
            className="geofence-input" onChange={(e) => setSelectedGeoName(e.target.value)}
          />
          <button className="search-button" onClick={displayGeoReport} type='button'>  
            <FaSearch />
          </button>
        </div>)}
        <div className="report">
          {geoReport.length > 0 && (
            <DataTable
              data={geoReport.map((item) => [
                item.plateNo,
                item.InDate,
                item.InTime,
                item.OutDate,
                item.OutTime
                
              ])}
              columns={[
                { title: 'Plate No' },
                { title: 'InDate' },
                { title: 'InTime' },
                { title: 'OutDate' },
                { title: 'OutTime' },
      
              ]}
              options={{
                paging: true,
                searching: false,
                ordering: true,
              }}
            />
          )}
        </div>
        
      </div>
      </div>
    </>
  );
}

export default Reportspage;
