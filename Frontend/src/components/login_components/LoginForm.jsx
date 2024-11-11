import React, { useState } from "react";
import { jwtDecode } from 'jwt-decode';  // Correct named import for jwt-decode
import './LoginForm.css';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setUserRole }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/auth/jwt/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),  // Ensure this is sending the email and password
            });

            const data = await response.json();
            console.log("Response data:", data);  // Log the entire response

            if (data.access) {
                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh_token", data.refresh);

                const decodedToken = jwtDecode(data.access);  // Decode the access token
                const accountType = decodedToken.account_type;  // Get the account type from the token
                const first_name = decodedToken.first_name
                const last_name = decodedToken.last_name

                const fullName = `${first_name} ${last_name}`;
                localStorage.setItem("account_name", fullName )
                localStorage.setItem("account_type", decodedToken.account_type);

                console.log("Decoded account type:", accountType);
                console.log("Decoded account name:", fullName);

                // Set the role and authentication status
                setUserRole(accountType);
                setIsAuthenticated(true);

                // Redirect based on the user's role
                if (accountType === "admin") {
                    navigate("/admin/dashboard");
                } else if (accountType === "cashier") {
                    navigate("/cashier-dashboard");
                } else if (accountType === "info_officer") {
                    navigate("/info-dashboard");
                } else if (accountType === "agent") {
                    navigate("/agent-dashboard");
                }
            } else {
                setError("Failed to retrieve access token.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            setError("Login failed. Please check your credentials.");
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
                    <p>Don't have an account? <a href="#">Register</a></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
