import React from 'react'
import MenuLink from '../MenuLink/MenuLink'
import './TrackingNavBar.css'
import { useNavigate } from 'react-router-dom';

function TrackingNavBar() {
  return (
    <>
    <div className="tnav">
        <div className="lists">
            <MenuLink className="links" url="/tracking" name="Live" />
            <MenuLink className="links" url="/history" name="History" />
            <MenuLink className="links" url="/geofence" name="Geo Fence" />
        </div>
    </div>
    </>
  )
}

export default TrackingNavBar