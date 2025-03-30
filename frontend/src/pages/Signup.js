import React, { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "../css/signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    birthdate: "",
    gender: "",
    agree: false
  });
  const genderOptions = [
    { value: "", label: "Select gender (optional)", isDisabled: true  },
    { value: "female", label: "Female" },
    { value: "male", label: "Male" },
    { value: "nonbinary", label: "Non-binary" },
    { value: "prefer-not", label: "Prefer not to say" },
  ];
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { email, password, username, birthdate, gender, agree } = formData;
    if (!email || !password || !username || !birthdate) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!agree) {
      setError("You must accept the terms and conditions.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username, birthdate, gender })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Signup failed.");
      }
  
      const result = await response.json();
      console.log("Signup successful:", result);
      alert("Signup successful!");
      navigate("/signin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="spotify-signin">
      <div className="signin-container">
        <h1>Sign up for free to start listening</h1>

        {error && <p className="error-text" style={{color: "white"}}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="date" name="birthdate" placeholder="Date of Birth" value={formData.birthdate} onChange={handleChange} required />

          <Select
            options={genderOptions}
            defaultValue={genderOptions[0]}
            onChange={(selectedOption) =>
              setFormData({ ...formData, gender: selectedOption.value })
            }
            isOptionDisabled={(option) => option.isDisabled}
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: "#2a2a2a",
                border: "none",
                borderRadius: "6px",
                padding: "4px 10px",
                boxShadow: state.isFocused ? "0 0 0 2px #1db95455" : "none",
                width: "90%",
                margin: "20px auto 0 auto",
                fontSize: "15px",
                color: "white",
                cursor: "pointer",
                transition: "all",
                transitionDuration: "0.2s",
                transitionTimingFunction: "ease-in-out"
              }),
              indicatorSeparator: () => ({
                display: "none", // removes that white vertical line!
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "#ccc",
                "&:hover": {
                  color: "#1DB954",
                },
              }),
              singleValue: (base) => ({
                ...base,
                color: "white",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#b3b3b3",
                width: "100%",
                textAlign: "left",
              }),
              // Each option style
              option: (base, state) => ({
                ...base,
                padding: "12px 20px",
                backgroundColor: state.isSelected
                  ? "#1DB954"
                  : state.isFocused
                  ? "#333"
                  : "transparent",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background 0.2s ease-in-out",
              }),
              // Dropdown container
              menu: (base) => ({
                ...base,
                backgroundColor: "#181818", // Dark background
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                padding: "4px 0",
                marginTop: "8px",
                left: "5%",
                width: "90%",
                zIndex: 99, // Prevent overlap issues
              }),

              // Option list inside the dropdown
              menuList: (base) => ({
                ...base,
                padding: 0, // remove default spacing
                maxHeight: "200px", // optional scroll limit
                overflowY: "auto",
              })
            }}
          />

          <label className="checkbox-label">
            <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} />
            <p>I agree to the Terms and Conditions</p>
          </label>

          <button type="submit" className="signin-btn">Sign Up</button>
        </form>

        <hr className="divider" />
        <p style={{color: "white"}}>Already have an account? <a href="/signin" className="signup-link">Sign in here</a></p>
      </div>
    </div>
  );
};

export default Signup;