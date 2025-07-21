import React, { useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import "./GeoFencePage.css";
import TrackingNavBar from "../../components/TrackingNavBar/TrackingNavBar";
import apiService from "../../config/axiosConfig";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet';

function GeoFencePage() {
  const [type, setType] = useState("circle");
  const [addOrDel, setAddOrDel] = useState("del");
  const [name, setName] = useState("");
  const [coordinates, setCoordinates] = useState([7.211559, 80.427956]);
  const [latitude , setLatitude] = useState("");
  const [longitude , setLongitude] = useState("");
  const [radius, setRadius] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");

  const MapClickHandler = ({ setCoordinates }) => {
    useMapEvents({
      click: (e) => {
        setCoordinates([e.latlng.lat, e.latlng.lng]);
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
        console.log("Selected Latitude:", e.latlng.lat, "Longitude:", e.latlng.lng);
      },
    });
    return null;
  };

  // const addName = async () => {
  //   try {
  //     const jsonData = {
  //       name: name,
  //     };
  //     console.log(jsonData);

  //     const response = await apiService.post("/geofence/addName", jsonData,{
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     console.log(response.data);
  //     if (response.data.status) {
  //       alert("Name added successfully!");
  //     } else {
  //       alert("Failed to add name!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     alert("An error occurred while adding the name.");
  //   }
  // };
  const addGeoFence = async () => {
    try {
      const jasonData = {
        name: name, 
        type: type,
        centerLatitude: latitude,
        centerLongitude: longitude,
        radius: parseInt(radius),
        width: parseInt(width),
        length: parseInt(length),
      };
      console.log(jasonData);

      const response = await apiService.post("/geofence/addGeoFence", jasonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      if (response.data.status) {
        alert("Geofence added successfully!");
      } else {
        alert("Failed to add geofence!");
      }
    }
    catch (error) {
      console.log(error);
      alert("An error occurred while adding the geofence.");
    }
  }

  const handleAddOrDel = (e) => {
    setAddOrDel(e.target.value);
  };

  const handleType = (event) => {
    setType(event.target.value);
  };

  const handleLocation = (e) => {
    setSearchLocation(e.target.value);
  };

  return (
    <>
      <div>
        <NavBar />
      </div>
      <div className="body-g">
        <div className="box-g">
          <div className="navtrack">
            <TrackingNavBar />
          </div>
          <div className="horizon-g">
            <div className="vehicleNo-g">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                id="name"
                value={name}
              />
              {/* <button onClick={addName} type="submit" className="search-btn">
                Add Name
              </button> */}

              {/* <label htmlFor="location">Location</label>
              <input
                onChange={handleLocation}
                type="text"
                name="location"
                id="location"
              /> */}

              <label htmlFor="type">Type</label>
              <select onChange={handleType} name="type" id="type">
                <option value="circle">Circle</option>
                <option value="square">Square</option>
              </select>

              {type === "circle" && (
                <div className="circle">
                  {/* <label htmlFor="position">Center</label>
                  <br />
                  <input type="text" name="position" id="position" value={coordinates.join(", ")} readOnly />
                  <br /> */}
                  <label htmlFor="radius">Radius</label>
                  <br />
                  <input type="text" name="radius" id="radius" value={radius} onChange={(e) => setRadius(e.target.value)} />
                  <br />
                </div>
              )}

              {type === "square" && (
                <div className="square">
                  <label htmlFor="width">Width</label>
                  <br />
                  <input type="text" name="width" id="width" value={width} onChange={(e) => setWidth(e.target.value)} />
                  <br />
                  <label htmlFor="length">Length</label>
                  <br />
                  <input type="text" name="length" id="length" value={length} onChange={(e) => setLength(e.target.value)} />
                  <br />
                </div>
              )}

              {addOrDel === "del" && (
                <button
                  onClick={addGeoFence} 
                  onChange={handleAddOrDel}
                  value="add"
                  className="add"
                  type="submit"
                >
                  Add
                </button>
              )}
              {addOrDel === "add" && (
                <button
                  
                  onChange={handleAddOrDel}
                  value="del"
                  className="add"
                  type="submit"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="maps-g">
              <MapContainer center={coordinates} zoom={8} style={{ height: "700px", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Circle center={coordinates} radius={radius} color="blue" fillColor="blue" fillOpacity={0.5} />
                <MapClickHandler setCoordinates={setCoordinates} />
                <Marker position={coordinates}>
                  <Popup>
                    A sample popup message!
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

export default GeoFencePage;