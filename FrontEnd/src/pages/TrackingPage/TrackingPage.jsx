import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import TrackingNavBar from '../../components/TrackingNavBar/TrackingNavBar';
import './TrackingPage.css';
import { MapContainer, TileLayer, Marker, Popup, Circle, Rectangle } from 'react-leaflet';
import apiService from '../../config/axiosConfig';
import { bounds } from 'leaflet';

function TrackingPage() {
  const [coordinates, setCoordinates] = useState([7.211559,80.427956]);
  const [geoFences, setGeoFences] = useState([]);


  
  const autoGeofenceCheck = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/check',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      console.log('Geofence checked');
    } catch (err) {
      console.error('Error checking geofence:', err);
    }
  };

  useEffect(() => {
    // autoGeofenceCheck();

    const interval = setInterval(() => {
      autoGeofenceCheck();
    }, 30000);

    return () => clearInterval(interval);
  }, []);





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

  const metersToDegreesLat = (meters) => meters / 111320; // approx 1 deg = 111.32 km
  const metersToDegreesLng = (meters, lat) => meters / (111320 * Math.cos(lat * Math.PI / 180));

  const getRectangleBounds = (lat, lng, width, length) => {
    const deltaLat = metersToDegreesLat(length / 2);
    const deltaLng = metersToDegreesLng(width / 2, lat);
  
    return [
      [lat - deltaLat, lng - deltaLng], // Southwest corner
      [lat + deltaLat, lng + deltaLng]  // Northeast corner
    ];
  };

  const getSquareBounds = (lat, lng, sizeInMeters) => {
    const halfSizeLat = metersToDegreesLat(sizeInMeters / 2);
    const halfSizeLng = metersToDegreesLng(sizeInMeters / 2, lat);
  
    return [
      [lat - halfSizeLat, lng - halfSizeLng], // Southwest corner
      [lat + halfSizeLat, lng + halfSizeLng]  // Northeast corner
    ];
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
      <div className="body1">
        <div className='box1'>
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

                {geoFences.map((geoFence, index) => {

                  const lat = parseFloat(geoFence.centerLatitude);
                  const lng = parseFloat(geoFence.centerLongitude);
                  const isValidLatLng = !isNaN(lat) && !isNaN(lng);

                  if(!isValidLatLng){
                    return null;
                  }
                  if(geoFence.type === "circle" && !isNaN(geoFence.radius) && geoFence.radius > 0){
                    return (
                      <Circle key={`circle-${index}`} center={[lat, lng]} radius={parseInt(geoFence.radius)} color="blue" fillOpacity={0.5}>
                        <Popup>
                          {geoFence.name} - {geoFence.type}
                        </Popup>
                      </Circle>
                    );
                  }
                  if(geoFence.type === "square" && !isNaN(geoFence.width) && !isNaN(geoFence.length)){
                    if (geoFence.width > 0 && geoFence.length > 0 && geoFence.width=== geoFence.length) {
                      const bounds = getSquareBounds(lat, lng, parseFloat(geoFence.width));
                      return (
                        <Rectangle key={`square-${index}`} bounds={bounds} color="red" fillOpacity={0.5}>
                          <Popup>
                            {geoFence.name} - {geoFence.type}
                          </Popup>
                        </Rectangle>
                      );
                    }
                    else{
                      const bounds = getRectangleBounds(lat, lng, parseFloat(geoFence.width), parseFloat(geoFence.length));
                      return(
                        <Rectangle key={`square-${index}`} bounds={bounds} color="pink" fillOpacity={0.5}>
                          <Popup>
                            {geoFence.name} - {geoFence.type}
                          </Popup>
                        </Rectangle>
                      )
                    }
                  }
                  // <>
                  
                  //   {!isNaN(geoFence.radius) && geoFence.radius>0 && (
                  //     <Circle key={`circle-${index}`} center={[geoFence.centerLatitude, geoFence.centerLongitude]} radius={parseInt(geoFence.radius)} color="blue" fillOpacity={0.5}>
                  //       <Popup>
                  //         {geoFence.name} - {geoFence.type}
                  //       </Popup>
                  //     </Circle>
                  //   )}

                  //   {!isNaN(geoFence.width) && !isNaN(geoFence.length) && (
                  //     <Rectangle key={`square-${index}`} bounds={getRectangleBounds(parseFloat(geoFence.centerLatitude), parseFloat(geoFence.centerLongitude), parseFloat(geoFence.width), parseFloat(geoFence.length))} color="red" fillOpacity={0.5}>
                  //       <Popup>
                  //         {geoFence.name} - {geoFence.type}
                  //       </Popup>
                  //     </Rectangle>
                  //   )}
                  // </>
    })}
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