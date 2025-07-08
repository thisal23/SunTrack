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
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Step 1: Email, Step 2: OTP verification, Step 3: New password
    const [step, setStep] = useState(1);

    const handleOtpRequest = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setErrorMessage('');
        
        try {
            const response = await axios.post('http://localhost:8000/api/auth/forgot-password', { email });
            setMessage(response.data.message || 'OTP sent successfully! Please check your email.');
            setStep(2); // Move to OTP verification step
        } catch (error) {
            console.error('OTP request error:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpVerification = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setErrorMessage('');
        
        try {
            // Verify OTP before moving to password reset step
            const response = await axios.post('http://localhost:8000/api/auth/verify-otp', { 
                email,
                otp
            });
            setMessage(response.data.message || 'OTP verified successfully!');
            setStep(3); // Move to new password step
        } catch (error) {
            console.error('OTP verification error:', error);
            setErrorMessage(error.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setErrorMessage('');
        
        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords don't match");
            setIsLoading(false);
            return;
        }
        
        if (newPassword.length < 8) {
            setErrorMessage("Password must be at least 8 characters");
            setIsLoading(false);
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:8000/api/auth/reset-password', { 
                email,
                otp,
                newPassword
            });
            setMessage(response.data.message || 'Password reset successful!');
            // Reset form after successful password reset
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);
        } catch (error) {
            console.error('Password reset error:', error);
            setErrorMessage(error.response?.data?.message || 'Password reset failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resendOtp = async () => {
        setIsLoading(true);
        setMessage('');
        setErrorMessage('');
        
        try {
            const response = await axios.post('http://localhost:8000/api/auth/forgot-password', { email });
            setMessage(response.data.message || 'OTP resent successfully!');
        } catch (error) {
            console.error('Resend OTP error:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepForm = () => {
        switch(step) {
            case 1:
                // Step 1: Request OTP by providing email
                return (
                    <form onSubmit={handleOtpRequest}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="primary-button"
                        >
                            {isLoading ? 'Sending...' : 'Request OTP'}
                        </button>
                    </form>
                );
            
            case 2:
                // Step 2: OTP verification form
                return (
                    <form onSubmit={handleOtpVerification}>
                        <div className="form-group">
                            <label htmlFor="otp">OTP Code</label>
                            <input
                                type="text"
                                id="otp"
                                placeholder="Enter OTP sent to your email"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="primary-button"
                        >
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <button 
                            type="button"
                            className="secondary-button resend-link" 
                            onClick={resendOtp}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Resend OTP'}
                        </button>
                    </form>
                );
            
            case 3:
                // Step 3: New password form
                return (
                    <form onSubmit={handlePasswordReset}>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="primary-button"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                );
            
            default:
                return null;
        }
    };

    const renderStepIndicator = () => {
        return (
            <div className="step-indicator">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
                <div className="step-line"></div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
                <div className="step-line"></div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
            </div>
        );
    };

    return (
        <div className="container">
            <div className="reset-password-box">
                <img src={resetPasswordImage} alt="Reset Password" className="reset-password-image" />
                <h2>Reset Password</h2>
                
                {renderStepIndicator()}
                
                <div className="step-title">
                    {step === 1 && <h3>Step 1: Enter Email</h3>}
                    {step === 2 && <h3>Step 2: Verify OTP</h3>}
                    {step === 3 && <h3>Step 3: Create New Password</h3>}
                </div>
                
                {renderStepForm()}
                
                {message && <p className="success-message">{message}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                
                <a href="/login" className="back-link">Back to Login</a>
            </div>
        </div>
    );
};

export default ResetPassword;