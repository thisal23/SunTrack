import React, { useState } from "react";
import "./register.css";
import registerImage from "../../assets/register.jpg"; // ✅ Ensure correct image path

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        roleId: "2",  // Default role (e.g., User)
        isActive: true // ✅ By default, new users are active
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    userName: formData.userName,
                    email: formData.email,
                    password: formData.password,
                    roleId: formData.roleId,
                    isActive: formData.isActive
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess("Registration Successful! You can now log in.");
                setFormData({
                    firstName: "",
                    lastName: "",
                    userName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    roleId: "2",
                    isActive: true
                });
                setError("");
            } else {
                setError(data.message || "Registration failed.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-image-container">
                <img src={registerImage} alt="Register" className="register-image" />
            </div>
            <div className="register-box">
                <h1>SunTrack</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            placeholder="Enter your first name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder="Enter your last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="userName">Username</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            placeholder="Choose a username"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="roleId">Role</label>
                        <select id="roleId" name="roleId" value={formData.roleId} onChange={handleChange}>
                            <option value="1">FleetManager</option>
                            <option value="2">User</option>
                        </select>
                    </div>
                    <div className="input-group checkbox-group">
                        <label htmlFor="isActive">Active</label>
                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={() => setFormData({ ...formData, isActive: !formData.isActive })}
                            />
                        </div>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <button type="submit">Register</button>
                </form>
                <p>Already have an account? <a href="/">Login here</a></p>
            </div>
        </div>
    );
};

export default Register;