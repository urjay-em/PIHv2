import React, { useState, useEffect } from "react";
import './LoginForm.css';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onShowSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Check if user is already logged in by looking for access_token in localStorage
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const role = localStorage.getItem('user_role');
        
        if (token && role) {
            if (role === 'admin') {
                navigate("/admin/dashboard");
            } else if (role === 'client') {
                navigate("/client-dashboard");
            } else {
                navigate("/dashboard");
            }
        }
    }, []); // No dependencies needed

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Dummy login data (for testing purposes)
        const dummyData = {
            access: 'dummyAccessToken',
            refresh: 'dummyRefreshToken',
            account_type: 'admin', // Simulate as admin role
        };

        try {
            // Use dummy data or simulate API response here
            if (email === 'test@example.com' && password === 'password') {
                localStorage.setItem('access_token', dummyData.access);
                localStorage.setItem('refresh_token', dummyData.refresh);
                localStorage.setItem('user_role', dummyData.account_type);

                // Navigate based on user role
                if (dummyData.account_type === 'admin') {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/dashboard");
                }
            } else {
                // Display error message for failed authentication
                setError("Invalid email or password");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>

                {error && <p className="error-message">{error}</p>}

                <div className="input-box">
                    <input
                        type="email"
                        placeholder='Email Address'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FaUser className="icon" />
                </div>

                <div className="input-box">
                    <input
                        type="password"
                        placeholder='Password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <RiLockPasswordFill className="icon" />
                </div>

                <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot Password</a>
                </div>

                <button type="submit">Login</button>

                <div className="register-link">
                    <p>Don't have an account? <a href="#" onClick={onShowSignup}>Register</a></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
