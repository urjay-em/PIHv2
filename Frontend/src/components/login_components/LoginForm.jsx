import React, { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode'; 
import './LoginForm.css';
import { FaUser } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setUserRole }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if access_token exists in localStorage on mount
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);  // Decode the access token
            const accountType = decodedToken.account_type;
            setUserRole(accountType);  // Set user role globally

            // Redirect based on the user's role
            if (accountType === "admin") {
                navigate("/admin/dashboard");
            } else if (accountType === "cashier") {
                navigate("/cashier/paymentapplication");
            } else if (accountType === "info_officer") {
                navigate("/information_officer/information-officer-map");
            } else if (accountType === "agent") {
                navigate("/agent/dashboard");
            }
              else if (accountType === "client") {
                navigate("/client/dashboard");
            }
            setIsAuthenticated(true);  // Mark as authenticated
        }
    }, [navigate, setUserRole]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/auth/jwt/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.access) {
                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh_token", data.refresh);

                const decodedToken = jwtDecode(data.access);  // Decode the access token
                const accountType = decodedToken.account_type;
                const first_name = decodedToken.first_name;
                const last_name = decodedToken.last_name;

                const fullName = `${first_name} ${last_name}`;
                localStorage.setItem("account_name", fullName);
                localStorage.setItem("account_type", decodedToken.account_type);

                // Set the role and authentication status
                setUserRole(accountType);
                setIsAuthenticated(true);

                // Redirect based on the user's role
                if (accountType === "admin") {
                    navigate("/admin/dashboard");
                } else if (accountType === "cashier") {
                    navigate("/cashier/paymentapplication");
                } else if (accountType === "info_officer") {
                    navigate("/information_officer/information-officer-map");
                } else if (accountType === "agent") {
                    navigate("/agent/dashboard");
                }
                  else if (accountType === "client") {
                    navigate("/client/dashboard");
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
                <h1>Paradise in Heaven</h1>

                {error && <p className="error-message">{error}</p>}

                <div className="input-box">
                    <label htmlFor="email">Email</label>
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
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder='Password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                   
                </div>

                <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot Password</a>
                </div>

                <button type="submit">Login</button>

                <div className="register-link">
                    <p>Interested ? Contact us <a href="#">here</a></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
