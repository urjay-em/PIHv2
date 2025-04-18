import React, { useState } from "react";
import axiosInstance from "../../../../features/axiosInstance.js"; // Ensure axiosInstance is configured

const BuyPlotForm = ({ plot, onClose }) => {
  const [formData, setFormData] = useState({
    plot_id: plot.plot_id,
    status: "reserved", // always reserved on submission
    plot_type: plot.plot_type || "",
    price: plot.price || "",
    purchase_date: new Date().toISOString().slice(0, 10),
    client_id: "", // Add client_id field to store the client ID
    block: plot.block, // assuming this is the actual block ID
    plot_name: plot.plot_name || "",
    max_bodies: plot.max_bodies || 1,
    latitude: plot.latitude || "",
    longitude: plot.longitude || "",
    payment_plan: "", // Will select one of the payment plans
  });

  const [errors, setErrors] = useState({});
  const [isClientValid, setIsClientValid] = useState(true); // Track client ID validity
  const [showConfirmation, setShowConfirmation] = useState(false); // Show confirmation before submission

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "plot_type") {
      const staticPrices = {
        stone: 50000,
        lawn: 35000,
        valor: 75000,
        mausoleum: 150000,
      };
      setFormData((prev) => ({
        ...prev,
        plot_type: value,
        price: staticPrices[value] || 0, // Set default price if plot_type is selected
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const validateClientID = async (clientID) => {
    try {
      const response = await axiosInstance.get(`/clients/${clientID}`);
      if (response.status === 200) {
        setIsClientValid(true); // Client exists
        return true;
      }
    } catch (error) {
      setIsClientValid(false); // Client does not exist
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};

    // Validation for required fields
    if (!formData.client_id) {
      formErrors.client_id = "Client ID is required."; // Ensure client_id is filled
    } else {
      const isClientValid = await validateClientID(formData.client_id);
      if (!isClientValid) {
        formErrors.client_id = "Client ID does not exist."; // Show error if client does not exist
      }
    }
    if (!formData.payment_plan) {
      formErrors.payment_plan = "Payment plan is required.";
    }

    // If there are any client-side errors, prevent submission
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Show confirmation dialog before submitting
    setShowConfirmation(true);
  };

  const handleConfirmationSubmit = async () => {
    try {
      // Step 1: Update the status of the plot to "reserved"
      const updatePlotResponse = await axiosInstance.patch(`/plots/${formData.plot_id}/`, {
        status: "reserved", // Update the plot status
      });

      if (updatePlotResponse.status === 200) {
        console.log("Plot status updated to 'reserved'");

        // Step 2: After updating the plot, submit the payment request with client_id
        const paymentRequestResponse = await axiosInstance.post('/payment-requests/', {
          plot_id: formData.plot_id,
          status: formData.status,
          price: formData.price,
          payment_plan: formData.payment_plan,
          rejection_reason: formData.rejection_reason || null,
          client_id: formData.client_id, // Send client_id along with other data
        });

        console.log('Payment request created:', paymentRequestResponse.data);
        onClose();
      }
    } catch (error) {
      console.error('Error processing request:', error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formContainer}>
      <h2 style={styles.formTitle}>Buy Plot</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>Plot ID:</label>
        <span style={styles.value}>{formData.plot_id}</span>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Plot Type:</label>
        <select
          name="plot_type"
          value={formData.plot_type}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">-- Select Plot Type --</option>
          <option value="stone">Stone</option>
          <option value="lawn">Lawn</option>
          <option value="valor">Valor</option>
          <option value="mausoleum">Mausoleum</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Price:</label>
        <span style={styles.value}>{formData.price}</span>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Purchase Date:</label>
        <span style={styles.value}>{formData.purchase_date}</span>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Client ID:</label>
        <input
          type="text"
          name="client_id"
          value={formData.client_id}
          onChange={handleChange}
          style={styles.input}
          placeholder="Enter Client ID"
        />
        {errors.client_id && <span style={styles.error}>{errors.client_id}</span>} {/* Show error if client_id is missing */}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Block ID:</label>
        <span style={styles.value}>{formData.block}</span>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Plot Name:</label>
        <span style={styles.value}>{formData.plot_name}</span>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Max Bodies:</label>
        <span style={styles.value}>{formData.max_bodies}</span>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Latitude:</label>
        <span style={styles.value}>{formData.latitude}</span>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Longitude:</label>
        <span style={styles.value}>{formData.longitude}</span>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Payment Plan:</label>
        <select
          name="payment_plan"
          value={formData.payment_plan}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">-- Select Payment Plan --</option>
          <option value="12">12 months</option>
          <option value="24">24 months</option>
          <option value="36">36 months</option>
          <option value="full">Full payment</option>
        </select>
        {errors.payment_plan && <span style={styles.error}>{errors.payment_plan}</span>}
      </div>

      {errors.non_field_errors && (
        <div style={styles.error}>
          {errors.non_field_errors.map((err, index) => (
            <p key={index}>{err}</p>
          ))}
        </div>
      )}

      <button type="submit" style={styles.submitButton}>
        Submit
      </button>
      <button type="button" onClick={onClose} style={styles.cancelButton}>
        Cancel
      </button>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <>
          <div style={styles.modalOverlay}></div>
          <div style={styles.confirmationDialog}>
            <h3>Please confirm your details</h3>
            <p>Client ID: {formData.client_id}</p>
            <p>Plot Name: {formData.plot_name}</p>
            <p>Price: {formData.price}</p>
            <p>Payment Plan: {formData.payment_plan}</p>
            <button onClick={handleConfirmationSubmit} style={styles.confirmButton}>Confirm</button>
            <button onClick={() => setShowConfirmation(false)} style={styles.cancelButton}>Cancel</button>
          </div>
        </>
      )}

    </form>
  );
};

const styles = {
  formContainer: {
    background: "#2c3e50",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
    maxWidth: "400px",
    margin: "0 auto",
    color: "white",
  },
  formTitle: {
    fontSize: "24px",
    marginBottom: "15px",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: "10px",
  },
  label: {
    display: "block",
    fontSize: "18px",
    marginBottom: "5px",
  },
  value: {
    fontSize: "16px",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
  submitButton: {
    width: "100%",
    padding: "10px",
    fontSize: "18px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  cancelButton: {
    width: "100%",
    padding: "10px",
    fontSize: "18px",
    backgroundColor: "#d9534f",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  confirmationDialog: {
    backgroundColor: "#fff",
    color: "#333",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "400px",
    zIndex: 1000, // Ensure it's on top of other elements
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999, // Just behind the dialog
  },
  confirmButton: {
    width: "100%",
    padding: "10px",
    fontSize: "18px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  
  
};

export default BuyPlotForm;
