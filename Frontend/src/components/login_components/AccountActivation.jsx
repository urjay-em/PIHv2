import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountActivation = ({ match }) => {
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const { uidb64, token } = match.params;

        const activateAccount = async () => {
            try {
                const response = await fetch(`/activate/${uidb64}/${token}/`);
                const data = await response.json();
                if (data.status === "success") {
                    setStatus("success");
                    setTimeout(() => {
                        navigate("/login"); // Redirect to login after activation
                    }, 3000); // Wait for 3 seconds before redirecting
                } else {
                    setStatus("error");
                }
            } catch (error) {
                setStatus("error");
            }
        };

        activateAccount();
    }, [match.params, navigate]);

    return (
        <div className="activation-container">
            {status === "success" && (
                <div>
                    <h2>Your account has been activated successfully!</h2>
                    <p>Redirecting to the login page...</p>
                </div>
            )}
            {status === "error" && (
                <div>
                    <h2>Activation failed</h2>
                    <p>The activation link may be invalid or expired. Please check your email for the correct link.</p>
                </div>
            )}
        </div>
    );
};

export default AccountActivation;
