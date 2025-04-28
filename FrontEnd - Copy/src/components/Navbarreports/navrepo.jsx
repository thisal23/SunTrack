import React from 'react'
import MenuLink from '../MenuLink/MenuLink'
import './navrepo.css'
import { useNavigate } from 'react-router-dom';

function NavRepo() {
  return (
    <>
    
    <div className="tnav2">
        <div className="lists2">
            <MenuLink className="links" url="/reports" name="Geofence" />
            <MenuLink className="links" url="/idle" name="Idle" />
            <MenuLink className="links" url="/dailySummary" name="DailySummary" />
            <MenuLink className="links" url="/dailyDetail" name="DailyDetail" />
            <MenuLink className="links" url="/distance" name="Distance" />
        </div>
    </div>
    
    </>
  )
}

export default NavRepo