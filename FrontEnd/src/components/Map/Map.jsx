import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import './Map.css'

function MapClickHandler({ setCoordinates }) {
  // useMapEvents({
  //   click: (e) => {
  //     setCoordinates([e.latlng.lat, e.latlng.lng]);
  //     console.log("Selected Latitude:", e.latlng.lat, "Longitude:", e.latlng.lng);
  //   },
  // });
  return null;
}

function Map(props) {
  const [coordinates, setCoordinates]= useState([51.505, -0.09]);
   
  return (
    
    <div className="map">
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: props.het, width: "100%" }}>
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* <MapClickHandler setCoordinates={setCoordinates} /> */}

      <Marker position={coordinates}>
        <Popup>
          A sample popup message!
        </Popup>
      </Marker>
    </MapContainer>
    </div>
  )
}

export default Map