import React from 'react';
import './CreatePassword.css';
import createPasswordImage from '../../assets/CreatePassword.jpg'; // Adjust the path as needed

const CreatePassword = () => {
    return (
        <div className="container">
            <div className="create-password-box">
                <img src={createPasswordImage} alt="Create Password" className="create-password-image" />
                <h2>Create Password</h2>
                <form>
                    <input type="password" placeholder="Enter the password" required />
                    <input type="password" placeholder="Re-enter the password" required />
                    <button type="submit">Create password</button>
                </form>
                <a href="/login">Back to Login</a>
            </div>
        </div>
    );
};

export default CreatePassword;