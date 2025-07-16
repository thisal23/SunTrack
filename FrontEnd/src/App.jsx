import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreatePassword from './components/authentication/CreatePassword';
import Login from './components/authentication/Login';
import Register from './components/authentication/Register';

import DriverDetailUpdate from "./pages/Driver/DriverDetailupdate";
import GetInformationODrivers from "./pages/Driver/GetInformationODrivers";

import './App.css';
import ResetPassword from './components/authentication/ResetPassword';

function App() {
    return (
        <Routes>
            <Route path="/create-password" element={<CreatePassword />} />
            
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/drivers/update/:driverId" element={<DriverDetailUpdate />} />
            <Route path="/drivers" element={<GetInformationODrivers />} />
            {/* Add other routes here */}
        </Routes>
    );
}

export default App;
