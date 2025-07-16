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

    // Mock API calls
    const mockApiCall = (endpoint, data, delay = 1000) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (endpoint === 'forgot-password') {
                    if (data.email === 'test@example.com') {
                        resolve({ data: { message: 'OTP sent successfully!' } });
                    } else {
                        reject({ response: { data: { message: 'Email not found' } } });
                    }
                } else if (endpoint === 'verify-otp') {
                    if (data.otp === '123456') {
                        resolve({ data: { message: 'OTP verified successfully!' } });
                    } else {
                        reject({ response: { data: { message: 'Invalid OTP' } } });
                    }
                } else if (endpoint === 'reset-password') {
                    resolve({ data: { message: 'Password reset successful!' } });
                }
            }, delay);
        });
    };

    const handleOtpRequest = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        clearMessages();
        
        try {
            const response = await mockApiCall('forgot-password', { email });
            setMessage(response.data.message);
            setStep(2);
            setOtpTimer(60);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpVerification = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        clearMessages();
        
        try {
            const response = await mockApiCall('verify-otp', { email, otp });
            setMessage(response.data.message);
            setStep(3);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Invalid OTP. Please try again.');
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
            const response = await mockApiCall('reset-password', { email, otp, newPassword });
            setMessage(response.data.message);
            setTimeout(() => {
                alert('Redirecting to login...');
            }, 2000);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Password reset failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resendOtp = async () => {
        setIsLoading(true);
        clearMessages();
        
        try {
            const response = await mockApiCall('forgot-password', { email });
            setMessage('OTP resent successfully!');
            setOtpTimer(60);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
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

    const renderStepForm = () => {
        switch(step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="form-group">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            />
                        </div>
                        <button 
                            onClick={handleOtpRequest}
                            disabled={isLoading || !email}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                        >
                            {isLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </div>
                );
            
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="form-group">
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                OTP Code
                            </label>
                            <input
                                type="text"
                                id="otp"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength="6"
                                required
                                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-center text-lg tracking-widest transition-all"
                            />
                            <p className="text-sm text-gray-600 mt-2">
                                Enter the 6-digit code sent to {email}
                            </p>
                        </div>
                        <button 
                            onClick={handleOtpVerification}
                            disabled={isLoading || otp.length !== 6}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                        >
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <button 
                            onClick={resendOtp}
                            disabled={isLoading || otpTimer > 0}
                            className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                        >
                            {otpTimer > 0 ? `Resend OTP (${otpTimer}s)` : isLoading ? 'Sending...' : 'Resend OTP'}
                        </button>
                        <button 
                            onClick={handleBackStep}
                            className="w-full bg-transparent text-blue-600 py-3 px-4 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors font-semibold"
                        >
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
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="newPassword"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 pr-12 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? '👁️‍🗨️' : '👁️'}
                                </button>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 pr-12 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {newPassword && (
                            <div className="password-requirements bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <p className="text-gray-800 text-sm font-medium mb-2">Password Requirements:</p>
                                <ul className="text-sm space-y-1">
                                    <li className={`${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordValidation.minLength ? '✓' : '✗'} At least 8 characters
                                    </li>
                                    <li className={`${passwordValidation.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordValidation.hasUppercase ? '✓' : '✗'} One uppercase letter
                                    </li>
                                    <li className={`${passwordValidation.hasLowercase ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordValidation.hasLowercase ? '✓' : '✗'} One lowercase letter
                                    </li>
                                    <li className={`${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordValidation.hasNumber ? '✓' : '✗'} One number
                                    </li>
                                    <li className={`${passwordValidation.hasSpecial ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordValidation.hasSpecial ? '✓' : '✗'} One special character
                                    </li>
                                </ul>
                            </div>
                        )}

                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-red-600 text-sm">Passwords don't match</p>
                        )}

                        <button 
                            onClick={handlePasswordReset}
                            disabled={isLoading || !passwordValidation.isValid || newPassword !== confirmPassword}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                        <button 
                            onClick={handleBackStep}
                            className="w-full bg-transparent text-blue-600 py-3 px-4 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors font-semibold"
                        >
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
            { number: 1, label: 'Email' },
            { number: 2, label: 'Verify' },
            { number: 3, label: 'Reset' }
        ];

        return (
            <div className="flex items-center justify-center mb-8">
                {steps.map((stepItem, index) => (
                    <React.Fragment key={stepItem.number}>
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                step >= stepItem.number 
                                    ? 'bg-blue-600 text-white shadow-lg' 
                                    : 'bg-gray-300 text-gray-600'
                            }`}>
                                {stepItem.number}
                            </div>
                            <span className="text-xs text-gray-600 mt-2 font-medium">{stepItem.label}</span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`w-20 h-0.5 mx-4 transition-all ${
                                step > stepItem.number ? 'bg-blue-600' : 'bg-gray-300'
                            }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
            {/* Background Illustration */}
            <div className="absolute inset-0 opacity-5">
                <svg viewBox="0 0 1200 800" className="w-full h-full">
                    {/* Network/Connection lines */}
                    <g stroke="#2563eb" strokeWidth="1" fill="none" opacity="0.3">
                        <path d="M100,100 L200,200 L300,150 L400,250 L500,200 L600,300 L700,250 L800,350 L900,300 L1000,400 L1100,350"/>
                        <path d="M50,200 L150,300 L250,250 L350,350 L450,300 L550,400 L650,350 L750,450 L850,400 L950,500 L1050,450"/>
                        <path d="M200,50 L300,150 L400,100 L500,200 L600,150 L700,250 L800,200 L900,300 L1000,250 L1100,350"/>
                    </g>
                    
                    {/* Dots/Nodes */}
                    <g fill="#2563eb" opacity="0.4">
                        <circle cx="100" cy="100" r="3"/>
                        <circle cx="300" cy="150" r="4"/>
                        <circle cx="500" cy="200" r="3"/>
                        <circle cx="700" cy="250" r="5"/>
                        <circle cx="900" cy="300" r="4"/>
                        <circle cx="1100" cy="350" r="3"/>
                        <circle cx="200" cy="400" r="4"/>
                        <circle cx="600" cy="500" r="3"/>
                        <circle cx="800" cy="600" r="5"/>
                        <circle cx="1000" cy="650" r="4"/>
                    </g>
                    
                    {/* Business/Partnership illustration elements */}
                    <g fill="#3b82f6" opacity="0.1">
                        <circle cx="200" cy="200" r="80"/>
                        <circle cx="400" cy="300" r="60"/>
                        <circle cx="800" cy="400" r="70"/>
                        <circle cx="1000" cy="200" r="50"/>
                    </g>
                    
                    {/* Gear/Settings icons */}
                    <g stroke="#1d4ed8" strokeWidth="2" fill="none" opacity="0.2">
                        <circle cx="150" cy="600" r="30"/>
                        <circle cx="150" cy="600" r="20"/>
                        <circle cx="950" cy="150" r="25"/>
                        <circle cx="950" cy="150" r="15"/>
                    </g>
                    
                    {/* Dollar signs */}
                    <g fill="#fbbf24" opacity="0.3">
                        <text x="300" y="500" fontSize="40" fontWeight="bold">$</text>
                        <text x="700" y="150" fontSize="30" fontWeight="bold">$</text>
                        <text x="1000" y="500" fontSize="35" fontWeight="bold">$</text>
                    </g>
                    
                    {/* Document/File icons */}
                    <g fill="#60a5fa" opacity="0.2">
                        <rect x="50" y="500" width="40" height="50" rx="5"/>
                        <rect x="850" y="600" width="35" height="45" rx="5"/>
                        <rect x="600" y="100" width="30" height="40" rx="3"/>
                    </g>
                </svg>
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                            <p className="text-gray-600 text-sm">
                                {step === 1 && 'Enter your email to receive OTP'}
                                {step === 2 && 'Check your email for the verification code'}
                                {step === 3 && 'Create a new secure password'}
                            </p>
                        </div>
                        
                        {renderStepIndicator()}
                        
                        {renderStepForm()}
                        
                        {message && (
                            <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                                {message}
                            </div>
                        )}
                        
                        {errorMessage && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                {errorMessage}
                            </div>
                        )}
                        
                        <div className="mt-8 text-center">
                            <button 
                                onClick={() => alert('Redirecting to login...')}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium underline transition-colors"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;