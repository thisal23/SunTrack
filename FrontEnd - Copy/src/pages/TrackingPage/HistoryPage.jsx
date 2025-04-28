import React from 'react'
import NavBar from '../../components/NavBar/NavBar'
import TrackingNavBar from '../../components/TrackingNavBar/TrackingNavBar'
import Map from '../../components/Map/Map'
import './HistoryPage.css'
function HistoryPage() {
  return (
    <>
    <div>
        <NavBar/>
    </div>
    <div className="body-h">
      <div className='box-h'>
        <div className="navtrack">
            <TrackingNavBar/>
        </div>
        
        <div className="horizon-h">
          <div className="vehicleNo-h">
            <label htmlFor="vehicleno">Vehicle No</label><br/>
            <input className="vehicleno" type="text" name="vehicleno" id="vehicleno" /><br/>
          
            <label htmlFor="date">Date</label><br/>
            <input className="date" type="date" name="date" id="date" />
            <button type="submit" className='history-search-btn'>Search</button>
          </div>
          <div className="maps-h">
            <Map wid="" het="700px"/>
          </div>
        </div>
        
      </div>
    </div>
    </>
  )
}

export default HistoryPage