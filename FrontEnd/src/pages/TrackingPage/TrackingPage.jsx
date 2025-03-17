import React from 'react'
import NavBar from '../../components/NavBar/NavBar'
import TrackingNavBar from '../../components/TrackingNavBar/TrackingNavBar'
import './TrackingPage.css'
import Map from '../../components/Map/Map'
function TrackingPage() {
  return (
    <>
    <div>
      <NavBar/>
    </div>
    <div className="body">
      <div className='box'>
        <div className="navtrack-l">
          <TrackingNavBar/>
        </div>
        
        <div className="horizon">
          <div className="vehicleNo">
            <label htmlFor="vehicleno">Vehicle No</label><br/>
            <input className="vehicleno" type="text" name="vehicleno" id="vehicleno" />
            <button type="submit" className='search-btn'>Search</button>
          </div>
          <div className="maps">
            <Map wid="" het="700px"/>
          </div>
        </div>
        
      </div>
    </div>
    </>
  )
}

export default TrackingPage