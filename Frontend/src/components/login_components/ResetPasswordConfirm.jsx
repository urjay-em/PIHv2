import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from "react-redux";
import { resetPasswordConfirm, reset } from '../../features/authSlice';
import { AiFillLock } from 'react-icons/ai';
import Spinner from '../login_components/Navigation/spinner';

const ResetPasswordConfirm = () => {
    const { uid, token } = useParams();
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });

    const { new_password, re_new_password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (new_password !== re_new_password) {
            toast.error("Passwords do not match");
            return;
        }

        const userData = {
            uid,
            token,
            new_password
        };

        dispatch(resetPasswordConfirm(userData));
    };

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess) {
            toast.success("Your password was reset successfully.");
            navigate("/login");
        }

        dispatch(reset());
    }, [isError, isSuccess, message, navigate, dispatch]);

    return (
        <div className="container auth__container">
            <h1 className="main__title">Reset Password here <AiFillLock /></h1>

            {isLoading && <Spinner />}

            <form className="auth__form" onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New password"
                    name="new_password"
                    onChange={handleChange}
                    value={new_password}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    name="re_new_password"
                    onChange={handleChange}
                    value={re_new_password}
                    required
                />
                <button className="btn btn-primary" type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPasswordConfirm;
