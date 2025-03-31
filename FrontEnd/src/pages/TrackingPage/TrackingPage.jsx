import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import TrackingNavBar from '../../components/TrackingNavBar/TrackingNavBar';
import './TrackingPage.css';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import apiService from '../../config/axiosConfig';

function TrackingPage() {
  const [coordinates, setCoordinates] = useState([7.211559,80.427956]);
  const [geoFences, setGeoFences] = useState([]);

  const displayMap = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/track', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log(data);

      if (data.status) {
        const location = data.data;
        setCoordinates([location.latitude, location.longitude]);
      } else {
        console.log('Error fetching data');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const display = async () => {
    try{
      const response = await apiService
  .get("/geofence/all")
  
  const data = response.data.data;
  console.log(data);
  if (response.data.data) {
    setGeoFences(response.data.data);
  }
  
}
catch (error) {
  console.log(error);
}

 }


  useEffect(() => {
    displayMap();
    
  }, []);

  useEffect(() => {
    display();
  }, []);

  return (
    <>
      <div>
        <NavBar />
      </div>
      <div className="body">
        <div className='box'>
          <div className="navtrack-l">
            <TrackingNavBar />
          </div>

          <div className="horizon">
            <div className="vehicleNo">
              <label htmlFor="vehicleno">Vehicle No</label><br />
              <input className="vehicleno" type="text" name="vehicleno" id="vehicleno" />
              <button type="submit" className='search-btn'>Search</button>
            </div>
            <div className="maps">
              <MapContainer center={coordinates} zoom={8} style={{ height: "700px", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                /> 

                {geoFences.map((geoFence, index) => (
                  <Circle key={index} center={[geoFence.centerLatitude, geoFence.centerLongitude]} radius={parseInt(geoFence.radius)} color="blue" fillOpacity={0.5}>
                    <Popup>
                      {geoFence.name} - {geoFence.type}
                    </Popup>
                  </Circle>
                ))}
                <Marker position={coordinates}>
                  <Popup>
                    Latest location
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default TrackingPage;