import React, { useState } from "react";
import axiosInstance from "../../../../features/axiosInstance.js";

const BuyPlotForm = ({ plot, onClose }) => {
  const [formData, setFormData] = useState({
    plot_id: plot.plot_id,
    status: plot.status || "vacant",
    plot_type: plot.plot_type || "",
    purchase_date: new Date().toISOString().slice(0, 10),
    owner_id: "",
    block: plot.block_id,
    plot_name: plot.plot_name || "",
    max_bodies: plot.max_bodies || 1,
    latitude: plot.latitude || "",
    longitude: plot.longitude || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FormData being sent:", formData);
  
    try {
      const response = await axiosInstance.post("/plots/", formData);
      console.log("Form submitted successfully:", response.data);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error.response ? error.response.data : error.message);
      if (error.response && error.response.data) {
        setErrors(error.response.data); 
      }
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
        <label style={styles.label}>Status:</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="vacant">Vacant</option>
          <option value="occupied">Occupied</option>
          <option value="reserved">Reserved</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Plot Type:</label>
        <input
          type="text"
          name="plot_type"
          value={formData.plot_type}
          onChange={handleChange}
          style={styles.input}
          placeholder="Enter plot type"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Purchase Date:</label>
        <span style={styles.value}>{formData.purchase_date}</span>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Owner ID:</label>
        <input
          type="text"
          name="owner_id"
          value={formData.owner_id}
          onChange={handleChange}
          style={styles.input}
          placeholder="Enter owner ID"
        />
        {errors.owner_id && (
          <span style={styles.error}>{errors.owner_id}</span>
        )}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Block ID:</label>
        <span style={styles.value}>{formData.block_id}</span>
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
};

export default BuyPlotForm;
