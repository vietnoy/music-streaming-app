import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/signin.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Sign in failed");
      }

      const userData = await response.json();
      console.log("Signed in user:", userData);
      alert(`Welcome, ${userData.username}!`);
      navigate("/"); // adjust this route if needed
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="spotify-signin">
      <div className="signin-container">
        <h1>Sign In to Your Account</h1>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            placeholder="Username or Email"
            value={formData.identifier}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="signin-btn">Sign In</button>
        </form>

        <hr className="divider" />
        <p style={{color: "white"}}>Don't have an account? <a href="/signup" className="signup-link">Sign up here</a></p>
      </div>
    </div>
  );
};

export default SignIn;