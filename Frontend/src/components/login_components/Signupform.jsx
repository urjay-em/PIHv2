import { useEffect, useState } from "react";
import React from "react";
import './Signupform.css';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { toast } from 'react-toastify';
import { BiUser } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
//import { register, reset } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
//import Spinner from '../components/Spinner';

const AuthForm = ({ onShowSignup, isSignup }) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        re_password: ""
    });

    const { first_name, last_name, email, password, re_password } = formData;
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignup && password !== re_password) {
            toast.error("Passwords do not match");
        } else {
            const userData = {
                first_name,
                last_name,
                email,
                password,
                re_password
            };
            dispatch(register(userData));
        }
    };

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess || user) {
            navigate("/");
            toast.success("An activation email has been sent to your email. Please check your email");
        }

        dispatch(reset());

    }, [isError, isSuccess, user, navigate, dispatch]);

    return (
        <div className='wrapper'>
            <h1>{isSignup ? "Sign Up" : "Login"}</h1>

            {isLoading && <Spinner />}

            <form onSubmit={handleSubmit}>
                {isSignup && (
                    <>
                        <div className="input-box">
                            <input type="text" placeholder='First Name' name="first_name" required onChange={handleChange} value={first_name} />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="text" placeholder='Last Name' name="last_name" required onChange={handleChange} value={last_name} />
                            <FaUser className="icon" />
                        </div>
                    </>
                )}
                <div className="input-box">
                    <input type="email" placeholder='Email Address' name="email" required onChange={handleChange} value={email} />
                    <FaUser className="icon" />
                </div>
                <div className="input-box">
                    <input type="password" placeholder='Password' name="password" required onChange={handleChange} value={password} />
                    <RiLockPasswordFill className="icon" />
                </div>
                <div className="input-box">
                    <input type="password" placeholder='Confirm Password' name="re_password" required onChange={handleChange} value={re_password} />
                    <RiLockPasswordFill className="icon" />
                </div>
                <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
                <div className="login-link">
                    <p>{isSignup ? "Already have an account?" : "Don't have an account?"} <a href="#" onClick={onShowSignup}>{isSignup ? "Login" : "Register"}</a></p>
                </div>
            </form>
        </div>
    );
};

export default AuthForm;
