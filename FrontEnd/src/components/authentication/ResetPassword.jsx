import React, { useState } from 'react';
import axios from 'axios';
import './ResetPassword.css';
import resetPasswordImage from '../../assets/ResetPassword.jpg';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP verification & new password

    const handleOtpRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/auth/forgot-password', { email });
            setMessage(response.data.message);
            setStep(2); // Move to OTP verification step
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong');
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setMessage("Passwords don't match");
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:8000/api/auth/reset-password', { 
                email,
                otp,
                newPassword
            });
            setMessage(response.data.message);
            // Reset form after successful password reset
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong');
        }
    };

    const resendOtp = async () => {
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
                
                {step === 1 ? (
                    // Step 1: Request OTP by providing email
                    <form onSubmit={handleOtpRequest}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit">Request OTP</button>
                    </form>
                ) : (
                    // Step 2: Enter OTP and new password
                    <form onSubmit={handlePasswordReset}>
                        <input
                            type="text"
                            placeholder="Enter OTP sent to your email"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Reset Password</button>
                    </form>
                )}
                
                {message && <p className="message">{message}</p>}
                
                {step === 2 && (
                    <button 
                        className="resend-link" 
                        onClick={resendOtp}>
                        Resend OTP
                    </button>
                )}
                
                <a href="/login" className="back-link">Back to Login</a>
            </div>
        </div>
    );
};

export default ResetPassword;