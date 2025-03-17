import React, { useState } from 'react';
import MenuLink from '../MenuLink/MenuLink';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';




function NavBar() {
    const [menuBtn, setMenuBtn] = useState(false);
    const [closeBtn, setCloseBtn] = useState(true);
    const navigate = useNavigate();

    
    function handleMenu() {
        setMenuBtn(true);
        setCloseBtn(false);
    }

    function handleClose() {
        setCloseBtn(true);
        setMenuBtn(false);
    }
    const handleLogOut= ()=>{
        navigate("/");

    };

    return (
        <>
            <div className="wrap">
                <div className="nav">
                    <div className={`list ${menuBtn ? 'active' : ''}`}>
                        <div className="logo">
                            <h2>SunTrack</h2>
                        </div>
                        <div className="links">
                            <MenuLink className="menuLink" url="/dashboard" name="Dashboard" />
                            <MenuLink className="menuLink" url="/info" name="Info" />
                            <MenuLink className="menuLink" url="/tracking" name="Tracking" />
                            <MenuLink  className="menuLink" url="/reports" name="Reports" />
                            <MenuLink className="menuLink" url="/maintenance" name="Maintenance" />
                        </div>
                        <div className="logOut">
                            <button type="submit" className='logout-btn' onClick={handleLogOut}>
                                <img className="logout" src="logout-svgrepo-com.svg" alt="" />
                            </button>
                        </div>
                        
                    </div>
                    <div className="menuOrClose">
                        <button 
                            onClick={handleMenu} 
                            title='Open Menu'
                            style={{ display: menuBtn ? "none" : "block" }} // Show only when menu is closed
                        >
                            <svg  width="34px" height="34px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#0F2043" fillRule="evenodd" d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z" />
                            </svg>
                        </button>
                        
                        <button 
                            onClick={handleClose} 
                            title='Close Menu'
                            style={{ display: closeBtn ? "none" : "block" }} // Show only when menu is open
                        >
                            <svg fill="#0F2043" height="34px" width="34px" viewBox="0 0 490 490" xmlns="http://www.w3.org/2000/svg">
                                <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337 " />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NavBar;
