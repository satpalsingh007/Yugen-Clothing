import React, { useState, useEffect } from "react";
import "../style/admin.css";
import { API_URL } from "../config";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/admin-dashboard";
    }
  }, []);

  const login = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed ❌");
        return;
      }

      localStorage.setItem("token", data.token);

      // ✅ redirect
      window.location.href = "/admin-dashboard";
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-card">
        <h2>Admin Login</h2>

        <div className="admin-form">
          <input
            className="admin-input"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            className="admin-input"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button className="admin-button" onClick={login}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;