import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { register, reset } from '../../../../features/authSlice'; 
import Spinner from '../../../../components/login_components/Navigation/spinner';
import './register.css'; 

const RegistrationPage = () => {
    const dispatch = useDispatch();
    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    const [formType, setFormType] = useState(null); // For Account or Client form
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        re_password: '',
        account_type: 'client', // Default to 'client'
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.re_password) {
            toast.error('Passwords do not match');
            return;
        }

        // Dispatch the register action
        dispatch(register(formData));
    };

    // Reset state when component unmounts or on successful registration
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess) {
            toast.success('Account created successfully');
            setFormType(null); // Reset the form
        }

        dispatch(reset()); // Clean up state
    }, [isError, isSuccess, message, dispatch]);

    return (
        <div className="registration-container">
            {isLoading && <Spinner />} {/* Show spinner when loading */}
            {!formType ? (
                <div className="button-container">
                    <button className="button" onClick={() => setFormType('account')}>
                        Create Account
                    </button>
                    <button className="button" onClick={() => setFormType('client')}>
                        Create Client Account
                    </button>
                </div>
            ) : (
                <form className="auth__form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="First Name"
                        name="first_name"
                        onChange={handleChange}
                        value={formData.first_name}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        name="last_name"
                        onChange={handleChange}
                        value={formData.last_name}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                        value={formData.email}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Retype Password"
                        name="re_password"
                        onChange={handleChange}
                        value={formData.re_password}
                        required
                    />
                    {formType === 'account' && (
                        <select
                            name="account_type"
                            onChange={handleChange}
                            value={formData.account_type}
                            required
                        >
                            <option value="admin">Admin</option>
                            <option value="agent">Agent</option>
                            <option value="information">Information</option>
                            <option value="cashier">Cashier</option>
                        </select>
                    )}
                    <button className="button" type="submit">
                        Submit
                    </button>
                    <button className="button" type="button" onClick={() => setFormType(null)}>
                        Back
                    </button>
                </form>
            )}
        </div>
    );
};

export default RegistrationPage;
