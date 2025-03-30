import React, { useState } from 'react';
import axios from 'axios';
import './ResetPassword.css';
import resetPasswordImage from '../../assets/ResetPassword.jpg';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleResetRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/auth/forgot-password', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="container">
            <div className="reset-password-box">
                <img src={resetPasswordImage} alt="Reset Password" className="reset-password-image" />
                <h2>Reset Password</h2>
                <form onSubmit={handleResetRequest}>
                    <input 
                        type="email" 
                        placeholder="Enter the email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <button type="submit">Request Reset Link</button>
                </form>
                {message && <p>{message}</p>}
                <a href="/resend-link">Resend Link</a>
                <a href="/login">Back to Login</a>
            </div>
        </div>
    );
};

export default ResetPassword;
