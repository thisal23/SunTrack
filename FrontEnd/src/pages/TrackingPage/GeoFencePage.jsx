import React, { useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import Map from "../../components/Map/Map";
import "./GeoFencePage.css";
import TrackingNavBar from "../../components/TrackingNavBar/TrackingNavBar";

function GeoFencePage() {
  const [type, setType] = useState("circle"); 
  const [addOrDel, setAddOrDel] = useState("del");
  const [searchLocation, serSearchLocation] = useState("");

  function handleAddOrDel(e){
    setAddOrDel(e.target.value);
    
  }

  function handleType(event) {
    setType(event.target.value); 
  }

  function handleLocation(e){
    const lat = e.latlng.lat;
    const lang = e.latlng.lng;
  }

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
              <input type="text" name="name" id="name" />

              <label htmlFor="location">Location</label>
              <input onChange={handleLocation} type="text" name="location" id="location" />

              <label htmlFor="type">Type</label>
              <select onChange={handleType} name="type" id="type">
                <option value="circle">Circle</option>
                <option value="square">Square</option>
              </select>

              {type === "circle" && (
                <div className="circle">
                  <label htmlFor="position">Center</label><br/>
                  <input type="text" name="position" id="position" /><br/>
                  <label htmlFor="radius">Radius</label><br/>
                  <input type="text" name="radius" id="radius" /><br/>
                </div>
              )}

              {type === "square" && (
                <div className="square">
                  <label htmlFor="width">Width</label><br/>
                  <input type="text" name="width" id="width" /><br/>
                  <label htmlFor="length">Length</label><br/>
                  <input type="text" name="length" id="length" /><br/>
                </div>
              )}

              {addOrDel === "del" && (<button onClick={handleAddOrDel} value="add" className="add" type="submit">
                Add
              </button>)}
              {addOrDel === "add" && (<button onClick={handleAddOrDel} value="del" className="add" type="submit">
                Remove
              </button>)}
            </div>
            <div className="maps-g">
              <Map wid="" het="700px" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GeoFencePage;
