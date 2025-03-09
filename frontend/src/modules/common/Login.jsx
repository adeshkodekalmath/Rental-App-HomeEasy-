import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data?.email || !data?.password) {
      message.error("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/user/login", data);
      
      if (response.data.success) {
        message.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const isLoggedIn = response.data.user;

        switch (isLoggedIn.type) {
          case "Admin":
            navigate("/adminhome");
            break;
          case "Renter":
            navigate("/renterhome");
            break;
          case "Owner":
            if (isLoggedIn.granted === "ungranted") {
              message.error("Your account is not yet confirmed by the admin");
            } else {
              navigate("/ownerhome");
            }
            break;
          default:
            navigate("/login");
            break;
        }
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        message.error(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        message.error("User doesn't exist");
      }
      navigate("/login");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={data.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="auth-links">
            <Link to="/forgotpassword" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Sign In
          </button>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register">Sign Up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
