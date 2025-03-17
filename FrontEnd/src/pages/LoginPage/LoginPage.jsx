
import React from 'react'
import './LoginPage.css'
import HomePage from '../Dashboard/Dashboard'
import { useNavigate } from 'react-router-dom';

function LoginPage() {

    const navigate = useNavigate();

    const handleLogin = () =>{
        navigate("/dashboard");
    };

  return (
    <div className="container"> 
        <div className="head">
            <h2>SunTrack</h2>
            <h3>Login</h3>
        </div>
        
        <div className="cred">
            <div className='inputs'>
                <label htmlFor="userName">Username</label>
                <br />
                <input type="text" name="userName" id="userName" />
                <br />
            </div>
            <div className='inputs'>
                <label htmlFor="password">Password</label>
                <br />
                <input type="text" name="passwored" id="password" />
                <br />
            </div>
            <button className="login-btn" type="submit" onClick={handleLogin}>Login</button>
        </div>
    </div>
  )
}

export default LoginPage


