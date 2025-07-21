import React, { useState, useEffect } from 'react';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [otpTimer, setOtpTimer] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Timer for OTP resend
    useEffect(() => {
        let interval;
        if (otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer(timer => timer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer]);

    // Password validation
    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return {
            minLength,
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSpecial,
            isValid: minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial
        };
    };

    const clearMessages = () => {
        setMessage('');
        setErrorMessage('');
    };

    // Real API calls for OTP and password reset
    const sendOtpApi = async (email) => {
        const response = await fetch('http://localhost:8000/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to send OTP');
        }
        return await response.json();
    };

    const verifyOtpApi = async (email, otp) => {
        const response = await fetch('http://localhost:8000/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Invalid OTP');
        }
        return await response.json();
    };

    const resetPasswordApi = async (email, otp, newPassword) => {
        const response = await fetch('http://localhost:8000/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, newPassword })
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Password reset failed');
        }
        return await response.json();
    };

    const handleOtpRequest = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        clearMessages();
        try {
            const response = await sendOtpApi(email);
            setMessage(response.message || 'OTP sent successfully!');
            setStep(2);
            setOtpTimer(60);
        } catch (error) {
            setErrorMessage(error.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpVerification = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        clearMessages();
        try {
            const response = await verifyOtpApi(email, otp);
            setMessage(response.message || 'OTP verified successfully!');
            setStep(3);
        } catch (error) {
            setErrorMessage(error.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        clearMessages();
        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords don't match");
            setIsLoading(false);
            return;
        }
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            setErrorMessage("Password doesn't meet requirements");
            setIsLoading(false);
            return;
        }
        try {
            const response = await resetPasswordApi(email, otp, newPassword);
            setMessage(response.message || 'Password reset successful!');
            setTimeout(() => {
                // Redirect to login page
                window.location.href = '/login';
            }, 2000);
        } catch (error) {
            setErrorMessage(error.message || 'Password reset failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resendOtp = async () => {
        setIsLoading(true);
        clearMessages();
        try {
            const response = await sendOtpApi(email);
            setMessage('OTP resent successfully!');
            setOtpTimer(60);
        } catch (error) {
            setErrorMessage(error.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackStep = () => {
        if (step > 1) {
            setStep(step - 1);
            clearMessages();
        }
    };

    const handleBackToLogin = () => {
        window.location.href = '/login';
    };

    const renderStepForm = () => {
        switch(step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="form-group">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">📧</span>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                        <button 
                            onClick={handleOtpRequest}
                            disabled={isLoading || !email}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-medium"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Sending...
                                </span>
                            ) : 'Send OTP'}
                        </button>
                    </div>
                );
            
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="form-group">
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                Verification Code
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🛡️</span>
                                <input
                                    type="text"
                                    id="otp"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength="6"
                                    required
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest font-mono"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2 text-center">
                                Enter the 6-digit code sent to <span className="font-medium text-blue-600">{email}</span>
                            </p>
                        </div>
                        <button 
                            onClick={handleOtpVerification}
                            disabled={isLoading || otp.length !== 6}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-medium"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Verifying...
                                </span>
                            ) : 'Verify OTP'}
                        </button>
                        <button 
                            onClick={resendOtp}
                            disabled={isLoading || otpTimer > 0}
                            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-gray-300 font-medium"
                        >
                            {otpTimer > 0 ? `Resend OTP (${otpTimer}s)` : isLoading ? 'Sending...' : 'Resend OTP'}
                        </button>
                        <button 
                            onClick={handleBackStep}
                            className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all font-medium flex items-center justify-center"
                        >
                            <span className="mr-2">←</span>
                            Back
                        </button>
                    </div>
                );
            
            case 3:
                const passwordValidation = validatePassword(newPassword);
                return (
                    <div className="space-y-6">
                        <div className="form-group">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔒</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="newPassword"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                               
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔒</span>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                
                            </div>
                        </div>

                        {newPassword && (
                            <div className="password-requirements bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <p className="text-gray-700 text-sm font-medium mb-3">Password Requirements:</p>
                                <ul className="text-sm space-y-2">
                                    <li className={`flex items-center ${passwordValidation.minLength ? 'text-green-600' : 'text-red-500'}`}>
                                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-current text-white text-xs font-bold mr-2">
                                            {passwordValidation.minLength ? '✓' : '✗'}
                                        </span>
                                        At least 8 characters
                                    </li>
                                    <li className={`flex items-center ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-red-500'}`}>
                                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-current text-white text-xs font-bold mr-2">
                                            {passwordValidation.hasUppercase ? '✓' : '✗'}
                                        </span>
                                        One uppercase letter
                                    </li>
                                    <li className={`flex items-center ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-red-500'}`}>
                                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-current text-white text-xs font-bold mr-2">
                                            {passwordValidation.hasLowercase ? '✓' : '✗'}
                                        </span>
                                        One lowercase letter
                                    </li>
                                    <li className={`flex items-center ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-current text-white text-xs font-bold mr-2">
                                            {passwordValidation.hasNumber ? '✓' : '✗'}
                                        </span>
                                        One number
                                    </li>
                                    <li className={`flex items-center ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-red-500'}`}>
                                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-current text-white text-xs font-bold mr-2">
                                            {passwordValidation.hasSpecial ? '✓' : '✗'}
                                        </span>
                                        One special character
                                    </li>
                                </ul>
                            </div>
                        )}

                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">Passwords don't match</p>
                        )}

                        <button 
                            onClick={handlePasswordReset}
                            disabled={isLoading || !passwordValidation.isValid || newPassword !== confirmPassword}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-medium"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Resetting...
                                </span>
                            ) : 'Reset Password'}
                        </button>
                        <button 
                            onClick={handleBackStep}
                            className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all font-medium flex items-center justify-center"
                        >
                            <span className="mr-2">←</span>
                            Back
                        </button>
                    </div>
                );
            
            default:
                return null;
        }
    };

    const renderStepIndicator = () => {
        const steps = [
            { number: 1, label: 'Email', icon: '📧' },
            { number: 2, label: 'Verify', icon: '🛡️' },
            { number: 3, label: 'Reset', icon: '🔒' }
        ];

        return (
            <div className="flex items-center justify-center mb-8">
                {steps.map((stepItem, index) => (
                    <React.Fragment key={stepItem.number}>
                        <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                                step >= stepItem.number 
                                    ? 'bg-blue-600 text-white shadow-lg' 
                                    : 'bg-gray-200 text-gray-500'
                            }`}>
                                {stepItem.icon}
                            </div>
                            <span className={`text-xs mt-2 font-medium ${
                                step >= stepItem.number ? 'text-blue-600' : 'text-gray-400'
                            }`}>
                                {stepItem.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`w-16 h-1 mx-4 rounded-full transition-all ${
                                step > stepItem.number ? 'bg-blue-600' : 'bg-gray-200'
                            }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-blue-600 text-4xl">🔒</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                        <p className="text-gray-600 text-sm">
                            {step === 1 && 'Enter your email to receive verification code'}
                            {step === 2 && 'Check your email for the verification code'}
                            {step === 3 && 'Create a new secure password'}
                        </p>
                    </div>
                    
                    {renderStepIndicator()}
                    
                    {renderStepForm()}
                    
                    {message && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs font-bold">✓</span>
                                </div>
                                {message}
                            </div>
                        </div>
                    )}
                    
                    {errorMessage && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs font-bold">!</span>
                                </div>
                                {errorMessage}
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-8 text-center">
                        <button 
                            onClick={handleBackToLogin}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        >
                            ← Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;