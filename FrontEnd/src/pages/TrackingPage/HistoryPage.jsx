import React, { useEffect, useState } from 'react'
import NavBar from '../../components/NavBar/NavBar'
import TrackingNavBar from '../../components/TrackingNavBar/TrackingNavBar'
import Map from '../../components/Map/Map'
import './HistoryPage.css'
import apiService from '../../config/axiosConfig'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle,useMap } from 'react-leaflet';
import { Polyline } from 'react-leaflet';
import startIcon2 from '../../assets/location-arrow-solid (1).svg'
import endIcon2 from '../../assets/flag-checkered-solid.svg'

function DynamicPolylineWeight({route}){
  const map = useMap();
  const [weight, setWeight] = useState(3);

  useEffect(() => {
    const updateWeight = () => {
      const zoomLevel = map.getZoom(); 
      if (zoomLevel < 10) {
        setWeight(2);
      }else if (zoomLevel >=10 && zoomLevel <13){
        setWeight(4);
      }else if (zoomLevel >=13 && zoomLevel <16){
        setWeight(6);
      }else {
        setWeight(8);
      }
    };
    map.on('zoomend', updateWeight); 
    updateWeight();
    return () => {
      map.off('zoomend', updateWeight); 
    };
  }, [map]);

  return (
    <Polyline positions={route} color="blue" weight={weight}/>
  );
}

function HistoryPage() {
const [route,setRoute] = useState([]);
const [date, setDate] = useState("");
const [plateNo, setPlateNo] = useState("");
const [start, setStart] = useState([]);
const [end, setEnd] = useState([]);



const startIcon = new L.Icon({
  iconUrl: startIcon2,
  iconSize:[32,32]
});
const endIcon = new L.Icon({
  iconUrl: endIcon2,
  iconSize:[32,32]  
});
    

const mapRoute = async ()=>{
  try{
    const response =  await apiService.get(`/history/${plateNo}/${date}`);

    const data = response.data.data;
    console.log(data);

    if (data && data.length > 0) {
      const path = data.map(point => [point.latitude, point.longitude]);
      setRoute(path);
      setStart([data[0].latitude, data[0].longitude]);
      setEnd([data[data.length - 1].latitude, data[data.length - 1].longitude]);
    } else {
      setRoute([]);
    }
  }

  catch(err){
    console.log(err);
  }
}


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
            <input className="vehicleno" onChange={(e)=>setPlateNo(e.target.value)} type="text" name="vehicleno" id="vehicleno" /><br/>
          
            <label htmlFor="date">Date</label><br/>
            <input className="date" type="date" name="date" id="date" onChange={(e) => setDate(e.target.value)}/>
            <button type="submit" onClick={mapRoute} className='history-search-btn'>Search</button>
          </div>
          <div className="maps-h">
            <MapContainer center={[6.007, 80.262]} zoom={12} style={{ height: '700px', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              {route.length > 0 && (
                <DynamicPolylineWeight route={route} />
              )}

              {start.length > 0 && (
                <Marker position={start} icon={startIcon}>
                  <Popup>Start Point</Popup>
                </Marker>
              )}
              {end.length > 0 && (
                <Marker position={end} icon={endIcon}>
                  <Popup>End Point</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
        
      </div>
    </div>
    </>
  )
}

export default HistoryPage