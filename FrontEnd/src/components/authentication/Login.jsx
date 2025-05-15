// import React, { useState } from "react";
// import "./login.css";
// import loginImage from "../../assets/login.jpg";

// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");

//     const handleLogin = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await fetch("http://localhost:8000/api/auth/login", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ email, password }),
//             });

//             const data = await response.json();
//             if (response.ok) {
//                 alert("Login Successful");
//                 localStorage.setItem("token", data.token); // Store JWT token
//             } else {
//                 setError(data.message || "Invalid Credentials");
//             }
//         } catch (err) {
//             setError("Something went wrong. Please try again.");
//         }
//     };

//     return (
//         <div className="login-container">
//             <div className="login-image-container">
//                 <img src={loginImage} alt="Login" className="login-image" />
//             </div>
//             <div className="login-box">
//                 <h1>SunTrack</h1>
//                 <form onSubmit={handleLogin}>
//                     <div className="input-group">
//                         <label htmlFor="email">User email</label>
//                         <input
//                             type="email"
//                             id="email"
//                             placeholder="Enter the email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="input-group">
//                         <label htmlFor="password">Password</label>
//                         <input
//                             type="password"
//                             id="password"
//                             placeholder="Enter the password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="remember-me">
//                         <input type="checkbox" id="remember-me" />
//                         <label htmlFor="remember-me">Remember Me</label>
//                     </div>
//                     {error && <p className="error-message">{error}</p>}
//                     <button type="submit">Login</button>
//                 </form>
//                 <a href="/forgot-password">Forgot Your Password?</a>
//             </div>
//         </div>
//     );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./login.css";
import loginImage from "../../assets/login.jpg";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate hook
    
    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token); // Store JWT token
                alert("Login Successful");
                navigate("/dashboard"); // Navigate to dashboard after successful login
            } else {
                setError(data.message || "Invalid Credentials");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };
    
    return (
        <div className="login-container">
            <div className="login-image-container">
                <img src={loginImage} alt="Login" className="login-image" />
            </div>
            <div className="login-box">
                <h1>SunTrack</h1>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">User email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter the email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter the password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="remember-me">
                        <input type="checkbox" id="remember-me" />
                        <label htmlFor="remember-me">Remember Me</label>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Login</button>
                </form>
                <a href="/forgot-password">Forgot Your Password?</a>
            </div>
        </div>
    );
};

export default Login;