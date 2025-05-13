import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignIn/SignIn.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already signed in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Sign in failed");
      }

      const userData = await response.json();
      localStorage.setItem("token", userData.access_token);
      localStorage.setItem("user", JSON.stringify(userData.user));

      console.log("Signed in user:", userData);
      alert(`Welcome, ${userData.user.username}!`);

      setTimeout(() => {
        navigate("/");
      }, 200);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="spotify-signin">
      <div className="signin-container">
        <h1>Sign In to Your Account</h1>

        <p className={`error-text ${error ? "revealed" : ""}`}>{error || " "}</p>

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

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <hr className="divider" />
        <p style={{ color: "white" }}>
          Don't have an account?{" "}
          <a href="/signup" className="signup-link">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;