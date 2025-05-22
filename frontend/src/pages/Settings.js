import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/MainContent/Settings.css";
import { authFetch } from "../utils/authFetch";
import { API_ENDPOINTS } from '../config';

const tabs = ["Account", "Security"];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("Account");
  const [formData, setFormData] = useState({});
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "" });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    authFetch(API_ENDPOINTS.USER.ME, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setFormData(data))
      .catch(err => console.error("Failed to load user:", err));
  }, []);

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    authFetch(API_ENDPOINTS.USER.ME, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(() => alert("✅ Profile updated"))
      .catch(() => alert("❌ Failed to update"));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    authFetch(API_ENDPOINTS.USER.PASSWORD, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwordForm),
    })
      .then(res => {
        if (!res.ok) throw new Error("Incorrect current password");
        return res.json();
      })
      .then(() => {
        alert("🔒 Password changed");
        setPasswordForm({ current_password: "", new_password: "" });
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="settings-container">
      <aside className="settings-sidebar">
        <button className="home-button" onClick={() => navigate("/")}>
          <FaArrowLeft style={{ marginRight: "6px" }} />
          Back to Home
        </button>
        <h2>⚙ Settings</h2>
        <ul>
          {tabs.map((tab) => (
            <li
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </aside>

      <main className="settings-content">
        <h1>{activeTab} Settings</h1>

        {activeTab === "Account" && (
        <form onSubmit={handleAccountSubmit} className="section form-section">
            <label>
            Username:
            <input
                type="text"
                value={formData.username || ""}
                onChange={(e) => handleChange(e, "username")}
            />
            </label>

            <label>
            Email:
            <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleChange(e, "email")}
            />
            </label>

            <label>
            Gender:
            <select
                value={formData.gender || ""}
                onChange={(e) => handleChange(e, "gender")}
            >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
            </label>

            <label>
            Birthdate:
            <input
                type="date"
                value={formData.birthdate || ""}
                onChange={(e) => handleChange(e, "birthdate")}
            />
            </label>

            <button type="submit" className="primary-button">Save Changes</button>
        </form>
        )}

        {activeTab === "Security" && (
          <form onSubmit={handlePasswordChange} className="section form-section">
            <label>
              Current Password:
              <input
                type="password"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
              />
            </label>

            <label>
              New Password:
              <input
                type="password"
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
              />
            </label>

            <button type="submit" className="primary-button">Change Password</button>
          </form>
        )}
      </main>
    </div>
  );
};

export default SettingsPage;