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

    // Mock API calls (replace with actual implementation)
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
            setOtpTimer(60); // 60 seconds timer
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
                // window.location.href = '/login';
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
                    <div className="space-y-4">
                        <div className="form-group">
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <button 
                            onClick={handleOtpRequest}
                            disabled={isLoading || !email}
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </div>
                );
            
            case 2:
                return (
                    <div className="space-y-4">
                        <div className="form-group">
                            <label htmlFor="otp" className="block text-sm font-medium text-white mb-2">
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-lg tracking-widest"
                            />
                            <p className="text-sm text-gray-200 mt-1">
                                Enter the 6-digit code sent to {email}
                            </p>
                        </div>
                        <button 
                            onClick={handleOtpVerification}
                            disabled={isLoading || otp.length !== 6}
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <button 
                            onClick={resendOtp}
                            disabled={isLoading || otpTimer > 0}
                            className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {otpTimer > 0 ? `Resend OTP (${otpTimer}s)` : isLoading ? 'Sending...' : 'Resend OTP'}
                        </button>
                        <button 
                            onClick={handleBackStep}
                            className="w-full bg-transparent text-white py-2 px-4 rounded-md border border-white hover:bg-white hover:text-teal-700 transition-colors"
                        >
                            Back
                        </button>
                    </div>
                );
            
            case 3:
                const passwordValidation = validatePassword(newPassword);
                return (
                    <div className="space-y-4">
                        <div className="form-group">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-white mb-2">
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
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
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
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {newPassword && (
                            <div className="password-requirements bg-white bg-opacity-10 p-3 rounded-md">
                                <p className="text-white text-sm font-medium mb-2">Password Requirements:</p>
                                <ul className="text-sm space-y-1">
                                    <li className={`${passwordValidation.minLength ? 'text-green-300' : 'text-red-300'}`}>
                                        {passwordValidation.minLength ? '✓' : '✗'} At least 8 characters
                                    </li>
                                    <li className={`${passwordValidation.hasUppercase ? 'text-green-300' : 'text-red-300'}`}>
                                        {passwordValidation.hasUppercase ? '✓' : '✗'} One uppercase letter
                                    </li>
                                    <li className={`${passwordValidation.hasLowercase ? 'text-green-300' : 'text-red-300'}`}>
                                        {passwordValidation.hasLowercase ? '✓' : '✗'} One lowercase letter
                                    </li>
                                    <li className={`${passwordValidation.hasNumber ? 'text-green-300' : 'text-red-300'}`}>
                                        {passwordValidation.hasNumber ? '✓' : '✗'} One number
                                    </li>
                                    <li className={`${passwordValidation.hasSpecial ? 'text-green-300' : 'text-red-300'}`}>
                                        {passwordValidation.hasSpecial ? '✓' : '✗'} One special character
                                    </li>
                                </ul>
                            </div>
                        )}

                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-red-300 text-sm">Passwords don't match</p>
                        )}

                        <button 
                            onClick={handlePasswordReset}
                            disabled={isLoading || !passwordValidation.isValid || newPassword !== confirmPassword}
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                        <button 
                            onClick={handleBackStep}
                            className="w-full bg-transparent text-white py-2 px-4 rounded-md border border-white hover:bg-white hover:text-teal-700 transition-colors"
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
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                step >= stepItem.number 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-gray-300 text-gray-600'
                            }`}>
                                {stepItem.number}
                            </div>
                            <span className="text-xs text-white mt-1">{stepItem.label}</span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`w-16 h-0.5 mx-2 ${
                                step > stepItem.number ? 'bg-orange-500' : 'bg-gray-300'
                            }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-teal-600 p-8 rounded-lg shadow-lg">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-teal-600 text-3xl">🔒</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                        <p className="text-teal-100 text-sm">
                            {step === 1 && 'Enter your email to receive OTP'}
                            {step === 2 && 'Check your email for the verification code'}
                            {step === 3 && 'Create a new secure password'}
                        </p>
                    </div>
                    
                    {renderStepIndicator()}
                    
                    {renderStepForm()}
                    
                    {message && (
                        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                            {message}
                        </div>
                    )}
                    
                    {errorMessage && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            {errorMessage}
                        </div>
                    )}
                    
                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => alert('Redirecting to login...')}
                            className="text-white hover:text-orange-200 text-sm underline"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;