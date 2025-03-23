import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/style.css"; // Ensure you have this CSS file

const Signin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Both fields are required");
      return;
    }

    // Dummy authentication check
    if (formData.email === "test@example.com" && formData.password === "password") {
      alert("Login successful!");
      navigate("/library"); // Redirect to Library or Home
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="spotify-signin">
      <div className="signin-container">
        <h1>Sign in to Spotify</h1>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email or username" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

          <button type="submit" className="signin-btn">Sign In</button>
        </form>

        <p className="forgot-password">Forgot your password?</p>

        <hr className="divider" />

        <p>Don't have an account? <a href="/signup" className="signup-link">Sign up for Spotify</a></p>
      </div>
    </div>
  );
};

export default Signin;
