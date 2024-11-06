import React, { useState, useEffect } from "react";
import './LoginForm.css';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom'; // For redirecting after successful login

const LoginForm = ({ onShowSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Use to navigate on successful login

    // Check if user is already logged in by looking for access_token in localStorage
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const role = localStorage.getItem('user_role');
        
        if (token && role) {
            // If user is already logged in, navigate to the appropriate dashboard based on their role
            if (role === 'admin') {
                navigate("/admin-dashboard");
            } else if (role === 'client') {
                navigate("/client-dashboard");
            } else {
                navigate("/dashboard");
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from submitting normally
        setError(''); // Reset error before submitting new request

        // Simulate login with dummy data (for testing purposes)
        const dummyData = {
            access: 'dummyAccessToken',
            refresh: 'dummyRefreshToken',
            account_type: 'admin', // Simulate as admin role
        };

        // Simulate successful response
        if (email === 'test@example.com' && password === 'password') {
            // Store dummy tokens in localStorage
            localStorage.setItem('access_token', dummyData.access);
            localStorage.setItem('refresh_token', dummyData.refresh);
            localStorage.setItem('user_role', dummyData.account_type);

            // Redirect user based on their role
            if (dummyData.account_type === 'admin') {
                navigate("/admin-dashboard");
            } else {
                navigate("/dashboard");
            }
        } else {
            // Show error message if authentication fails
            setError("Invalid email or password");
        }
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>

                {/* Display error message if login fails */}
                {error && <p className="error-message">{error}</p>}

                <div className="input-box">
                    <input
                        type="email"
                        placeholder='Email Address'
                        required
                        value={email} // Bind state to input value
                        onChange={(e) => setEmail(e.target.value)} // Update state on input change
                    />
                    <FaUser className="icon" />
                </div>

                <div className="input-box">
                    <input
                        type="password"
                        placeholder='Password'
                        required
                        value={password} // Bind state to input value
                        onChange={(e) => setPassword(e.target.value)} // Update state on input change
                    />
                    <RiLockPasswordFill className="icon" />
                </div>

                <div className="remember-forgot">
                    <label><input type="checkbox" />remember me</label>
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
