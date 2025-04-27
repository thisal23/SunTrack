import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreatePassword from './components/authentication/CreatePassword';
import ResetPassword from './components/authentication/resetPassword'; // Ensure the correct case
import Login from './components/authentication/Login';
import Register from './components/authentication/Register';

import './App.css';

function App() {
    return (
        <Routes>
            <Route path="/create-password" element={<CreatePassword />} />
            <Route path="/forgot-password" element={<ResetPassword />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Add other routes here */}
        </Routes>
    );
}

export default App;
